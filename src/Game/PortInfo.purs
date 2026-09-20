module Game.PortInfo where

import Prelude

import Data.Array (range)
import Data.Int.Bits (shl, (.&.))
import Game.Port (Port(..), hasPort, noPort, portCapacity)
import Game.Signal (Signal(..), canonical)

-- used later for board evaluation
type PortInfo = 
  { port :: Port 
  , connected :: Boolean
  , signal :: Signal
  }

-- | The null `PortInfo`: what a side holds when there's no port on it, so a
-- | `Frame PortInfo` can be total. Renderers must skip it (`hasPortInfo`) --
-- | it's `zero`, not "off", and a side with no port has nothing to draw.
noPortInfo :: PortInfo
noPortInfo = { port: noPort, connected: false, signal: zero }

-- | Is this a real port's info, rather than the `noPortInfo` a side holds when
-- | it has none?
hasPortInfo :: PortInfo -> Boolean
hasPortInfo info = hasPort info.port

clampPortInfo :: PortInfo -> PortInfo
clampPortInfo portInfo = portInfo { signal = canonical (portCapacity portInfo.port) portInfo.signal}
