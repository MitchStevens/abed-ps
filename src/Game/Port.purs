module Game.Port where

import Prelude

import Data.Array (range)
import Data.Int.Bits (shl, (.&.))
import Data.Lens (Lens', has, is, only, view, (%~))
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Game.Capacity (Capacity)
import Game.Signal (Signal(..), nthBit)
import Type.Proxy (Proxy(..))

data PortType = Input | Output
derive instance Eq PortType
derive instance Ord PortType

instance Show PortType where
  show = case _ of
    Input -> "Input"
    Output -> "Output"

matchingPortType :: PortType -> PortType
matchingPortType = case _ of
  Input -> Output
  Output -> Input


newtype Port = Port { portType :: PortType, capacity :: Capacity }
derive instance Newtype Port _
derive instance Eq Port
derive instance Ord Port

instance Show Port where
  show (Port { portType, capacity }) = show portType <> " " <> show capacity

createPort :: PortType -> Capacity -> Port
createPort portType capacity = Port { portType, capacity }

_portType :: Lens' Port PortType
_portType = _Newtype <<< prop (Proxy :: Proxy "portType")

_portCapacity :: Lens' Port Capacity
_portCapacity = _Newtype <<< prop (Proxy :: Proxy "capacity")


inputPort :: Capacity -> Port
inputPort capacity = Port { portType: Input, capacity }

outputPort :: Capacity -> Port
outputPort capacity = Port { portType: Output, capacity }

isInput :: Port -> Boolean
isInput = has (_portType <<< only Input)

isOutput :: Port -> Boolean
isOutput = not <<< isInput

matchingPort :: Port -> Port
matchingPort = _portType %~ matchingPortType

portMatches :: Port -> Port -> Boolean
portMatches port otherPort = port == matchingPort otherPort 


portType :: Port -> PortType
portType = view _portType

portCapacity :: Port -> Capacity
portCapacity = view _portCapacity