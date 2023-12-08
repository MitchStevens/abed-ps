module Test.Game.Piece.Port where

import Prelude

import Data.Maybe (Maybe(..))
import Game.Piece (Capacity(..), clampSignal, doubleCapacity, halveCapacity, inputPort, matchingPort, outputPort, portMatches)
import Game.Signal (Signal(..))
import Test.QuickCheck (assertLessThan)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = do
  describe "Capacity" do
    it "should double/halve capacity" do
      doubleCapacity OneBit `shouldEqual` Just TwoBit
      doubleCapacity FourBit `shouldEqual` Just EightBit
      (doubleCapacity FourBit >>= doubleCapacity) `shouldEqual` Nothing
      halveCapacity OneBit `shouldEqual` Nothing
      halveCapacity FourBit `shouldEqual` Just TwoBit
    it "should clamp signals based on capacity" do
      clampSignal OneBit (Signal 0) `shouldEqual` Signal 0
      clampSignal OneBit (Signal 1) `shouldEqual` Signal 1
      clampSignal OneBit (Signal 2) `shouldEqual` Signal 0
      clampSignal OneBit (Signal 3) `shouldEqual` Signal 1

      clampSignal TwoBit (Signal 0) `shouldEqual` Signal 0
      clampSignal TwoBit (Signal 1) `shouldEqual` Signal 1
      clampSignal TwoBit (Signal 2) `shouldEqual` Signal 2
      clampSignal TwoBit (Signal 3) `shouldEqual` Signal 3
      clampSignal TwoBit (Signal 4) `shouldEqual` Signal 0

      clampSignal EightBit (Signal 0) `shouldEqual` Signal 0
      clampSignal EightBit (Signal 1) `shouldEqual` Signal 1
      clampSignal EightBit (Signal 255) `shouldEqual` Signal 255
      clampSignal EightBit (Signal 256) `shouldEqual` Signal 0

      quickCheck \s -> clampSignal OneBit (Signal s)    `assertLessThan` Signal 2
      quickCheck \s -> clampSignal TwoBit (Signal s)    `assertLessThan` Signal 4
      quickCheck \s -> clampSignal FourBit (Signal s)   `assertLessThan` Signal 16
      quickCheck \s -> clampSignal EightBit (Signal s)  `assertLessThan` Signal 256


  describe "Port" do
    describe "matchingPort" do
      it "should match matching ports" do
        matchingPort (inputPort OneBit) `shouldEqual` outputPort OneBit
        matchingPort (inputPort FourBit) `shouldEqual` outputPort FourBit
      it "should not match the same port type" do
        matchingPort (inputPort OneBit) `shouldNotEqual` inputPort OneBit
      it "should not match different capacities" do
        matchingPort (inputPort OneBit) `shouldNotEqual` outputPort TwoBit
