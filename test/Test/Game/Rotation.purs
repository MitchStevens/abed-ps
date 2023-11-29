module Test.Game.Rotation where

import Prelude

import Data.Foldable (for_)
import Data.Group (ginverse)
import Game.Direction (allDirections)
import Game.Direction as Direction
import Game.Rotation (allRotations, clockwiseRotation, rotateDirection, rotation)
import Test.QuickCheck ((===))
import Test.Unit (TestSuite, describe, it)
import Test.Unit.AssertExtra (shouldEqual)
import Test.Unit.QuickCheck (quickCheck)

tests :: TestSuite
tests =
  --describe "Rotations" do
  --  it "semigroup" $ quickCheck \a b -> rotation a <> rotation b === rotation (a+b)
  --  it "monoid" $ quickCheck \a -> rotation a <> mempty === rotation a
  --  it "group" $ quickCheck \a -> rotation a <> ginverse (rotation a) === mempty
  --describe "rotateDirection" do 
  --  it "basic tests" do
  --    rotateDirection Direction.Up (rotation 0) `shouldEqual` Direction.Up
  --    rotateDirection Direction.Up (rotation 1) `shouldEqual` Direction.Right
  --    rotateDirection Direction.Up (rotation 2) `shouldEqual` Direction.Down
  --    rotateDirection Direction.Up (rotation 3) `shouldEqual` Direction.Left
  --    rotateDirection Direction.Down (rotation 0) `shouldEqual` Direction.Down
  --    rotateDirection Direction.Down (rotation 1) `shouldEqual` Direction.Left
  --    rotateDirection Direction.Down (rotation 2) `shouldEqual` Direction.Up
  --    rotateDirection Direction.Down (rotation 3) `shouldEqual` Direction.Right
  describe "clockwiseRotation" do
    it "basic tests" do
      for_ allDirections \d1 ->
        for_ allDirections \d2 ->
          rotateDirection d1 (clockwiseRotation d1 d2) `shouldEqual` d2
