module Game.Board.Edge.InputEdge where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Maybe.Trans (MaybeT(..))
import Control.Plus (empty)
import Data.Function (on)
import Data.Maybe (Maybe(..))
import Game.Board.Edge.AbsoluteEdge (compareBaseEdge)
import Game.Board.Edge.Class (class Edge, fromAbsoluteEdge, getPortOnEdge, toAbsoluteEdge)
import Game.Board.Edge.RelativeEdge (RelativeEdge(..), relative)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Port (isInput)
import Safe.Coerce (coerce)

newtype InputEdge = InputEdge RelativeEdge
derive instance Eq InputEdge
-- do not derive!
instance Ord InputEdge where
  compare = compareBaseEdge `on` coerce
instance Show InputEdge where
  show (InputEdge relEdge) = "InputEdge " <> show relEdge

inputEdge :: Location -> CardinalDirection -> InputEdge
inputEdge loc dir = InputEdge (relative loc dir)

instance Edge InputEdge where
  toAbsoluteEdge (InputEdge relEdge) = do
    port <- getPortOnEdge relEdge
    guard (isInput port) *> toAbsoluteEdge relEdge
  fromAbsoluteEdge absEdge = do
    relEdge <- fromAbsoluteEdge absEdge
    port <- getPortOnEdge relEdge
    guard (isInput port) $> InputEdge relEdge
  getPortOnEdge (InputEdge relEdge) = do
    port <- getPortOnEdge relEdge
    guard (isInput port) $> port
  
