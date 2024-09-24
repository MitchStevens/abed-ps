module Game.Capacity where

import Prelude

import Data.Array (range)
import Data.Int.Bits as Bits
import Data.Maybe (Maybe(..))

data Capacity = OneBit | TwoBit | FourBit | EightBit
derive instance Eq Capacity
derive instance Ord Capacity

instance Show Capacity where
  show capacity = "Capacity " <> show (toInt capacity)

toInt :: Capacity -> Int
toInt = case _ of
  OneBit   -> 1
  TwoBit   -> 2
  FourBit  -> 4
  EightBit -> 8

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