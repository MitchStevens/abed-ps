module Game.Board.Edge where

import Prelude

import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.State (class MonadState)
import Data.Group (ginverse)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Traversable (traverse)
import Game.Board.Types (Board(..), _pieces)
import Game.Direction (CardinalDirection, oppositeDirection, rotateDirection)
import Game.Location (Location(..), followDirection)
import Game.Piece (getPort)
import Game.Port (Port(..))
import Prim.Coerce (class Coercible)
import Safe.Coerce (coerce)

-- not used directly
type BaseEdge = { loc :: Location, dir :: CardinalDirection }
newtype AbsoluteEdge = Absolute BaseEdge

class Edge e f | e -> f, f -> e where
  toAbsoluteEdge :: forall m. MonadState Board m => e -> m AbsoluteEdge
  fromAbsoluteEdge :: forall m. MonadState Board m => AbsoluteEdge -> m (Maybe e)
  getPortOnEdge :: forall m. MonadState Board m => e -> m (Maybe Port)
  adjacentEdge :: forall m. MonadState Board m => e -> m (Maybe f)

instance Edge AbsoluteEdge AbsoluteEdge where
  toAbsoluteEdge = pure
  fromAbsoluteEdge = pure <<< Just
  getPortOnEdge (Absolute {loc, dir}) = runMaybeT do
    { piece, rotation } <- MaybeT (use (_pieces <<< at loc))
    MaybeT <<< pure $ (getPort piece (rotateDirection dir (ginverse rotation)))
  adjacentEdge = adjacentAbsoluteEdge >>> pure >>> pure

absolute :: Location -> CardinalDirection -> AbsoluteEdge
absolute loc dir = Absolute { loc, dir }

edgeDirection :: forall e f. Coercible e BaseEdge => Edge e f => e -> CardinalDirection
edgeDirection = (coerce :: e -> BaseEdge) >>> _.dir

edgeLocation :: forall e f. Coercible e BaseEdge => Edge e f => e -> Location
edgeLocation = (coerce :: e -> BaseEdge) >>> _.loc


derive instance Newtype AbsoluteEdge _
derive instance Eq AbsoluteEdge
instance Show AbsoluteEdge where
  show (Absolute { loc, dir }) = "AbsoluteEdge " <> show loc <> " " <> show dir

-- do not derive Ord, needed for `mapKeys` function
instance Ord AbsoluteEdge where
  compare (Absolute e) (Absolute f) = compare e.loc f.loc <> compare e.dir f.dir 

adjacentAbsoluteEdge :: AbsoluteEdge -> AbsoluteEdge
adjacentAbsoluteEdge (Absolute { loc, dir }) = absolute (followDirection loc dir) (oppositeDirection dir)
