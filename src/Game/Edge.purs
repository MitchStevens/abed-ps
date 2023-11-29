module Game.Edge where

import Prelude

import Data.Newtype (class Newtype)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Location (Location(..), followDirection)


newtype Edge = Edge { loc :: Location, dir :: CardinalDirection }
derive instance Newtype Edge _
derive instance Eq Edge
instance Show Edge where
  show (Edge { loc, dir }) = "Edge " <> show loc <> " " <> show dir

-- do not derive Ord, needed for `mapKeys` function
instance Ord Edge where
  compare (Edge e) (Edge f) = compare e.loc f.loc <> compare e.dir f.dir 

edge :: Location -> CardinalDirection -> Edge
edge loc dir = Edge { loc, dir }

matchEdge :: Edge -> Edge
matchEdge (Edge { loc, dir }) = edge (followDirection loc dir) (oppositeDirection dir)

edgeLocation :: Edge -> Location
edgeLocation (Edge {loc, dir}) = loc

edgeDirection :: Edge -> CardinalDirection
edgeDirection (Edge {loc, dir}) = dir
