module Game.Piece.SignalDisplayMode where

import Prelude

import Data.Array as Array
import Data.Int (Radix, binary, hexadecimal, toStringAs)
import Data.Maybe (Maybe, fromMaybe)
import Data.String as String
import Data.String.CodeUnits (fromCharArray)
import Game.Piece.Capacity (Capacity(..), toInt)
import Game.Piece.Signal (Signal(..))

type SignalDisplayMode =
  { capacity :: Capacity
  , radix :: Maybe Radix
  }

showSignal :: SignalDisplayMode -> Signal -> String
showSignal { capacity, radix } (Signal n) =
  let str = toStringAs (fromMaybe defaultRadix radix) n
      padCount = toInt capacity - String.length str
      defaultRadix = case capacity of
        OneBit -> binary
        TwoBit -> binary
        FourBit -> hexadecimal
        EightBit -> hexadecimal

  in  fromCharArray (Array.replicate padCount '0') <> str
