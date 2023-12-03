module Game.Signal where

import Prelude

import Data.Array (fold)
import Data.Int (hexadecimal, toStringAs)
import Data.Int.Bits (complement, shr, (.&.), (.|.))
import Data.String (toUpper)

newtype Signal = Signal Int

--todo: improve this implementation
instance Eq Signal where
  eq (Signal s1) (Signal s2) = show s1 == show s2

instance Show Signal where
  --show signal = fromCharArray $ (if _ then '1' else '0') <$> signalAsBits signal
  show (Signal s) = toUpper $ fold $ [12, 8, 4, 0] <#> \shift ->
    toStringAs hexadecimal ((shr s shift) .&. 15)

instance HeytingAlgebra Signal where
  ff = Signal 0
  tt = Signal (-1)
  not (Signal a) = Signal (complement a)
  implies (Signal a) (Signal b) = Signal (complement a .|. b)
  disj (Signal a) (Signal b) = Signal (a .|. b)
  conj (Signal a) (Signal b) = Signal (a .&. b)
