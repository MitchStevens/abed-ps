module Test.Game.Board.BoardDelta (tests) where

import Prelude

import Control.Monad.State (get, lift)
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Game.Board (Board(..), addPiece, execBoardM, execBoardT, standardBoard)
import Game.Board.BoardDelta (BoardDelta(..), invertBoardDelta, runDelta, undoDelta)
import Game.Location (location, rotation)
import Game.Piece (PieceId(..))
import Game.Piece.BasicPiece (notPiece)
import Partial.Unsafe (unsafeCrashWith)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (shouldEqual)

testDeltas = 
  [ AddedPiece (location 0 0) (PieceId "idPiece")
  , RemovedPiece (location 0 0) (PieceId "idPiece")
  , MovedPiece (location 0 0) (location 2 2)
  , RotatedPiece (location 1 1) (rotation 1)
  ]

testBoard :: Board
testBoard = either (show >>> unsafeCrashWith) identity $ 
  flip execBoardM standardBoard do
    addPiece (location 1 1) notPiece

tests :: TestSuite
tests = do
  describe "BoardDelta" do
    it "invertBoardDelta" do
      for_ testDeltas $ \d -> 
        invertBoardDelta (invertBoardDelta d) `shouldEqual` d
    it "runDelta/undoDelta" do
      for_ testDeltas $ \d ->
        flip execBoardT testBoard $ do
          runDelta d
          undoDelta d
          board <- get
          lift $ board `shouldEqual` testBoard
