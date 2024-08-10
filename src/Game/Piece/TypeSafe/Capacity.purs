module Game.Piece.TypeSafe.Capacity where

import Prelude

import Game.Piece as Piece

data Capacity
foreign import data OneBit   :: Capacity
foreign import data TwoBit   :: Capacity
foreign import data FourBit  :: Capacity
foreign import data EightBit :: Capacity

class CapacityValue (capacity :: Capacity) where
  getCapacityValue :: Piece.Capacity

instance CapacityValue OneBit   where getCapacityValue = Piece.OneBit
instance CapacityValue TwoBit   where getCapacityValue = Piece.TwoBit
instance CapacityValue FourBit  where getCapacityValue = Piece.FourBit
instance CapacityValue EightBit where getCapacityValue = Piece.EightBit
