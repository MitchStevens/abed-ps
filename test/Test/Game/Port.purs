module Test.Game.Port where

import Prelude

import Data.Array.NonEmpty (cons')
import Data.Maybe (Maybe(..))
import Game.Capacity (Capacity(..))
import Game.Port (PortType, createPort, inputPort, matchingPort, outputPort, Port)
import Game.Port as Port
import Game.Signal (Signal(..))
import Test.Game.Capacity (genCapacity)
import Test.QuickCheck (assertLessThan)
import Test.QuickCheck.Gen (Gen, elements)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

genPortType :: Gen PortType
genPortType = elements $ cons' Port.Input [ Port.Output ]

genPort :: Gen Port
genPort = createPort <$> genPortType <*> genCapacity

spec :: Spec Unit
spec =
  describe "Port" do
    describe "matchingPort" do
      it "should match matching ports" do
        matchingPort (inputPort OneBit) `shouldEqual` outputPort OneBit
        matchingPort (inputPort FourBit) `shouldEqual` outputPort FourBit
      it "should not match the same port type" do
        matchingPort (inputPort OneBit) `shouldNotEqual` inputPort OneBit
      it "should not match different capacities" do
        matchingPort (inputPort OneBit) `shouldNotEqual` outputPort TwoBit
