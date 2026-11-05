-- | The pure data of a board edge -- where an edge is and what to call it --
-- | split out of `Game.Board.Edge` so that `Game.Board.Types` can use it.
-- | `Game.Board.Edge` (which needs `Board`, to answer "what port is on this
-- | edge?") re-exports all of this, so importers don't care which one they
-- | name.
module Game.Board.Edge.Base where

import Prelude

import Data.Function (on)
import Data.Newtype (class Newtype)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Location (Location, followDirection)
import Prim.Coerce (class Coercible)
import Safe.Coerce (coerce)
import Test.QuickCheck (class Arbitrary, arbitrary)

type BaseEdge = { loc :: Location, dir :: CardinalDirection }

edgeDirection :: forall e. Coercible e BaseEdge => e -> CardinalDirection
edgeDirection = (coerce :: e -> BaseEdge) >>> _.dir

edgeLocation :: forall e. Coercible e BaseEdge => e -> Location
edgeLocation = (coerce :: e -> BaseEdge) >>> _.loc

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
instance Arbitrary AbsoluteEdge where
  arbitrary = absolute <$> arbitrary <*> arbitrary

adjacentAbsoluteEdge :: AbsoluteEdge -> AbsoluteEdge
adjacentAbsoluteEdge (Absolute { loc, dir }) = absolute (followDirection loc dir) (oppositeDirection dir)


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
