module Test.Game.Edge where

import Prelude

import Data.Foldable (for_)
import Game.Board.Edge (AbsoluteEdge(..), absolute, edgeLocation)
import Game.Direction (allDirections)
import Game.Location (location)
import Test.Game.Location (allLocations)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

allEdges :: Array AbsoluteEdge
allEdges = absolute <$> allLocations <*> allDirections

spec :: Spec Unit
spec = do
  describe "Edge" do
    --it "matchEdge" do
    --  for_ allEdges \edge -> matchEdge edge `shouldNotEqual` edge
    --  for_ allEdges \edge -> matchEdge (matchEdge edge) `shouldEqual` edge
    it "should have derived Ord correctly" do
      for_ allEdges \e1 -> 
        for_ allEdges \e2 -> 
          unless (not (edgeLocation e1 > edgeLocation e2) || (e1 > e2)) do
            fail ""
    describe "getPortOnEdge" do
      it "should return empty if space is not occupied" do
        getPortOnEdge (relative (location 0 0) Direction.Up)
        getPortOnEdge (relative (location 2 2) Direction.Down)
        getPortOnEdge (relative (location 0 2) Direction.Right)
      it "should still return empty if space is occupied but no port" do
        getPortOnEdge (relative (location 0 1) Direction.Up)    `shouldReturn` Nothing
        getPortOnEdge (relative (location 0 1) Direction.Down)  `shouldReturn` Nothing
      it "should return port if space is occupied and a port exists" do
        getPortOnEdge (relative (location 0 1) Direction.Left)  `shouldReturn` Just (inputPort OneBit)
        getPortOnEdge (relative (location 0 1) Direction.Right) `shouldReturn` Just (outputPort OneBit)
        getPortOnEdge (relative (location 1 0) Direction.Right) `shouldReturn` Just (outputPort OneBit)
        getPortOnEdge (relative (location 1 1) Direction.Up)    `shouldReturn` Just (inputPort OneBit)
    describe "toAbsoluteEdge/toRelativeEdge" do
      it "no piece at location test" do
        toAbsoluteEdge (relative (location 0 0) Direction.Right) `shouldReturn` absolute (location 0 0) Direction.Right
        fromAbsoluteEdge (absolute (location 0 0) Direction.Right) `shouldReturn` relative (location 0 0) Direction.Right
      it "piece has no rotation test" do
        toAbsoluteEdge (relative (location 0 1) Direction.Right) `shouldReturn` absolute (location 0 1) Direction.Right
        fromAbsoluteEdge (absolute (location 0 1) Direction.Right) `shouldReturn` relative (location 0 1) Direction.Right
      it "piece has rotation" do
        toAbsoluteEdge (relative (location 1 0) Direction.Right) `shouldReturn` absolute (location 1 0) Direction.Down
        fromAbsoluteEdge (absolute (location 1 0) Direction.Right) `shouldReturn` relative (location 1 0) Direction.Up
      it "moving from absolute edge to relative edge should a round trip" do
        for_ (absolute <$> allLocations <*> allDirections) \absEdge -> 
          (fromAbsoluteEdge absEdge >>= toAbsoluteEdge) `shouldReturn` absEdge
    describe "matchingRelativeEdge" do
      it "matches" do
        adjacent (relative (location 0 1) Direction.Right) `shouldReturn` relative (location 1 1) Direction.Left
        adjacent (relative (location 1 1) Direction.Right) `shouldReturn` relative (location 2 1) Direction.Left
        adjacent (relative (location 1 0) Direction.Right) `shouldReturn` relative (location 1 1) Direction.Up
