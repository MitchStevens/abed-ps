module Test.Game.Location where

import Prelude

import Data.Array ((..))
import Data.Enum (enumFromTo)
import Data.Foldable (for_)
import Data.Group (ginverse)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Direction (allDirections, oppositeDirection)
import Game.Direction as Direction
import Game.Location (Location(..), followDirection, location)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (assert, assertFalse, shouldEqual)
import Test.Unit.AssertExtra (shouldNotEqual)
import Test.Unit.QuickCheck (quickCheck)

n = 3

allLocations :: Array Location
allLocations = location <$> 0 .. (n-1) <*> 0 .. (n-1)

tests :: TestSuite
tests = do
  describe "Location" do
    it "followDirection" do
      followDirection (location 1 1) Direction.Up `shouldEqual` location 1 0
      followDirection (location 1 1) Direction.Right `shouldEqual` location 2 1
      followDirection (location 1 1) Direction.Down `shouldEqual` location 1 2
      followDirection (location 1 1) Direction.Left `shouldEqual` location 0 1
      for_ allLocations \loc ->
        for_ allDirections \dir ->
          followDirection (followDirection loc dir) (oppositeDirection dir) `shouldEqual` loc