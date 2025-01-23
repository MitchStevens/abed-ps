module Game.Board.Edge.AbsoluteEdge where

import Prelude

import Data.Function (on)
import Data.Newtype (class Newtype)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Location (Location(..), followDirection)
import Safe.Coerce (coerce)

type BaseEdge = { loc :: Location, dir :: CardinalDirection }

compareBaseEdge :: BaseEdge -> BaseEdge -> Ordering
compareBaseEdge e1 e2 = compare e1.loc e2.loc <> compare e1.dir e2.dir


newtype AbsoluteEdge = Absolute BaseEdge

absolute :: Location -> CardinalDirection -> AbsoluteEdge
absolute loc dir = Absolute { loc, dir }

derive instance Newtype AbsoluteEdge _
derive instance Eq AbsoluteEdge
-- do not derive!
instance Ord AbsoluteEdge where
  compare = compareBaseEdge `on` coerce
instance Show AbsoluteEdge where
  show (Absolute { loc, dir }) = "AbsoluteEdge " <> show loc <> " " <> show dir

adjacentAbsoluteEdge :: AbsoluteEdge -> AbsoluteEdge
adjacentAbsoluteEdge (Absolute { loc, dir }) = absolute (followDirection loc dir) (oppositeDirection dir)