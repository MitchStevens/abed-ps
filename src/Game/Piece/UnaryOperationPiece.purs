module Game.Piece.UnaryOperationPiece where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Data.UInt (UInt)
import Data.UInt as UInt
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Piece.Complexity (space)
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), mkPieceNoGlob, shouldRipple)
import Game.Port (inputPort, outputPort)
import Game.Signal (Signal(..), overSignal)

type UnaryOperation =
  { name :: PieceId
  , capacity :: Capacity
  , operation :: UInt -> UInt
  }

{-
  UNARY OPERATIONS:
    - take signal from the left, output to the right
    - both inputs have the same capacity
-}
mkUnaryOperation :: UnaryOperation -> Piece
mkUnaryOperation { name, capacity, operation } = mkPieceNoGlob
    { name
    , eval: \inputs ->
        let signal = fromMaybe zero (M.lookup Direction.Left inputs)
        in M.singleton Direction.Right (overSignal operation signal)
    , ports: M.fromFoldable [ Tuple Direction.Left (inputPort capacity), Tuple Direction.Right (outputPort capacity)]
    , complexity: Complexity.space 1.0
    , shouldRipple: false
    , updateCapacity: \_ _ -> Nothing
    , isSimplifiable: Nothing
    }

mkShiftLeftBy :: Int -> Capacity -> Piece
mkShiftLeftBy bitShift capacity = mkUnaryOperation
  { name: PieceId "shift-left-piece"
  , capacity
  , operation: \n -> UInt.shl n (UInt.fromInt bitShift) }

mkShiftRightBy :: Int -> Capacity -> Piece
mkShiftRightBy bitShift capacity = mkUnaryOperation 
  { name: PieceId "shift-left-piece"
  , capacity
  , operation: \n -> UInt.shr n (UInt.fromInt bitShift) }


twoBitCrossOver :: Piece
twoBitCrossOver = mkUnaryOperation
  { name: PieceId "two-bit-cross-over"
  , capacity: TwoBit
  , operation: \n -> 
      let b0 = if UInt.and (UInt.fromInt 2) n > zero then one else zero
          b1 = if UInt.and (UInt.fromInt 1) n > zero then one else zero
      in (UInt.shl b1 one) + b0
  }