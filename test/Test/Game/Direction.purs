module Test.Game.Direction where

import Prelude

import Data.Foldable (for_)
import Game.Direction (allDirections, oppositeDirection)
import Game.Direction as Direction
import Game.Rotation (rotateDirection, rotation)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (shouldEqual)

tests :: TestSuite
tests =
  describe "Direction" do
    it "oppositeDirection" $
      for_ allDirections \dir ->
        oppositeDirection (oppositeDirection dir) `shouldEqual` dir