module Test.Game.Board.Edge where

import Prelude

import Data.Foldable (for_)
import Game.Board.Edge (AbsoluteEdge, absolute, adjacentAbsoluteEdge)
import Game.Direction (allDirections)
import Test.Game.Location (allLocations)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)

allEdges :: Array AbsoluteEdge
allEdges = absolute <$> allLocations <*> allDirections

spec :: Spec Unit
spec = do
  describe "Edge" do
    it "matchEdge" do
      for_ allEdges \edge -> 
        adjacentAbsoluteEdge edge `shouldNotEqual` edge
      for_ allEdges \edge -> 
        adjacentAbsoluteEdge (adjacentAbsoluteEdge edge) `shouldEqual` edge