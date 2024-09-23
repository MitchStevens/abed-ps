module Game.PortInfo where

import Prelude

import Data.Array (range)
import Data.Int.Bits (shl, (.&.))
import Game.Port (Port(..), portCapacity)
import Game.Signal (Signal(..))

-- used later for board evaluation
type PortInfo = 
  { port :: Port 
  , connected :: Boolean
  , signal :: Signal
  }

--getClampedSignal :: PortInfo -> Signal
--getClampedSignal {port, connected, signal} = clampSignal (portCapacity port) signal