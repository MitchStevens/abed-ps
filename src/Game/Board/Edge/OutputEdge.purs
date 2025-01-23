module Game.Board.Edge.OutputEdge where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Maybe.Trans (MaybeT(..))
import Control.Plus (empty)
import Data.Function (on)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Game.Board.Edge.AbsoluteEdge (compareBaseEdge)
import Game.Board.Edge.Class (class Edge, fromAbsoluteEdge, getPortOnEdge, toAbsoluteEdge)
import Game.Board.Edge.RelativeEdge (RelativeEdge(..), relative)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Port (isOutput)
import Safe.Coerce (coerce)

newtype OutputEdge = OutputEdge RelativeEdge
derive instance Newtype OutputEdge _
derive instance Eq OutputEdge
-- do not derive!
instance Ord OutputEdge where
  compare = compareBaseEdge `on` coerce
instance Show OutputEdge where
  show (OutputEdge relEdge) = "OutputEdge " <> show relEdge

outputEdge :: Location -> CardinalDirection -> OutputEdge
outputEdge loc dir = OutputEdge (relative loc dir)

instance Edge OutputEdge where
  toAbsoluteEdge (OutputEdge relEdge) = do
    port <- getPortOnEdge relEdge
    guard (isOutput port) *> toAbsoluteEdge relEdge
  fromAbsoluteEdge absEdge = do
    relEdge <- fromAbsoluteEdge absEdge
    port <- getPortOnEdge relEdge
    guard (isOutput port) $> OutputEdge relEdge
  getPortOnEdge (OutputEdge relEdge) = do
    port <- getPortOnEdge relEdge
    guard (isOutput port) $> port