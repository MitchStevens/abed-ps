module Test.Game.Level.GenerateTestCases where

import Prelude

import Data.Array (range)
import Data.Map as M
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Level.GenerateTestCases (allTestCases)
import Game.Piece (idPiece, mkConnectionPiece, notPiece, xorPiece)
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction as Direction
import Game.Piece.Signal (Signal(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = do
  describe "Game.Level.GenerateTestCases" do
    describe "allTestCases" do
      it "id piece" do
        allTestCases idPiece `shouldEqual`
          [ M.singleton Direction.Left (Signal 0)
          , M.singleton Direction.Left (Signal 1) 
          ]
      it "not piece" do
        allTestCases notPiece `shouldEqual`
          [ M.singleton Direction.Left (Signal 0)
          , M.singleton Direction.Left (Signal 1) 
          ]
      it "xor piece" do
        allTestCases xorPiece `shouldEqual` do
          x <- [ Signal 0, Signal 1 ]
          y <- [ Signal 0, Signal 1 ]
          pure $ M.fromFoldable [ Tuple Direction.Up x, Tuple Direction.Left y ]
      it "8 bit id piece" do
        let eightBidId = mkConnectionPiece { outputs: S.singleton Direction.Right, capacity: EightBit}
        allTestCases eightBidId `shouldEqual` do
          signal <- Signal <$> range 0 255
          pure $ M.singleton Direction.Left signal
    describe "generateRandomTestCase" do
      pure unit