module Test.Game.Board.EvaluableBoard where

import Prelude

import Control.Monad.Except (except)
import Control.Monad.Reader (ReaderT, asks, runReaderT)
import Control.Monad.State (StateT, evalState, evalStateT, get)
import Data.Foldable (for_)
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
import Game.Board (EvaluableBoard(..), RelativeEdge, buildConnectionMap, evalWithPortInfo, evalWithPortInfoAt, evaluableBoardPiece, getOuterPort, injectInputs, isPseudoInput, psuedoPiece, relative, standardBoard, toEvaluableBoard, topologicalSort)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Level (binaryTestInputs)
import Game.Location (location)
import Game.Piece (andPiece, eval, getPorts, notPiece, orPiece)
import Game.Port (inputPort, outputPort)
import Game.PortInfo (PortInfo)
import Test.Game.Board (testBoard)
import Test.Game.Board.Operation (exceptToAff)
import Test.Spec (Spec, SpecT, describe, describeOnly, hoistSpec, it, itOnly)
import Test.Spec.Assertions (fail, shouldEqual, shouldNotSatisfy, shouldReturn, shouldSatisfy)
import Test.Unit.AssertExtra (shouldBeBefore, shouldEqualMap)

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
  describe "Game.Board.EvaluableBoard" do
    describe "buildConnectionMap" do
      it "withStandardBoard" do
        let c0 = evalState buildConnectionMap standardBoard
        M.size c0 `shouldEqual` 0

      it "with test board" do
        let c0 = evalState buildConnectionMap testBoard
        M.size c0 `shouldEqual` 3

    it "topologicalSort" do
      let in1 = location 0 1
      let in2 = location 1 0
      let mid = location 1 1
      let out = location 2 1
      let connections = evalState buildConnectionMap testBoard
      case topologicalSort (L.fromFoldable [in1, in2, mid, out]) connections of
        Nothing -> fail "no topo sort"
        Just sortedLocations -> do
          (location 0 1 `shouldBeBefore` location 1 1) sortedLocations
          (location 1 0 `shouldBeBefore` location 1 1) sortedLocations
          (location 1 1 `shouldBeBefore` location 2 1) sortedLocations
          (location 0 1 `shouldBeBefore` location 2 1) sortedLocations

    describe "testBoard" do
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

        info <- get
        info `shouldEqualMap` M.fromFoldable
          [ Tuple inRelEdge1 { connected: false, port: outputPort OneBit, signal: tt }
          , Tuple inRelEdge2 { connected: false, port: outputPort OneBit, signal: tt }
          ]

      it "evalWithPortInfoAt" do
        get `shouldReturn` M.empty
        injectInputs inputs

        use (at inRelEdge1) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: tt }
        use (at inRelEdge2) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: tt }

        evalWithPortInfoAt (location (-1) 1)
        evalWithPortInfoAt (location 1 (-1))
        use (at inRelEdge1) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: tt }
        use (at inRelEdge2) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: tt }

        evalWithPortInfoAt (location 0 1)
        use (at (relative (location 0 1) Direction.Left)) `shouldReturn`
          Just { connected: true, port: inputPort OneBit, signal: tt }
        use (at (relative (location 0 1) Direction.Right)) `shouldReturn`
          Just { connected: false, port: outputPort OneBit, signal: ff }
        
        evalWithPortInfoAt (location 1 0)
        use (at (relative (location 1 0) Direction.Left)) `shouldReturn`
          Just { connected: true, port: inputPort OneBit, signal: tt }
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
          Just { connected: false, port: outputPort OneBit, signal: tt }

        evalWithPortInfoAt (location 3 1)
        use (at (relative (location 2 1) Direction.Right)) `shouldReturn`
          Just { connected: true, port: outputPort OneBit, signal: tt }
        use (at (relative (location 3 1) Direction.Right)) `shouldReturn`
          Just { connected: true, port: inputPort OneBit, signal: tt }
      it "evalWithPortInfo" do
        let inputs = M.fromFoldable [ Tuple Direction.Left tt, Tuple Direction.Up tt ]
        outputs <- evalWithPortInfo inputs
        outputs `shouldEqual` M.singleton Direction.Right tt
      it "eval" do
        for_ (binaryTestInputs [Direction.Left, Direction.Up]) \inputs ->
          eval (evaluableBoardPiece testEvaluableBoard) inputs `shouldEqual` eval orPiece inputs
      it "getPorts" do
        asks (evaluableBoardPiece >>> getPorts) `shouldReturn` M.fromFoldable
          [ Tuple Direction.Up    (inputPort OneBit)
          , Tuple Direction.Right (outputPort OneBit)
          , Tuple Direction.Left  (inputPort OneBit)
          ]
      it "has correct psuedopieces as ports" do
        pieces <- asks (unwrap >>> _.pieces)
        M.lookup (location 1 (-1)) pieces `shouldSatisfy` maybe false isPseudoInput
        M.lookup (location (-1) 1) pieces `shouldSatisfy` maybe false isPseudoInput
        M.lookup (location 3 1) pieces `shouldNotSatisfy` maybe false isPseudoInput
      it "getOuterPort" do
        getOuterPort Direction.Up    `shouldReturn` Just zero
        getOuterPort Direction.Right `shouldReturn` Just zero
        getOuterPort Direction.Down  `shouldReturn` Nothing
        getOuterPort Direction.Left  `shouldReturn` Just zero

    --describe "test crossover board" do
    --  before_ (exceptToAff (except $ toEvaluableBoard testBoardCrossOver)) do
    --    it "should have exactly 18 pieces" \(EvaluableBoard e) -> 
    --      length e.pieces `shouldEqual` (14 + 4) -- 14 pieces and 4 psuedo pieces
    --    it "should have 4 psuedoports" \(EvaluableBoard e) ->
    --      e.psuedoPieceLocations `shouldEqual` M.fromFoldable
    --        [ Tuple Direction.Left  (location (-1) 2)
    --        , Tuple Direction.Up    (location 2 (-1))
    --        , Tuple Direction.Right (location 5 2)
    --        , Tuple Direction.Down (location 2 5)
    --        ] 
    --    it "piece should have 4 ports" \evaluableBoard -> do
    --      let piece = evaluableBoardPiece evaluableBoard
    --      getPorts piece `shouldEqual` M.fromFoldable
    --        [ Tuple Direction.Up    (inputPort OneBit)
    --        , Tuple Direction.Right (outputPort OneBit)
    --        , Tuple Direction.Left  (inputPort OneBit)
    --        , Tuple Direction.Down (outputPort OneBit)
    --        ]
    --    it "should faithfully return outputs when provided inputs" \evaluableBoard -> do
    --      let piece = evaluableBoardPiece evaluableBoard
    --      let inputs = M.fromFoldable [ Tuple Direction.Left tt, Tuple Direction.Up tt ]
    --      let outputs = evalWith piece inputs

    --      outputs `shouldEqual` M.fromFoldable
    --        [ Tuple Direction.Right (Signal 1)
    --        , Tuple Direction.Down (Signal 1) 
    --        ]

