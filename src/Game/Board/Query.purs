module Game.Board.Query where

import Prelude

import Control.Alternative (guard)
import Control.Monad.State (class MonadState)
import Data.Array as A
import Data.Lens (use)
import Data.Maybe (Maybe(..))
import Data.Traversable (for)
import Game.Board (Board(..), PieceInfo, _size, absolute, getPortOnEdge, matchingRelativeEdge, relativeEdgeLocation, toRelativeEdge)
import Game.Direction (allDirections)
import Game.Location (Location(..))
import Game.Piece.Port (isInput)

insideBoard :: forall m. MonadState Board m => Location -> m Boolean
insideBoard (Location {x, y}) = do
  n <- use _size
  pure $ 0 <= x && x < n && 0 <= y && y < n

directSuccessors :: forall m. MonadState Board m => Location -> m (Array Location)
directSuccessors loc = A.catMaybes <$> for allDirections \dir -> do
  relEdge <- toRelativeEdge (absolute loc dir) >>= matchingRelativeEdge
  maybePort <- getPortOnEdge relEdge
  pure $ maybePort >>= \p -> guard (not (isInput p)) $> relativeEdgeLocation relEdge

directPredecessors :: forall m. MonadState Board m => Location -> m (Array Location)
directPredecessors loc = A.catMaybes <$> for allDirections \dir -> do
  relEdge <- toRelativeEdge (absolute loc dir) >>= matchingRelativeEdge
  maybePort <- getPortOnEdge relEdge
  pure $ maybePort >>= \p -> guard (isInput p) $> relativeEdgeLocation relEdge