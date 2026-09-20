module Test.Game.Port where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Port (PortType(..), createPort, hasPort, inputPort, isInput, isOutput, isReadable, isWritable, matchingPort, noPort, outputPort, portMatches)
import Game.Signal (Signal(..))
import Test.QuickCheck (assertLessThan)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec =
  describe "Port" do
    describe "matchingPort" do
      it "should match matching ports" do
        matchingPort (inputPort OneBit) `shouldEqual` Just (outputPort OneBit)
        matchingPort (inputPort FourBit) `shouldEqual` Just (outputPort FourBit)
      it "should not match the same port type" do
        matchingPort (inputPort OneBit) `shouldNotEqual` Just (inputPort OneBit)
      it "should not match different capacities" do
        matchingPort (inputPort OneBit) `shouldNotEqual` Just (outputPort TwoBit)
    describe "isReadable / isWritable" do
      -- (port type, readable, writable): the wormhole tail reads like an
      -- input, the mouth writes like an output.
      for_ [ Tuple Input (Tuple true false), Tuple Output (Tuple false true), Tuple WormholeIn (Tuple false true), Tuple WormholeOut (Tuple true false) ] \(Tuple portType (Tuple readable writable)) ->
        it ("classifies " <> show portType) do
          isReadable (createPort portType OneBit) `shouldEqual` readable
          isWritable (createPort portType OneBit) `shouldEqual` writable
      it "is never both readable and writable" do
        for_ [ Input, Output, WormholeIn, WormholeOut, NoPort ] \portType ->
          (isReadable (createPort portType OneBit) && isWritable (createPort portType OneBit)) `shouldEqual` false
    describe "noPort" do
      it "isn't a port" do
        hasPort noPort `shouldEqual` false
      it "is the one value of NoPort, whatever capacity it's built with" do
        createPort NoPort EightBit `shouldEqual` noPort
      it "is neither an input, an output, readable nor writable" do
        isInput noPort `shouldEqual` false
        isOutput noPort `shouldEqual` false
        isReadable noPort `shouldEqual` false
        isWritable noPort `shouldEqual` false
      it "matches nothing, not even itself" do
        matchingPort noPort `shouldEqual` Nothing
        portMatches noPort noPort `shouldEqual` false
      it "leaves every real port a port" do
        for_ [ Input, Output, WormholeIn, WormholeOut ] \portType ->
          hasPort (createPort portType OneBit) `shouldEqual` true
