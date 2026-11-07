module Game.Piece.Property.Ripple
  ( shouldRipple
  ) where

import Game.Piece.Operation (PieceOperation(..))
import Game.Piece.Types (Piece(..))

{-
  When capacity of a port is changed, we want to do one of the following:
    - the capacity should change, and the capacity should ripple to adjacent pieces 
    - the capacity should change, but the capacity should *not* ripple
    - the capacity shouldn't change

  `updateCapacity` decides whether the capacity changes, this decides whether it ripples.
-}
shouldRipple :: Piece -> Boolean
shouldRipple (Piece p) = case p.op of
  Not -> true
  Or -> true
  And -> true
  Xor -> true
  Connection _ -> true
  Fuse _ -> true
  Sever _ -> true

  Succ _ -> false
  Adder _ -> false
  Multiplier -> false
  ShiftLeft _ -> false
  ShiftRight _ -> false
  TwoBitCrossOver -> false
  Equal -> false
  GreaterThan -> false
  LessThan -> false
