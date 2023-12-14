module Test.Game.Board.EvaluableBoard where

import Prelude

import Component.Board (evaluateBoard)
import Control.Monad.Error.Class (class MonadError)
import Control.Monad.State (class MonadState, evalState, evalStateT, get, put, runStateT)
import Data.Foldable (for_)
import Data.HeytingAlgebra (ff, tt)
import Data.Identity (Identity)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.List (List(..), (:))
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Debug (trace)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log)
import Effect.Exception (Error)
import Game.Board (Board(..), RelativeEdge, relative)
import Game.Board.EvaluableBoard (EvaluableBoard(..), buildEvaluableBoard, evalWithPortInfo, evalWithPortInfoAt, evaluableBoardPiece, injectInputs)
import Game.Board.PortInfo (PortInfo)
import Game.Board.PseudoPiece (psuedoPiece)
import Game.Direction as Direction
import Game.Level (binaryTestInputs)
import Game.Location (location)
import Game.Piece (Capacity(..), andPiece, eval, inputPort, notPiece, orPiece, outputPort)
import Game.Signal (Signal(..))
import Test.Game.Board (testBoard, toAff)
import Test.Game.Board.Operation (exceptToAff)
import Test.Spec (Spec, SpecT, describe, describeOnly, hoistSpec, it, itOnly)
import Test.Spec.Assertions (shouldEqual, shouldReturn)

testEvaluableBoard :: EvaluableBoard
testEvaluableBoard = EvaluableBoard
  { pieces: M.fromFoldable
      [ Tuple (location 1 0) notPiece
      , Tuple (location 0 1) notPiece
      , Tuple (location 1 1) andPiece
      , Tuple (location 2 1) notPiece
      -- pseudo ports
      , Tuple (location (-1) 1) (psuedoPiece (outputPort OneBit))
      , Tuple (location 1 (-1)) (psuedoPiece (outputPort OneBit))
      , Tuple (location 3 1) (psuedoPiece (inputPort OneBit))
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
  , ports: M.fromFoldable
    [ Tuple Direction.Left  (inputPort OneBit)
    , Tuple Direction.Up    (inputPort OneBit)
    , Tuple Direction.Right (outputPort OneBit)
    ]
  , portLocations: M.fromFoldable
    [ Tuple Direction.Left  (relative (location (-1) 1) Direction.Right)
    , Tuple Direction.Up    (relative (location 1 (-1)) Direction.Right)
    , Tuple Direction.Right (relative (location 3 1) Direction.Right)
    ] 
  }


spec :: Spec Unit
spec = hoistSpec identity (\_ -> flip evalStateT M.empty) tests

tests :: forall g. MonadState (Map RelativeEdge PortInfo) g => MonadError Error g => MonadEffect g
  => SpecT g Unit Identity Unit
tests = do
  describe "EvaluableBoard" do
    let inRelEdge1 = relative (location (-1) 1) Direction.Right
    let inRelEdge2 = relative (location 1 (-1)) Direction.Right
    let outRelEdge = relative (location 3 1) Direction.Right
    let inputs = M.fromFoldable [ Tuple Direction.Left tt, Tuple Direction.Up tt ]
    it "buildEvaluableBoard" do
      EvaluableBoard e1 <- evalStateT (exceptToAff (buildEvaluableBoard Nothing)) testBoard
      let EvaluableBoard e2 = testEvaluableBoard
      e1.pieces         `shouldEqual` e2.pieces
      e1.connections    `shouldEqual` e2.connections
      e1.evalOrder      `shouldEqual` e2.evalOrder
      e1.ports          `shouldEqual` e2.ports
      e1.portLocations  `shouldEqual` e2.portLocations
    it "injectInputs" do
      get `shouldReturn` M.empty
      injectInputs testEvaluableBoard inputs
      get `shouldReturn` M.fromFoldable
        [ Tuple inRelEdge1 { connected: false, port: outputPort OneBit, signal: Signal 1}
        , Tuple inRelEdge2 { connected: false, port: outputPort OneBit, signal: Signal 1}
        ]
    it "evalWithPortInfoAt" do
      get `shouldReturn` M.empty
      injectInputs testEvaluableBoard inputs
      use (at inRelEdge1) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1}
      use (at inRelEdge2) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1}

      evalWithPortInfoAt testEvaluableBoard (location (-1) 1)
      evalWithPortInfoAt testEvaluableBoard (location 1 (-1))
      use (at inRelEdge1) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1 }
      use (at inRelEdge2) `shouldReturn` Just { connected: false, port: outputPort OneBit, signal: Signal 1 }

      evalWithPortInfoAt testEvaluableBoard (location 0 1)
      use (at (relative (location 0 1) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: Signal 1 }
      use (at (relative (location 0 1) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: ff }
      
      evalWithPortInfoAt testEvaluableBoard (location 1 0)
      use (at (relative (location 1 0) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: Signal 1 }
      use (at (relative (location 1 0) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: ff }

      evalWithPortInfoAt testEvaluableBoard (location 1 1)
      use (at (relative (location 1 1) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: ff }
      use (at (relative (location 1 1) Direction.Up)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: ff }
      use (at (relative (location 1 1) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: ff }

      evalWithPortInfoAt testEvaluableBoard (location 2 1)
      use (at (relative (location 2 1) Direction.Left)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: ff }
      use (at (relative (location 2 1) Direction.Right)) `shouldReturn`
        Just { connected: false, port: outputPort OneBit, signal: Signal 1 }

      evalWithPortInfoAt testEvaluableBoard (location 3 1)
      use (at (relative (location 2 1) Direction.Right)) `shouldReturn`
        Just { connected: true, port: outputPort OneBit, signal: Signal 1 }
      use (at (relative (location 3 1) Direction.Right)) `shouldReturn`
        Just { connected: true, port: inputPort OneBit, signal: Signal 1 }
    it "evalWithPortInfo" do
      let inputs = M.fromFoldable [ Tuple Direction.Left tt, Tuple Direction.Up tt ]
      outputs <- evalWithPortInfo testEvaluableBoard inputs
      outputs `shouldEqual` M.singleton Direction.Right (Signal 1)
    it "eval" do
      for_ (binaryTestInputs [Direction.Left, Direction.Up]) \inputs ->
        eval (evaluableBoardPiece testEvaluableBoard) inputs `shouldEqual` eval orPiece inputs