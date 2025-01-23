module Game.Board.Evaluable.Types where

import Prelude

import Control.Monad.Maybe.Trans (runMaybeT)
import Control.Monad.Reader (ReaderT(..))
import Control.Monad.State (class MonadState, State)
import Data.Compactable (compact)
import Data.List (List)
import Data.Map (Map)
import Data.Map as M
import Data.Newtype (class Newtype)
import Data.TraversableWithIndex (forWithIndex)
import Game.Board.Types (Board(..), BoardError, InputEdge(..), OutputEdge(..), RelativeEdge, _pieces, absolute)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (Piece(..))
import Game.Port (Port(..), matchingPort)
import Game.Signal (Signal)


newtype EvaluableBoard = EvaluableBoard
  { pieces :: Map Location Piece
  -- maps input relEdges to output relEdges
  , connections :: Map InputEdge OutputEdge
  -- topologically sorted list of locations
  , evalOrder :: List Location
  , ports :: Map CardinalDirection Port
  , inputs :: Map CardinalDirection InputEdge
  , outputs :: Map CardinalDirection OutputEdge
  }
derive instance Newtype EvaluableBoard _
derive instance Eq EvaluableBoard
instance Show EvaluableBoard where
  show (EvaluableBoard evaluable) = show evaluable

type EvaluableM a = ReaderT EvaluableBoard (State (Map RelativeEdge Signal)) a

mkEvaluableBoard :: forall m
  .  MonadError BoardError m
  => MonadState Board m
  => Map CardinalDirection Port -> m EvaluableBoard
mkEvaluableBoard = do
  pieces <- _.piece <$> use _pieces
  ports <- getPorts
  pure $ EvaulableBoard
    { pieces, connections, evalOrder, ports, inputs, outputs }



getPorts :: forall m. MonadState Board m => m (Map CardinalDirection Port)
getPorts = do
  boardEdges <- getBoardEdges
  compact <$> forWithIndex boardEdges \dir loc -> runMaybeT do
    port <- getPortOnEdge (absolute loc dir)
    pure (matchingPort port)