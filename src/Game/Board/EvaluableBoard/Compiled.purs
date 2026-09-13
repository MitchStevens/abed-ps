module Game.Board.EvaluableBoard.Compiled where

import Prelude

import Data.Map (Map)
import Game.Board (RelativeEdge)
import Game.Direction (CardinalDirection)
import Game.Port (Port(..))

newtype CompiledBoard = CompiledBoard
  { pieces :: Map Location Piece
  , ports :: Map CardinalDirection Port
  , connections :: Map RelativeEdge (S)
  }

