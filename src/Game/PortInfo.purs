module Game.PortInfo where

import Prelude

import Data.Array (range)
import Data.Int.Bits (shl, (.&.))
import Game.Port (Port(..), portCapacity)
import Game.Signal (Signal(..), canonical)

-- used later for board evaluation
type PortInfo = 
  { port :: Port 
  , connected :: Boolean
  , signal :: Signal
  }

clampPortInfo :: PortInfo -> PortInfo
clampPortInfo portInfo = portInfo { signal = canonical (portCapacity portInfo.port) portInfo.signal}
