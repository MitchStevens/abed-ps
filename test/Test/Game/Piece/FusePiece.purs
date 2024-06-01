module Test.Game.Piece.FusePiece where

import Prelude

import Data.Foldable (for_)
import Data.Tuple (Tuple(..), uncurry)
import Game.Piece.Capacity (Capacity(..), clampSignal)
import Game.Piece (fuseSignals, severSignal)
import Game.Piece.Signal (Signal(..))
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = do
  describe "FusePiece" do
    it "fuseSignals" do
      fuseSignals OneBit (Signal 0) (Signal 0) `shouldEqual` Signal 0
      fuseSignals OneBit (Signal 0) (Signal 1) `shouldEqual` Signal 1
      fuseSignals OneBit (Signal 1) (Signal 0) `shouldEqual` Signal 2
      fuseSignals OneBit (Signal 1) (Signal 1) `shouldEqual` Signal 3
    it "severSignal" do
      severSignal OneBit (Signal 0) `shouldEqual` Tuple (Signal 0) (Signal 0)
      severSignal OneBit (Signal 1) `shouldEqual` Tuple (Signal 0) (Signal 1)
      severSignal OneBit (Signal 2) `shouldEqual` Tuple (Signal 1) (Signal 0)
      severSignal OneBit (Signal 3) `shouldEqual` Tuple (Signal 1) (Signal 1)
    it "fuse/sever roundtrip" do
      for_ [OneBit, TwoBit, FourBit, EightBit] \c ->
        quickCheck $ \s -> 
          clampSignal c (uncurry (fuseSignals c) (severSignal c (Signal s))) === clampSignal c (Signal s)
