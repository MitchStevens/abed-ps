module Test.Game.Piece.FusePiece where

import Prelude

import Data.Foldable (for_)
import Data.Tuple (Tuple(..), uncurry)
import Effect.Class (liftEffect)
import Game.Capacity (Capacity(..))
import Game.Piece (fuseSignals, severSignal)
import Game.Signal (Signal(..), mkSignal)
import Test.Game.Signal (genSignal, shouldBeEquivalentTo)
import Test.QuickCheck ((===))
import Test.QuickCheck.Gen (randomSample)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = do
  describe "FusePiece" do
    it "fuseSignals" do
      fuseSignals OneBit (mkSignal 0) (mkSignal 0) `shouldEqual` mkSignal 0
      fuseSignals OneBit (mkSignal 0) (mkSignal 1) `shouldEqual` mkSignal 1
      fuseSignals OneBit (mkSignal 1) (mkSignal 0) `shouldEqual` mkSignal 2
      fuseSignals OneBit (mkSignal 1) (mkSignal 1) `shouldEqual` mkSignal 3
    it "severSignal" do
      severSignal OneBit (mkSignal 0) `shouldEqual` Tuple (mkSignal 0) (mkSignal 0)
      severSignal OneBit (mkSignal 1) `shouldEqual` Tuple (mkSignal 0) (mkSignal 1)
      severSignal OneBit (mkSignal 2) `shouldEqual` Tuple (mkSignal 1) (mkSignal 0)
      severSignal OneBit (mkSignal 3) `shouldEqual` Tuple (mkSignal 1) (mkSignal 1)
    it "fuse/sever roundtrip" do
      signals <- liftEffect $ randomSample genSignal
      for_ signals \s -> 
        for_ [OneBit, TwoBit, FourBit, EightBit] \c ->
            shouldBeEquivalentTo c
              (uncurry (fuseSignals c) (severSignal c s))
              s