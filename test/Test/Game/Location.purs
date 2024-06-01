module Test.Game.Location where

import Prelude

import Data.Array ((..))
import Data.Enum (enumFromTo)
import Data.Foldable (for_)
import Data.Group (ginverse)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Piece.Direction (allDirections, oppositeDirection)
import Game.Piece.Direction as Direction
import Game.Location (Location(..), directionTo, followDirection, location)
import Test.QuickCheck.Gen (Gen, chooseInt)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

genLocation :: Gen Location
genLocation = location <$> chooseInt 0 10 <*> chooseInt 0 10

allLocations :: Array Location
allLocations = location <$> 0 .. 10 <*> 0 .. 10

spec :: Spec Unit
spec = do
  describe "Location" do
    it "followDirection" do
      followDirection (location 1 1) Direction.Up    `shouldEqual` location 1 0
      followDirection (location 1 1) Direction.Right `shouldEqual` location 2 1
      followDirection (location 1 1) Direction.Down  `shouldEqual` location 1 2
      followDirection (location 1 1) Direction.Left  `shouldEqual` location 0 1
      for_ allLocations \loc ->
        for_ allDirections \dir ->
          followDirection (followDirection loc dir) (oppositeDirection dir) `shouldEqual` loc
    it "directionTo" do
      for_ allLocations \loc ->
        for_ allDirections \dir ->
          directionTo loc (followDirection loc dir) `shouldEqual` Just dir
