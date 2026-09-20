module Test.Game.Board.LayerDecomp where

import Prelude

import Data.Array as A
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Game.Board.LayerDecomp (LayerDecomp(..), fromMap, layers)
import Test.QuickCheck ((<?>), (===))
import Test.QuickCheck.Gen (Gen, chooseInt)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

-- | A random acyclic `Map Int Int` in the `key depends on value` shape
-- | `fromMap` expects -- every edge points from a higher number to a
-- | strictly lower one, so Int's usual order is already a valid
-- | topological order and no cycle can occur.
genAcyclicMap :: Gen (Map Int Int)
genAcyclicMap = do
  n <- chooseInt 1 10
  pairs <- for (A.range 0 (n - 1)) \i ->
    if i == 0 then pure Nothing
    else do
      hasEdge <- (_ == 1) <$> chooseInt 0 1
      if hasEdge
        then do
          v <- chooseInt 0 (i - 1)
          pure (Just (Tuple i v))
        else pure Nothing
  pure (M.fromFoldable (A.mapMaybe identity pairs))

-- | Which layer (by index, earliest = 0) an element sits in, if any.
layerIndexOf :: forall a. Eq a => a -> List (List a) -> Maybe Int
layerIndexOf x = L.findIndex (L.elem x)

spec :: Spec Unit
spec = describe "Game.Board.LayerDecomp" do
  describe "fromMap" do
    it "is an empty decomposition for an empty map" do
      fromMap (M.empty :: Map Int Int) `shouldEqual` Just (LayerDecomp Nil)

    it "orders a simple chain: 1 depends on 0" do
      fromMap (M.singleton 1 0) `shouldEqual`
        Just (LayerDecomp (L.fromFoldable [ L.fromFoldable [ 0 ], L.fromFoldable [ 1 ] ]))

    it "is Nothing for a cyclic map" do
      fromMap (M.fromFoldable [ Tuple 1 2, Tuple 2 1 ]) `shouldEqual` Nothing

    it "includes every element that appears in the input map, and no others" do
      quickCheck do
        edges <- genAcyclicMap
        pure case fromMap edges of
          Nothing -> false <?> "generator produced a cyclic map"
          Just ld ->
            let
              expected = S.fromFoldable (M.keys edges) <> S.fromFoldable (M.values edges)
              actual = S.fromFoldable (L.concat (layers ld))
            in
              actual === expected

    it "never duplicates an element across layers" do
      quickCheck do
        edges <- genAcyclicMap
        pure case fromMap edges of
          Nothing -> false <?> "generator produced a cyclic map"
          Just ld ->
            let allElems = L.concat (layers ld)
            in L.length allElems === S.size (S.fromFoldable allElems)

    it "places every dependency strictly after (in a later layer than) what it depends on -- transitively too, since layer order is transitive" do
      quickCheck do
        edges <- genAcyclicMap
        pure case fromMap edges of
          Nothing -> false <?> "generator produced a cyclic map"
          Just ld ->
            let
              ls = layers ld
              respects (Tuple k v) = case Tuple (layerIndexOf k ls) (layerIndexOf v ls) of
                Tuple (Just ki) (Just vi) -> ki > vi
                _ -> false
            in
              A.all respects (M.toUnfoldable edges :: Array (Tuple Int Int))
                <?> "a dependency wasn't placed strictly after what it depends on"
