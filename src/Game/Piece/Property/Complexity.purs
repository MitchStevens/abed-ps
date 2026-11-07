module Game.Piece.Property.Complexity where

import Prelude

import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import Data.Monoid.Additive (Additive(..))
import Data.Set as S
import Game.Piece.Operation (PieceOperation(..), wireOutputs)

type Complexity = 
  { space :: Additive Number
  , time :: Additive Number
  }

space :: Number -> Complexity
space = { space: _, time: mempty } <<< Additive

time :: Number -> Complexity
time = { space: mempty, time: _ } <<< Additive


complexity :: PieceOperation -> Complexity
complexity = case _ of
  Not -> space 1.0
  Or -> space 1.0
  And -> space 1.0
  Xor -> space 1.0

  Connection connections -> case wireOutputs connections of
    Just outputs -> space (toNumber (S.size outputs))
    Nothing -> space 1.0

  Succ _ -> space 10.0
  Adder _ -> space 10.0
  Multiplier -> space 10.0

  Fuse _ -> space 1.0
  Sever _ -> space 1.0

  ShiftLeft _ -> space 1.0
  ShiftRight _ -> space 1.0
  TwoBitCrossOver -> space 1.0

  Equal -> space 0.0
  GreaterThan -> space 0.0
  LessThan -> space 0.0

