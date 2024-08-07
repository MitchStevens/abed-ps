module Game.Piece.Capacity where

import Prelude

import Data.Array (range)
import Data.Int.Bits as Bits
import Data.Maybe (Maybe(..))
import Game.Piece.Signal (Signal(..), nthBit)

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

maxValue :: Capacity -> Signal
maxValue = case _ of
  OneBit   -> Signal 1
  TwoBit   -> Signal 3
  FourBit  -> Signal 15
  EightBit -> Signal 255

clampSignal :: Capacity -> Signal -> Signal
clampSignal capacity = conj (maxValue capacity)

-- from lowest to highest bits
clampedBits :: Capacity -> Signal -> Array Boolean
clampedBits capacity signal  =
  nthBit signal <$> range 0 (toInt capacity - 1)

--showSignalWithCapacity :: Capacity -> Signal -> String
--showSignalWithCapacity capacity signal = case capacity of
--  OneBit   -> if signal == zero then "0" else "1"
--  TwoBit   -> 
--  FourBit  -> Signal 15
--  EightBit -> Signal 255