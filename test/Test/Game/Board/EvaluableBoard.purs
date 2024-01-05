module Test.Game.Board.EvaluableBoard where

import Prelude

import Control.Monad.Error.Class (class MonadError)
import Control.Monad.Except (except)
import Control.Monad.Reader (class MonadReader, ReaderT, asks, runReaderT)
import Control.Monad.State (class MonadState, StateT, evalState, evalStateT, get, put, runStateT)
import Data.Foldable (foldMap, for_)
import Data.FoldableWithIndex (forWithIndex_)
import Data.HeytingAlgebra (ff, tt)
import Data.Identity (Identity)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Tuple (Tuple(..))
import Debug (trace)
import Effect.Aff (Aff)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log)
import Effect.Exception (Error)
import Game.Board (Board(..), RelativeEdge, relative, relativeEdgeLocation)
import Game.Board.EvaluableBoard (EvaluableBoard(..), buildEvaluableBoard, evalWithPortInfo, evalWithPortInfoAt, evaluableBoardPiece, getPort, getPorts, injectInputs, toEvaluableBoard, topologicalSort)
import Game.Board.PortInfo (PortInfo)
import Game.Board.PseudoPiece (isPseudoInput, psuedoPiece)
import Game.Board.Query (buildConnectionMap)
import Game.Direction as Direction
import Game.Level (binaryTestInputs)
import Game.Location (location)
import Game.Piece (Capacity(..), andPiece, eval, inputPort, notPiece, orPiece, outputPort)
import Game.Signal (Signal(..))
import Test.Game.Board (testBoard, toAff)
import Test.Game.Board.Operation (exceptToAff)
import Test.Spec (Spec, SpecT, before, describe, describeOnly, hoistSpec, it, itOnly)
import Test.Spec.Assertions (shouldEqual, shouldNotSatisfy, shouldReturn, shouldSatisfy)

testEvaluableBoard :: EvaluableBoard
testEvaluableBoard = EvaluableBoard
  { pieces: M.fromFoldable
      [ Tuple (location 1 0) notPiece
      , Tuple (location 0 1) notPiece
      , Tuple (location 1 1) andPiece
      , Tuple (location 2 1) notPiece
      -- pseudo ports
      , Tuple (location (-1) 1) (psuedoPiece (inputPort OneBit))
      , Tuple (location 1 (-1)) (psuedoPiece (inputPort OneBit))
      , Tuple (location 3 1) (psuedoPiece (outputPort OneBit))
      ]
  , connections:  M.fromFoldable
    [ Tuple (relative (location 1 1) Direction.Left) (relative (location 0 1) Direction.Right)
    , Tuple (relative (location 1 1) Direction.Up)   (relative (location 1 0) Direction.Right)
    , Tuple (relative (location 2 1) Direction.Left) (relative (location 1 1) Direction.Right)

    , Tuple (relative (location 0 1) Direction.Left) (relative (location (-1) 1) Direction.Right)
    , Tuple (relative (location 1 0) Direction.Left) (relative (location 1 (-1)) Direction.Right)
    , Tuple (relative (location 3 1) Direction.Right) (relative (location 2 1) Direction.Right)
    ]
  , evalOrder: 
      location (-1) 1 : location 0 1 :
      location 1 (-1) : location 1 0 :
      location 1 1 : location 2 1 :
      location 3 1 : Nil

  , psuedoPieceLocations: M.fromFoldable
    [ Tuple Direction.Left  (location (-1) 1)
    , Tuple Direction.Up    (location 1 (-1))
    , Tuple Direction.Right (location 3 1)
    ] 
  }

type EvalM = ReaderT EvaluableBoard (StateT (Map RelativeEdge PortInfo) Aff)

natTransformToAff :: forall a. EvalM a -> Aff a
natTransformToAff = flip runReaderT testEvaluableBoard >>> flip evalStateT M.empty

spec :: Spec Unit
spec = hoistSpec identity (\_ -> natTransformToAff) tests

tests :: SpecT EvalM Unit Identity Unit
tests = do
  describe "EvaluableBoard" do
    let inRelEdge1 = relative (location (-1) 1) Direction.Right
    let inRelEdge2 = relative (location 1 (-1)) Direction.Right
    let outRelEdge = relative (location 3 1) Direction.Right
    let inputs = M.fromFoldable [ Tuple Direction.Left tt, Tuple Direction.Up tt ]
    it "buildEvaluableBoard" do
      EvaluableBoard e1 <- exceptToAff (except $ toEvaluableBoard testBoard)
      let EvaluableBoard e2 = testEvaluableBoard
      e1.pieces               `shouldEqual` e2.pieces
      e1.connections          `shouldEqual` e2.connections
      e1.evalOrder            `shouldEqual` e2.evalOrder
      e1.psuedoPieceLocations `shouldEqual` e2.psuedoPieceLocations
    it "injectInputs" do
      get `shouldReturn` M.empty
      injectInputs inputs
      get `shouldReturn` M.fromFoldable
        [ Tuple inRelEdge1 { connected: false, port: outputPort OneBit, signal: Signal 1}
        , Tuple inRelEdge2 { connected: false, port: outputPort OneBit, signal: Signal 1}
        ]

    it "evalWithPortInfoAt" do
      get `shouldReturn` M.empty
      injectInputs inputs
      use (at inRelEdge1) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1}
      use (at inRelEdge2) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1}

      evalWithPortInfoAt (location (-1) 1)
      evalWithPortInfoAt (location 1 (-1))
      use (at inRelEdge1) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1 }
      use (at inRelEdge2) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1 }

      evalWithPortInfoAt (location 0 1)
      use (at (relative (location 0 1) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: Signal 1 }
      use (at (relative (location 0 1) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: ff }
      
      evalWithPortInfoAt (location 1 0)
      use (at (relative (location 1 0) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: Signal 1 }
      use (at (relative (location 1 0) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: ff }

      evalWithPortInfoAt (location 1 1)
      use (at (relative (location 1 1) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: ff }
      use (at (relative (location 1 1) Direction.Up)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: ff }
      use (at (relative (location 1 1) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: ff }

      evalWithPortInfoAt (location 2 1)
      use (at (relative (location 2 1) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: ff }
      use (at (relative (location 2 1) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: Signal 1 }

      evalWithPortInfoAt (location 3 1)
      use (at (relative (location 2 1) Direction.Right)) `shouldReturn`
        Just { connected: true, port: outputPort OneBit, signal: Signal 1 }
      use (at (relative (location 3 1) Direction.Right)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: Signal 1 }
    it "evalWithPortInfo" do
      let inputs = M.fromFoldable [ Tuple Direction.Left tt, Tuple Direction.Up tt ]
      outputs <- evalWithPortInfo inputs
      outputs `shouldEqual` M.singleton Direction.Right (Signal 1)
    it "eval" do
      for_ (binaryTestInputs [Direction.Left, Direction.Up]) \inputs ->
        eval (evaluableBoardPiece testEvaluableBoard) inputs `shouldEqual` eval orPiece inputs
    it "getPort" do
      getPort Direction.Up    `shouldReturn` Just (inputPort OneBit)
      getPort Direction.Right `shouldReturn` Just (outputPort OneBit)
      getPort Direction.Down  `shouldReturn` Nothing
      getPort Direction.Left  `shouldReturn` Just (inputPort OneBit)
    it "getPorts" do
      getPorts `shouldReturn` M.fromFoldable
        [ Tuple Direction.Up    (inputPort OneBit)
        , Tuple Direction.Right (outputPort OneBit)
        , Tuple Direction.Left  (inputPort OneBit)
        ]
    it "has correct psuedopieces as ports" do
      pieces <- asks (unwrap >>> _.pieces)
      M.lookup (location 1 (-1)) pieces `shouldSatisfy` maybe false isPseudoInput
      M.lookup (location (-1) 1) pieces `shouldSatisfy` maybe false isPseudoInput
      M.lookup (location 3 1) pieces `shouldNotSatisfy` maybe false isPseudoInput

-- todo: fix later
--  describe "topologicalSort" do
--    before (put testBoard) do
--      let getNodes edges =
--            edges
--              # (M.toUnfoldable :: _ -> List _)
--              # foldMap (\(Tuple a b) -> a : b : Nil)
--              # map relativeEdgeLocation
--              # L.nub
--      it "should sort good" do
--        edges <- buildConnectionMap
--        let nodes = getNodes edges
--        topologicalSort nodes edges `shouldEqual`
--          Just (L.fromFoldable [ location 1 0, location 0 1, location 1 1, location 2 1 ])
