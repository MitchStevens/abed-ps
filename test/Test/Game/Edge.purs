module Test.Game.Edge where

import Prelude

import Data.Foldable (for_)
import Game.Piece.Direction (allDirections)
import Game.Edge (Edge(..), edge, matchEdge)
import Test.Game.Location (allLocations)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

allEdges :: Array Edge
allEdges = edge <$> allLocations <*> allDirections

spec :: Spec Unit
spec = do
  describe "Edge" do
    it "matchEdge" do
      for_ allEdges \edge -> matchEdge edge `shouldNotEqual` edge
      for_ allEdges \edge -> matchEdge (matchEdge edge) `shouldEqual` edge