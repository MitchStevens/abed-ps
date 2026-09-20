{-
  A layer decomposition is a topologically-sorted list of antichains: a
  location depends only on locations in strictly earlier layers, and within
  one layer no location depends on another (so a layer's members can be
  evaluated, or rendered, in any order / in parallel).

  `LayerDecomp` gives that shape a `Monad` instance. The situation that
  motivates it: `compileNode` produces one level's decomposition over its
  immediate `Location`s, but each `Location` might actually be a nested
  board with its *own* multi-layer decomposition that needs substituting
  in. That substitution -- replace an element with a nested layer sequence,
  flattening the result back into one sequence -- is exactly monadic bind:

    pure  :: a -> LayerDecomp a                       -- a single leaf, alone in its own layer
    bind  :: LayerDecomp a -> (a -> LayerDecomp b) -> LayerDecomp b  -- substitute and re-flatten

  The flattening merges depth-by-depth *within one antichain*: two elements
  of the same antichain are independent (by construction -- that's what
  being in the same antichain means), so their substituted sequences are
  independent too, and can be interleaved layer 0 with layer 0, layer 1
  with layer 1, and so on, padding with nothing past whichever sequence is
  shorter. Antichains from different (ordered) positions in the original
  sequence stay ordered and are simply concatenated.
-}
module Game.Board.LayerDecomp
  ( LayerDecomp(..)
  , layers
  , fromMap
  , layerDecomposition
  ) where

import Prelude

import Control.Monad (ap)
import Data.Foldable (maximum)
import Data.List (List(..), (!!))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (class Newtype)
import Data.Set as S
import Data.Set.NonEmpty (NonEmptySet)
import Data.Set.NonEmpty as NES
import Game.Board.Edge (RelativeEdge(..), edgeLocation, relative)
import Game.Direction as Direction
import Game.Location (Location)

-- | A sequence of antichains, earliest layer first.
newtype LayerDecomp a = LayerDecomp (List (List a))

derive instance Newtype (LayerDecomp a) _
derive instance Eq a => Eq (LayerDecomp a)

instance Show a => Show (LayerDecomp a) where
  show (LayerDecomp ls) = "(LayerDecomp " <> show ls <> ")"

layers :: forall a. LayerDecomp a -> List (List a)
layers (LayerDecomp ls) = ls

instance Functor LayerDecomp where
  map f (LayerDecomp ls) = LayerDecomp (map (map f) ls)

instance Apply LayerDecomp where
  apply = ap

instance Applicative LayerDecomp where
  -- a single element, alone in its own single-element antichain -- the leaf case
  pure a = LayerDecomp (L.singleton (L.singleton a))

instance Bind LayerDecomp where
  bind (LayerDecomp ls) f = LayerDecomp (ls >>= expandAntichain <<< map f)
    where
    -- every element of one antichain has, post-`f`, become its own
    -- `LayerDecomp` -- merge them depth-by-depth, since they're mutually
    -- independent (same antichain) and so is whatever they each expanded to.
    expandAntichain :: forall b. List (LayerDecomp b) -> List (List b)
    expandAntichain layerDecomps = depths <#> \d -> seqs >>= \l -> fromMaybe Nil (l !! d)
      where
      seqs = layers <$> layerDecomps
      depthCount = fromMaybe 0 (maximum (L.length <$> seqs))
      depths = if depthCount <= 0 then Nil else L.range 0 (depthCount - 1)

instance Monad LayerDecomp

-- | Build a `LayerDecomp` from a dependency map -- `key` depends on `value`,
-- | the same shape as `connections`/`wormholes` throughout `Game.Board`
-- | (e.g. an input edge mapped to the output edge that feeds it). Every node
-- | that appears anywhere in the map, as a key or a value, is included;
-- | `Nothing` if the dependency graph is cyclic.
fromMap :: forall a. Ord a => Map a a -> Maybe (LayerDecomp a)
fromMap edges = LayerDecomp <$> go allNodes edges
  where
  allNodes :: List a
  allNodes = L.fromFoldable (S.fromFoldable (M.keys edges) <> S.fromFoldable (M.values edges))

  go :: List a -> Map a a -> Maybe (List (List a))
  go Nil _ = Just Nil
  go nodes es = do
    ready <- NES.fromFoldable (L.filter (\n -> not (M.member n es)) nodes)
    let
      readySet = NES.toSet ready
      nodes' = L.filter (\n -> not (S.member n readySet)) nodes
      es' = M.filter (\v -> not (S.member v readySet)) es
    Cons (NES.toUnfoldable ready) <$> go nodes' es'

{-
  Like `fromMap`, but takes the full node list explicitly rather than
  inferring it from the edges -- `fromMap` would silently drop a node with
  no connections at all (it never appears as a key or a value), which
  matters here: an isolated piece with no matching neighbor on any side
  still needs its own layer, evaluated with all-zero inputs. Moved here
  (formerly `Game.Board.EvaluableBoard.Build`) since `Game.Board.Compiled`
  is now its only caller.

  `Nothing` if `nodes`/`edges` form a cyclic graph.
-}
layerDecomposition :: List Location -> Map RelativeEdge RelativeEdge -> Maybe (List (NonEmptySet Location))
layerDecomposition Nil _ = Just Nil
layerDecomposition nodes edges = do
  let doesntAcceptOutput loc = M.isEmpty $ M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) edges
  readyLayer <- NES.fromFoldable (L.filter doesntAcceptOutput nodes)

  let
    ready = NES.toSet readyLayer
    nodes' = L.filter (\loc -> not (S.member loc ready)) nodes
    edges' = M.filter (\v -> not (S.member (edgeLocation v) ready)) edges
  Cons readyLayer <$> layerDecomposition nodes' edges'
