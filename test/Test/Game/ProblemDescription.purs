module Test.Game.ProblemDescription (tests) where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (lift, runExceptT)
import Control.Monad.State (get)
import Data.Either (Either(..), either)
import Data.Foldable (sequence_, traverse_)
import Data.HeytingAlgebra (ff, tt)
import Data.Int.Bits (shr)
import Data.Map (Map, fromFoldable)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..), uncurry)
import Effect.Aff (Aff, error)
import Effect.Exception (error)
import Game.Board (standardBoard)
import Game.Board.Operation (BoardT, addPiece, emptyBoard, evalBoardM, execBoardM, rotatePieceBy)
import Game.Expression (Expression, Signal(..), evaluate, raw, ref, simplify)
import Game.Location (location, rotation)
import Game.Location as Direction
import Game.Piece.BasicPiece (idPiece, notPiece, orPiece)
import Game.Piece.Port (Capacity(..), Port(..))
import Game.ProblemDescription (PieceSpecMismatch(..), ProblemDescription, solvedBy)
import Test.Game.Board (runBoardTest)
import Test.Unit (Test, TestSuite, describe, it, test, testOnly)
import Test.Unit.Assert (equal, shouldEqual)

problemDescription :: ProblemDescription
problemDescription =
  { goal: idPiece
  , title: "Double negation"
  , description: "create an idenity from not gate"
  , testCases: [ M.singleton Direction.Left ff, M.singleton Direction.Left tt ]
  , requiresAutomaticTesting: false
  , pieceSet: S.empty
  , otherRestrictions: []
  }

tests :: TestSuite
tests = do
  describe "ProblemDescription" do
    describe "solvedBy" do
      it "different ports config" $ runBoardTest standardBoard do
        b0 <- get
        let (s0 :: Aff (Either _ _)) = runExceptT $ solvedBy problemDescription b0 
        let err0 = DifferentPortConfiguration { dir: Direction.Right , received: Nothing , expected: Just (Output (Capacity 1)) }
        lift $ equal (Left err0) =<< s0
        addPiece (location 2 1) notPiece
        b1 <- get
        let s1 = runExceptT $ solvedBy problemDescription b1
        let err1 = DifferentPortConfiguration { dir: Direction.Left , received: Nothing , expected: Just (Input (Capacity 1)) }
        lift $ equal (Left err0) =<< s0
        lift $ equal (Left err1) =<< s1
      it "different port" $ runBoardTest standardBoard do
        addPiece (location 2 1) notPiece
        rotatePieceBy (location 2 1) (rotation 2)
        b0 <- get
        let s0 = runExceptT $ solvedBy problemDescription b0 
        let err0 = DifferentPort { dir: Direction.Right , received: Input (Capacity 1) , expected: Output (Capacity 1) }
        lift $ equal (Left err0) =<< s0
      --it "failed test case" $ runBoardTest standardBoard do
      --  addPiece (location 0 1) notPiece
      --  addPiece (location 2 1) notPiece
      --  b0 <- get
      --  let s0 = runExceptT $ solvedBy problemDescription b0 
      --  let err0 = FailedTestCase { inputs: M.singleton Direction.Left ff , received: M.singleton Direction.Right tt , expected: M.singleton Direction.Right ff }
      --  lift $ equal (Left err0) =<< s0
      --  pure unit
      testOnly "solved problem successfully" $ runBoardTest standardBoard do
        addPiece (location 0 1) notPiece
        addPiece (location 1 1) idPiece
        addPiece (location 2 1) notPiece
        b0 <- get
        let s0 = runExceptT $ solvedBy problemDescription b0 
        lift $ equal (Right true) =<< s0