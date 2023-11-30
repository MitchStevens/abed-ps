module Game.Piece.Port where

import Prelude

import Data.Maybe (Maybe(..))

data Capacity = OneBit | TwoBit | FourBit | EightBit
derive instance Eq Capacity

instance Show Capacity where
  show = case _ of
    OneBit   -> " Capacity 1"
    TwoBit   -> " Capacity 2"
    FourBit  -> " Capacity 4"
    EightBit -> " Capacity 8"

doubleCapacity :: Capacity -> Maybe Capacity
doubleCapacity = case _ of
  OneBit   -> Just TwoBit
  TwoBit   -> Just FourBit
  FourBit  -> Just EightBit
  EightBit -> Nothing


halveCapacity :: Capacity -> Maybe Capacity
halveCapacity = case _ of
  OneBit   -> Nothing
  TwoBit   -> Just OneBit
  FourBit  -> Just TwoBit
  EightBit -> Just FourBit

data Port
  = Input Capacity
  | Output Capacity
derive instance Eq Port

instance Show Port where
  show = case _ of
    Input capacity -> "Input " <> show capacity
    Output capacity -> "Output " <> show capacity

inputPort :: Capacity -> Port
inputPort = Input

outputPort :: Capacity -> Port
outputPort = Output


isInput :: Port -> Boolean
isInput (Input _) = true
isInput _ = false

isOutput :: Port -> Boolean
isOutput = not <<< isInput

matchingPort :: Port -> Port
matchingPort (Input c) = Output c
matchingPort (Output c) = Input c

portMatches :: Port -> Port -> Boolean
portMatches port otherPort = port == matchingPort otherPort 

portCapacity :: Port -> Capacity
portCapacity = case _ of
  Input  capacity -> capacity
  Output capacity -> capacity