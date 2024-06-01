module Test.Game.Directions where

import Prelude

import Data.Array.NonEmpty (cons')
import Data.Foldable (for_)
import Game.Piece.Direction (CardinalDirection, allDirections, clockwiseRotation, oppositeDirection, rotateDirection)
import Game.Piece.Direction as Direction
import Game.Piece.Rotation (allRotations, rotation)
import Test.QuickCheck.Gen (Gen, elements)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

genDirection :: Gen CardinalDirection
genDirection = elements $ cons' Direction.Up [ Direction.Right, Direction.Down, Direction.Left ]

spec :: Spec Unit
spec = do
  describe "Direction" do
    it "oppositeDirection" $
      for_ allDirections \dir ->
        oppositeDirection (oppositeDirection dir) `shouldEqual` dir
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
      for_ allDirections \dir ->
        for_ allRotations \rot ->
          clockwiseRotation dir (rotateDirection dir rot) `shouldEqual` rot