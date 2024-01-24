module Test.Game.Signal where

import Prelude

import Control.Monad.Gen (class MonadGen, chooseInt)
import Game.Signal (Signal(..), nthBit)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

genSignal :: forall g. MonadGen g => g Signal
genSignal = Signal <$> chooseInt 0 255

spec :: Spec Unit
spec = do
  describe "Signal" do
    it "show" do
      show (Signal 0)  `shouldEqual` "0000"
      show (Signal 1)  `shouldEqual` "0001"
      show (Signal 15) `shouldEqual` "000F"
      show (Signal 16) `shouldEqual` "0010"
      show (Signal (-1)) `shouldEqual` "FFFF"
    it "nthBit" do
      let signal = Signal 21
      nthBit signal 0 `shouldEqual` true
      nthBit signal 1 `shouldEqual` false
      nthBit signal 2 `shouldEqual` true
      nthBit signal 3 `shouldEqual` false
      nthBit signal 4 `shouldEqual` true
      nthBit signal 5 `shouldEqual` false
      nthBit signal 6 `shouldEqual` false
      nthBit signal 7 `shouldEqual` false
