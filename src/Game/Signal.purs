module Game.Signal
  ( Base(..)
  , Signal
  , SignalRepresentation(..)
  , canonical
  , equivalent
  , maxValue
  , mkSignal
  , over2Signal
  , overSignal
  , printSignal
  , toInt
  , xor
  )
  where

import Prelude

import Data.Array (fold)
import Data.Function (on)
import Data.Int (Radix, binary, ceil, decimal, hexadecimal, odd, toNumber, toStringAs)
import Data.Monoid (power)
import Data.Newtype (class Newtype, over, over2)
import Data.Number (ln2, log)
import Data.String (length, toUpper)
import Data.UInt (UInt, and, complement, fromInt, or, (.&.), (.|.))
import Data.UInt as UInt
import Game.Capacity (Capacity(..))
import Game.Capacity as Capacity

newtype Signal = Signal UInt
derive instance Eq Signal
derive instance Ord Signal
derive newtype instance Semiring Signal
derive newtype instance Ring Signal

----todo: improve this implementation
--instance Eq Signal where
--  eq (Signal s1) (Signal s2) = show s1 == show s2

instance Show Signal where
  show = printSignal (SignalRepresentation Hexadecimal EightBit)

instance Semigroup Signal where
  append = add

instance Monoid Signal where
  mempty = zero

instance HeytingAlgebra Signal where
  ff = zero
  tt = Signal (complement zero)
  not (Signal a) = Signal (complement a)
  implies (Signal a) (Signal b) = Signal (complement a .|. b)
  disj (Signal a) (Signal b) = Signal (a .|. b)
  conj (Signal a) (Signal b) = Signal (a .&. b)


mkSignal :: Int -> Signal
mkSignal = Signal <<< fromInt

xor :: Signal -> Signal -> Signal
xor (Signal a) (Signal b) = Signal (UInt.xor a b)

maxValue :: Capacity -> Signal
maxValue = case _ of
  OneBit   -> Signal (fromInt 1)
  TwoBit   -> Signal (fromInt 3)
  FourBit  -> Signal (fromInt 15)
  EightBit -> Signal (fromInt 255)

toInt :: Capacity -> Signal -> Int
toInt capacity signal = 
  let Signal n = canonical capacity signal
  in UInt.toInt n

{-
  equivalent capacity signal 
-}
canonical :: Capacity -> Signal -> Signal
canonical capacity signal = signal `conj` maxValue capacity

equivalent :: Capacity -> Signal -> Signal -> Boolean
equivalent capacity = eq `on` canonical capacity

overSignal :: (UInt -> UInt) -> (Signal -> Signal)
overSignal f (Signal a) = Signal (f a)

over2Signal :: (UInt -> UInt -> UInt) -> (Signal -> Signal -> Signal)
over2Signal f (Signal a) (Signal b) = Signal (f a b)

--- 
data Base = Binary | Decimal | Hexadecimal
derive instance Eq Base

baseRadix :: Base -> Radix
baseRadix = case _ of
  Binary -> binary
  Decimal -> decimal
  Hexadecimal -> hexadecimal


data SignalRepresentation = SignalRepresentation Base Capacity
derive instance Eq SignalRepresentation

printSignal :: SignalRepresentation -> Signal -> String
printSignal (SignalRepresentation base capacity) = 
  toInt capacity
    >>> toStringAs (baseRadix base)
    >>> zeroPad numberOfDigits
  where
    --numberOfDigits = ceil (toNumber (Capacity.toInt capacity) * ln2 / (log baseAsNumber))
    numberOfDigits = case base of
      Binary -> Capacity.toInt capacity
      Decimal -> case capacity of
        EightBit -> 3
        FourBit -> 2
        _ -> 1
      Hexadecimal -> Capacity.toInt capacity `div` 4
    
    --baseAsNumber = case base of
    --  Binary -> 2.0
    --  Decimal -> 10.0
    --  Hexadecimal -> 16.0

    zeroPad :: Int -> String -> String
    zeroPad len str = power "0" (len - length str) <> str