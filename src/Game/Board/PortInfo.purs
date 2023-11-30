module Game.Board.PortInfo where

import Prelude

import Game.Signal (Signal(..))
import Game.Piece (Port)

-- used later for board evaluation
type PortInfo = 
  { port :: Port 
  , connected :: Boolean
  , signal :: Signal
  }