module Game.Board.Edge.RelativeEdge where

import Prelude

import Data.Function (on)
import Data.Newtype (class Newtype)
import Game.Board.Edge.AbsoluteEdge (BaseEdge, compareBaseEdge)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Safe.Coerce (coerce)

newtype RelativeEdge = Relative BaseEdge

relative :: Location -> CardinalDirection -> RelativeEdge
relative loc dir = Relative { loc, dir }

derive instance Newtype RelativeEdge _
derive instance Eq RelativeEdge
-- do not derive!
instance Ord RelativeEdge where
  compare = compareBaseEdge `on` coerce
instance Show RelativeEdge where
  show (Relative { loc, dir }) = "RelativeEdge " <> show loc <> " " <> show dir