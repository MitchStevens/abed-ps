module Test.Game.Directions where

import Prelude

import Data.Foldable (for_)
import Game.Direction (CardinalDirection, allDirections, clockwiseRotation, oppositeDirection, rotateDirection)
import Game.Direction as Direction
import Game.Rotation (Rotation(..), allRotations, rotation)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = do
  describe "Direction" do
    it "oppositeDirection" $
      quickCheck (\dir -> oppositeDirection (oppositeDirection dir) === dir)
    it "rotateDirection" do 
      rotateDirection Direction.Up (rotation 0) `shouldEqual` Direction.Up
      rotateDirection Direction.Up (rotation 1) `shouldEqual` Direction.Right
      rotateDirection Direction.Up (rotation 2) `shouldEqual` Direction.Down
      rotateDirection Direction.Up (rotation 3) `shouldEqual` Direction.Left
      rotateDirection Direction.Down (rotation 0) `shouldEqual` Direction.Down
      rotateDirection Direction.Down (rotation 1) `shouldEqual` Direction.Left
      rotateDirection Direction.Down (rotation 2) `shouldEqual` Direction.Up
      rotateDirection Direction.Down (rotation 3) `shouldEqual` Direction.Right
    it "clockwiseRotation" do
      clockwiseRotation Direction.Left Direction.Left
        `shouldEqual` rotation 0
      clockwiseRotation Direction.Left Direction.Up
        `shouldEqual` rotation 1
      clockwiseRotation Direction.Left Direction.Right
        `shouldEqual` rotation 2
      clockwiseRotation Direction.Up Direction.Left
        `shouldEqual` rotation 3
      clockwiseRotation Direction.Down Direction.Right
        `shouldEqual` rotation 3

      quickCheck (\dir rot ->
          clockwiseRotation dir (rotateDirection dir rot) === rot )