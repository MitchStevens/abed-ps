module Game.Piece.PortInfo where

import Prelude

import Data.Lens (Lens')
import Data.Lens.Record (prop)
import Game.Expression (Signal(..))
import Game.Piece.Port (Port(..))
import Type.Proxy (Proxy(..))

-- used later for board evaluation
type PortInfo = 
  { port :: Port
  , connected :: Boolean
  , signal :: Signal
  }

_port :: Lens' PortInfo Port
_port = prop (Proxy :: Proxy "port")

_connected :: Lens' PortInfo Boolean
_connected = prop (Proxy :: Proxy "connected")

_signal :: Lens' PortInfo Signal
_signal = prop (Proxy :: Proxy "signal")