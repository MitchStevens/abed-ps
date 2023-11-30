module Test.Game.Piece.Port where

import Prelude

import Data.Maybe (Maybe(..))
import Game.Piece (Capacity(..), doubleCapacity, halveCapacity, inputPort, matchingPort, outputPort, portMatches)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)

spec :: Spec Unit
spec = do
  describe "Capacity" do
    it "should double/halve capacity" do
      doubleCapacity OneBit `shouldEqual` Just TwoBit
      doubleCapacity FourBit `shouldEqual` Just EightBit
      (doubleCapacity FourBit >>= doubleCapacity) `shouldEqual` Nothing
      halveCapacity OneBit `shouldEqual` Nothing
      halveCapacity FourBit `shouldEqual` Just TwoBit
  describe "Port" do
    describe "matchingPort" do
      it "should match matching ports" do
        matchingPort (inputPort OneBit) `shouldEqual` outputPort OneBit
        matchingPort (inputPort FourBit) `shouldEqual` outputPort FourBit
      it "should not match the same port type" do
        matchingPort (inputPort OneBit) `shouldNotEqual` inputPort OneBit
      it "should not match different capacities" do
        matchingPort (inputPort OneBit) `shouldNotEqual` outputPort TwoBit
