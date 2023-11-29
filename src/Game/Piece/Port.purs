module Game.Piece.Port
  ( Capacity(..)
  , Port(..)
  , PortType(..)
  , doubleCapacity
  , halveCapacity
  , inputPort
  , isInput
  , isOutput
  , matchingPort
  , matchingPortType
  , outputPort
  , port
  , portCapacity
  , portMatches
  , portType
  , toInt
  )
  where

import Prelude

import Data.Maybe (Maybe(..))
import Game.Expression (Signal(..))

data Capacity = OneBit | TwoBit | FourBit | EightBit

toInt :: Capacity -> Int
toInt = case _ of
  OneBit   -> 1
  TwoBit   -> 2
  FourBit  -> 4
  EightBit -> 8

derive instance Eq Capacity

instance Show Capacity where
  show capacity = "Capacity " <> show (toInt capacity)

halveCapacity :: Capacity -> Maybe Capacity
halveCapacity = case _ of 
  OneBit   -> Nothing
  TwoBit   -> Just OneBit
  FourBit  -> Just TwoBit
  EightBit -> Just EightBit

doubleCapacity :: Capacity -> Maybe Capacity
doubleCapacity = case _ of
  OneBit   -> Just TwoBit
  TwoBit   -> Just FourBit
  FourBit  -> Just EightBit
  EightBit -> Nothing

data PortType = Input | Output
derive instance Eq PortType
instance Show PortType where
  show = case _ of
    Input -> "Input" 
    Output -> "Output"

matchingPortType :: PortType -> PortType
matchingPortType Input = Output
matchingPortType Output = Input


newtype Port = Port
  { portType :: PortType
  , capacity :: Capacity }
derive instance Eq Port
instance Show Port where
  show (Port { portType, capacity }) =
    show capacity <> " " <> show portType <> " Port"

port :: PortType -> Capacity -> Port
port portType capacity = Port { portType, capacity }

inputPort :: Capacity -> Port
inputPort = port Input

outputPort :: Capacity -> Port
outputPort = port Output

portType :: Port -> PortType
portType (Port p) = p.portType

portCapacity :: Port -> Capacity
portCapacity (Port p) = p.capacity


-- can these two be removed?
isInput :: Port -> Boolean
isInput (Port p) = p.portType == Input

isOutput :: Port -> Boolean
isOutput (Port p) = p.portType == Output

matchingPort :: Port -> Port
matchingPort (Port {portType, capacity}) = Port { portType: matchingPortType portType, capacity}

portMatches :: Port -> Port -> Boolean
portMatches (Port p1) (Port p2) =
  p1.portType == matchingPortType p2.portType && p1.capacity == p2.capacity

