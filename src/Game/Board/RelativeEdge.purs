module Game.Board.RelativeEdge where

import Prelude

import Data.Newtype (class Newtype)
import Game.Direction (CardinalDirection)
import Game.Edge (Edge(..), edge)
import Game.Location (Location(..))

{-
  Edges are references to ports, they contain a location and a direction
  We have two different types of edges to
-}
type AbsoluteEdge = Edge

newtype RelativeEdge = Relative Edge
derive instance Newtype RelativeEdge _
derive instance Eq RelativeEdge
derive instance Ord RelativeEdge
instance Show RelativeEdge where
  show (Relative (Edge { loc, dir })) = "(RelEdge " <> show loc <> " " <> show dir <> ")"

relative :: Location -> CardinalDirection -> RelativeEdge
relative loc dir = Relative (Edge {loc, dir})

relativeEdgeLocation :: RelativeEdge -> Location
relativeEdgeLocation (Relative (Edge {loc, dir})) = loc

relativeEdgeDirection :: RelativeEdge -> CardinalDirection
relativeEdgeDirection (Relative (Edge {loc, dir})) = dir

absolute :: Location -> CardinalDirection -> AbsoluteEdge
absolute = edge 
