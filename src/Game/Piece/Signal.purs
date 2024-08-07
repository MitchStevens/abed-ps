module Game.Piece.Signal where

import Prelude

import Data.Array (fold)
import Data.Int (Radix, hexadecimal, odd, toStringAs)
import Data.Int.Bits (complement, shl, shr, (.&.), (.|.))
import Data.Newtype (class Newtype, over, over2)
import Data.String (toUpper)

newtype Signal = Signal Int
derive instance Newtype Signal _
derive instance Eq Signal
derive instance Ord Signal

instance Show Signal where
  show (Signal s) = toUpper $ fold $ [12, 8, 4, 0] <#> \shift ->
    toStringAs hexadecimal ((shr s shift) .&. 15)

instance Semigroup Signal where
  append = add

instance Monoid Signal where
  mempty = zero

instance HeytingAlgebra Signal where
  ff = Signal 0
  tt = Signal (complement 0)
  not (Signal a) = Signal (complement a)
  implies (Signal a) (Signal b) = Signal (complement a .|. b)
  disj (Signal a) (Signal b) = Signal (a .|. b)
  conj (Signal a) (Signal b) = Signal (a .&. b)

instance Semiring Signal where
  zero = Signal 0
  add (Signal a) (Signal b) = Signal (a+b)
  one = Signal 1
  mul (Signal a) (Signal b) = Signal (a*b)

nthBit :: Signal -> Int -> Boolean
nthBit (Signal s) n = odd (shr s n)