module Test.Game.Edge where

import Prelude

import Data.Foldable (for_)
import Game.Direction (allDirections)
import Game.Edge (Edge(..), edge, matchEdge)
import Test.Game.Location (allLocations)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (shouldEqual)
import Test.Unit.AssertExtra (shouldNotEqual)

allEdges :: Array Edge
allEdges = edge <$> allLocations <*> allDirections

tests :: TestSuite
tests = describe "Edge" do
  it "matchEdge" do
    for_ allEdges \edge -> matchEdge edge `shouldNotEqual` edge
    for_ allEdges \edge -> matchEdge (matchEdge edge) `shouldEqual` edge