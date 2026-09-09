module Game.Capacity where

import Prelude

import Data.Array (range)
import Data.Array.NonEmpty (cons')
import Data.Int.Bits as Bits
import Data.Maybe (Maybe(..))
import Test.QuickCheck (class Arbitrary)
import Test.QuickCheck.Gen (elements)

data Capacity = OneBit | TwoBit | FourBit | EightBit
derive instance Eq Capacity
derive instance Ord Capacity

instance Arbitrary Capacity where
  arbitrary = elements $ cons' OneBit [ TwoBit, FourBit, EightBit ]

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