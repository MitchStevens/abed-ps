module Game.Board.BoardConnections where

import Prelude

import Data.FoldableWithIndex (foldlWithIndex, foldrWithIndex)
import Data.List (List(..), foldl, foldr)
import Data.List as L
import Data.List.Types (NonEmptyList)
import Data.Map (Map)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..), uncurry)
import Game.Board.RelativeEdge (RelativeEdge, relative, relativeEdgeLocation)
import Game.Piece.Direction as Direction
import Game.Location (Location(..))

type BoardConnections = Map RelativeEdge RelativeEdge

allLocations :: BoardConnections -> Set Location
allLocations = M.foldSubmap Nothing Nothing (\k v -> S.fromFoldable [relativeEdgeLocation k, relativeEdgeLocation v])

--toGlobal :: Location -> Map CardinalDirection a -> Map RelativeEdge a
--toGlobal loc local = unsafeMapKey (relative loc)
--
--toLocal :: Location -> Map CardinalDirection CardinalDirection
--


dfs :: BoardConnections -> Array Location -> Set Location
dfs connections locs = dfs' (S.fromFoldable locs) S.empty
  where
    dfs' :: Set Location -> Set Location -> Set Location
    dfs' open closed =
      if S.isEmpty open'
        then closed
        else dfs' (S.difference open' closed) (S.union open closed)
      where open' = S.unions $ S.map (S.fromFoldable <<< getParentLocations connections) open


initialVertices :: forall a. Ord a => Map a a -> Set a
initialVertices edges = foldrWithIndex (\_ v -> S.delete v) (M.keys edges) edges

--topoSort :: forall a. Ord a => List a -> (a -> List a) -> Maybe (List a)
--topoSort nodes_ getAdj = topoSort' nodes_ S.empty
--  where
--    topoSort' :: List a -> Set a -> Maybe (List a)
--    topoSort' Nil _ = Just Nil
--    topoSort' nodes sorted = do
--      r <- L.find (\a -> getAdj a == Nil && not (S.member a sorted)) nodes -- find that first location with no adj nodes
--  
--      let nodes' = L.delete r nodes
--          sorted' = S.insert r sorted
--      Cons r <$> topoSort' nodes' sorted'


-- very simple but maybe not effceient, this is fine for small n
-- https://gist.github.com/rinse/8c4266ba7cef050a109f42b082782b59
topologicalSortLocations :: List Location -> BoardConnections -> Maybe (List Location)
topologicalSortLocations Nil _ = Just Nil
topologicalSortLocations nodes edges = do
  let doesntAcceptOutput loc = getParentRelEdges edges loc == Nil
  r <- L.find doesntAcceptOutput nodes -- find that first location that has an input but doesn't accept output from anwhere else
  
  let nodes' = L.delete r nodes
      edges' = M.filter (\v -> relativeEdgeLocation v /= r) edges
  Cons r <$> topologicalSortLocations nodes' edges'


--topologicalSortRelEdge :: BoardConnections -> Maybe (List RelEdge)
--topologicalSortRelEdge connections =
--  | M.isEmpty connections = Just Nil
--  | otherwise = 


getParentRelEdges :: BoardConnections -> Location -> List RelativeEdge
getParentRelEdges connections loc = M.values $ M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) connections

getParentLocations :: BoardConnections -> Location -> List Location
getParentLocations connections loc = relativeEdgeLocation <$> getParentRelEdges connections loc


edgeContraction :: forall a. Ord a => Map a a -> Map a a
edgeContraction edges = M.fromFoldable $ S.map (\v -> Tuple v (follow v)) (initialVertices edges)
  where
    follow a = maybe a follow (M.lookup a edges)

