module Game.Port where

import Prelude

import Data.Array (range)
import Data.Array.NonEmpty (cons')
import Data.Int.Bits (shl, (.&.))
import Data.Lens (Lens', Traversal', has, is, only, view, (%~))
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Game.Capacity (Capacity(..))
import Game.Signal (Signal(..))
import Halogen.HTML (i)
import Test.QuickCheck (class Arbitrary, arbitrary)
import Test.QuickCheck.Gen (elements)
import Type.Proxy (Proxy(..))

-- | `NoPort` is the null side of a `Frame Port`: what a piece or board holds
-- | on a side it has no port on. See `noPort`.
data PortType = Input | Output | WormholeIn | WormholeOut | NoPort
derive instance Eq PortType
derive instance Ord PortType
instance Arbitrary PortType where 
  arbitrary = elements (cons' Input [Output])

instance Show PortType where
  show = case _ of
    Input -> "Input"
    Output -> "Output"
    WormholeIn -> "WormholeIn"
    WormholeOut -> "WormholeOut"
    NoPort -> "NoPort"

matchingPortType :: PortType -> PortType
matchingPortType = case _ of
  Input -> Output
  Output -> Input
  WormholeIn  -> WormholeOut
  WormholeOut -> WormholeIn
  NoPort -> NoPort


newtype Port = Port { portType :: PortType, capacity :: Capacity }
derive instance Newtype Port _
derive instance Eq Port
derive instance Ord Port

instance Arbitrary Port where
  arbitrary = createPort <$> arbitrary <*> arbitrary

instance Show Port where
  show (Port { portType, capacity }) = "(" <> show portType <> " " <> show capacity <> ")"

-- | `NoPort` has only one value (`noPort`, whatever capacity is asked for), so
-- | that two sides with no port always compare equal.
createPort :: PortType -> Capacity -> Port
createPort NoPort _ = noPort
createPort portType capacity = Port { portType, capacity }

-- | The null port: what a side holds when there's no port on it, so a
-- | `Frame Port` can be total. Neither readable nor writable, and it matches
-- | nothing. Its capacity is meaningless -- check `hasPort` before reading it.
noPort :: Port
noPort = Port { portType: NoPort, capacity: OneBit }

-- | Is this a real port, rather than the `noPort` a side holds when it has none?
hasPort :: Port -> Boolean
hasPort port = getPortType port /= NoPort

_portType :: Lens' Port PortType
_portType = _Newtype <<< prop (Proxy :: Proxy "portType")

_portCapacity :: Lens' Port Capacity
_portCapacity = _Newtype <<< prop (Proxy :: Proxy "capacity")

inputPort :: Capacity -> Port
inputPort = createPort Input

outputPort :: Capacity -> Port
outputPort = createPort Output 

-- | A port that feeds a signal *into* a wormhole. `Game.Piece.Types.tick`
-- | routes it back to the `wormholeOut` on the opposite side, delayed one tick.
wormholeIn :: Capacity -> Port
wormholeIn = createPort WormholeIn

-- | A port that receives a signal *out of* a wormhole (the piece reads it like
-- | an input).
wormholeOut :: Capacity -> Port
wormholeOut = createPort WormholeOut

isInput :: Port -> Boolean
isInput = has (_portType <<< only Input)

isOutput :: Port -> Boolean
isOutput = has (_portType <<< only Output)

-- | Is this a side a piece reads from each tick? An `Input` (driven by a
-- | neighbor), or a `WormholeOut` (the wormhole's tail, driven by whatever was
-- | buffered at its mouth last tick). Never overlaps `isWritable`.
isReadable :: Port -> Boolean
isReadable port = isInput port || getPortType port == WormholeOut

-- | Is this a side a piece produces a value on each tick? An `Output` (read by
-- | a neighbor), or a `WormholeIn` (the wormhole's mouth, captured into the
-- | buffer). Never overlaps `isReadable`.
isWritable :: Port -> Boolean
isWritable port = isOutput port || getPortType port == WormholeIn

matchingPort :: Port -> Maybe Port
matchingPort (Port { capacity, portType }) = case portType of
  Input -> Just (outputPort capacity) 
  Output -> Just (inputPort capacity) 
  _ -> Nothing

portMatches :: Port -> Port -> Boolean
portMatches p1 p2 = portCapacity p1 == portCapacity p2 && Just p1 == matchingPort p2

getPortType :: Port -> PortType
getPortType = view _portType

portCapacity :: Port -> Capacity
portCapacity = view _portCapacity