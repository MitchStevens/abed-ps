module Test.Game.Location where

import Prelude

import Data.Array ((..))
import Data.Enum (enumFromTo)
import Data.Foldable (for_)
import Data.Group (ginverse)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Location (CardinalDirection, Edge(..), Location, edge, followDirection, location, matchEdge, oppositeDirection, rotateDirection, rotation)
import Game.Location as Direction
import Test.QuickCheck ((===))
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (assert, assertFalse, shouldEqual)
import Test.Unit.AssertExtra (shouldNotEqual)
import Test.Unit.QuickCheck (quickCheck)

n = 3

--allDirections :: Array CardinalDirection
--allDirections = enumFromTo Direction.Up Direction.Left
--
--allLocations :: Array Location
--allLocations = location <$> 0 .. (n-1) <*> 0 .. (n-1)
--
--allEdges :: Array Edge
--allEdges = edge <$> allLocations <*> allDirections

tests :: TestSuite
tests = do
  describe "Direction" do
    pure unit
--    it "oppositeDirection" $
--      for_ allDirections \dir ->
--        oppositeDirection (oppositeDirection dir) `shouldEqual` dir
--    it "rotateDirection" do 
--      rotateDirection Direction.Up (rotation 0) `shouldEqual` Direction.Up
--      rotateDirection Direction.Up (rotation 1) `shouldEqual` Direction.Right
--      rotateDirection Direction.Up (rotation 2) `shouldEqual` Direction.Down
--      rotateDirection Direction.Up (rotation 3) `shouldEqual` Direction.Left
--      rotateDirection Direction.Down (rotation 0) `shouldEqual` Direction.Down
--      rotateDirection Direction.Down (rotation 1) `shouldEqual` Direction.Left
--      rotateDirection Direction.Down (rotation 2) `shouldEqual` Direction.Up
--      rotateDirection Direction.Down (rotation 3) `shouldEqual` Direction.Right
--  describe "Location" do
--    it "followDirection" do
--      followDirection (location 1 1) Direction.Up `shouldEqual` location 1 0
--      followDirection (location 1 1) Direction.Right `shouldEqual` location 2 1
--      followDirection (location 1 1) Direction.Down `shouldEqual` location 1 2
--      followDirection (location 1 1) Direction.Left `shouldEqual` location 0 1
--      for_ allLocations \loc ->
--        for_ allDirections \dir ->
--          followDirection (followDirection loc dir) (oppositeDirection dir) `shouldEqual` loc
--  describe "Edge" do
--    it "matchEdge" do
--      for_ allEdges \edge -> matchEdge edge `shouldNotEqual` edge
--      for_ allEdges \edge -> matchEdge (matchEdge edge) `shouldEqual` edge
--  describe "Rotations" do
--    it "semigroup" $ quickCheck \a b -> rotation a <> rotation b === rotation (a+b)
--    it "monoid" $ quickCheck \a -> rotation a <> mempty === rotation a
--    it "group" $ quickCheck \a -> rotation a <> ginverse (rotation a) === mempty