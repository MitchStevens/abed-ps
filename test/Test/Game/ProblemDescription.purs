module Test.Game.ProblemDescription (tests) where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (runExceptT)
import Data.Either (Either, either)
import Data.Foldable (sequence_, traverse_)
import Data.HeytingAlgebra (ff, tt)
import Data.Int.Bits (shr)
import Data.Map (Map, fromFoldable)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..), uncurry)
import Effect.Aff (Aff)
import Effect.Exception (error)
import Game.Board (addPiece, emptyBoard, rotatePieceBy)
import Game.Expression (Expression, Signal(..), evaluate, raw, ref, simplify)
import Game.Location (CardinalDirection(..), location, rotation)
import Game.Location as Direction
import Game.Piece (Capacity(..), Port(..), mkPiece)
import Game.Piece.BasicPiece (idPiece, notPiece, orPiece)
import Game.ProblemDescription (PieceSpecMismatch(..), ProblemDescription, solvedBy)
import Test.Unit (Test, TestSuite, describe, it, test)
import Test.Unit.Assert (shouldEqual)

problemDescription :: ProblemDescription
problemDescription =
  { goal: mkPiece idPiece
  , title: "Double negation"
  , description: "create an idenity from not gate"
  , testCases: [ M.singleton Left ff, M.singleton Left tt ]
  , requiresAutomaticTesting: false
  , pieceSet: S.empty
  , otherRestrictions: M.empty
  }

--problemDescription2 =
--  { goal: mkPiece orPiece
--  , title: "Or Piece from nots and ands"
--  , description: "make an or from only ands"
--  }

fromEither :: forall a b. Show a => Either a b -> Aff b
fromEither = either (show >>> error >>> throwError) pure

tests :: TestSuite
tests = do
  describe "ProblemDescription" do
    describe "solvedBy" do

      it "different ports config" do
        b0 <- fromEither $ emptyBoard 3
        s0 <- runExceptT $ solvedBy problemDescription b0 
        s0 `shouldEqual` throwError
          (DifferentPortConfiguration
            { dir: Direction.Right 
            , received: Nothing
            , expected: Just (Output (Capacity 1))
          })
        b1 <- fromEither $ addPiece (location 2 1) notPiece b0
        s1 <- runExceptT $ solvedBy problemDescription b1
        s1 `shouldEqual` throwError
          (DifferentPortConfiguration
            { dir: Direction.Left
            , received: Nothing
            , expected: Just (Input (Capacity 1))
          })
      it "different port" do
        b0 <- fromEither $ emptyBoard 3
          >>= addPiece (location 2 1) notPiece
          >>= rotatePieceBy (location 2 1) (rotation 2)
        s0 <- runExceptT $ solvedBy problemDescription b0 
        s0 `shouldEqual` throwError
          (DifferentPort
            { dir: Direction.Right
            , received: Input (Capacity 1)
            , expected: Output (Capacity 1)
          })
      it "failed test case" do
        b0 <- fromEither $ emptyBoard 3
          >>= addPiece (location 0 1) notPiece
          >>= addPiece (location 2 1) notPiece
        s0 <- runExceptT $ solvedBy problemDescription b0 
        s0 `shouldEqual` throwError
          (FailedTestCase 
            { inputs: M.singleton Direction.Left ff
            , received: M.singleton Direction.Right tt
            , expected: M.singleton Direction.Right ff
          })
      it "solved problem successfully" do
        b0 <- fromEither $ emptyBoard 3
          >>= addPiece (location 0 1) notPiece
          >>= addPiece (location 1 1) idPiece
          >>= addPiece (location 2 1) notPiece
        s0 <- runExceptT $ solvedBy problemDescription b0 
        s0 `shouldEqual` pure true