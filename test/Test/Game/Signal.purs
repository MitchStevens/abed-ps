module Test.Game.Signal where

import Prelude

import Game.Signal (Signal(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = do
  describe "Signal" do
    it "show" do
      show (Signal 0)  `shouldEqual` "0000"
      show (Signal 1)  `shouldEqual` "0001"
      show (Signal 15) `shouldEqual` "000f"
      show (Signal 16) `shouldEqual` "0010"
      show (Signal (-1)) `shouldEqual` "ffff"