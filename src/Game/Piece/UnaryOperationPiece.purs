module Game.Piece.UnaryOperationPiece where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Complexity (space)
import Game.Piece.Complexity as Complexity
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..), PieceId(..), mkPieceNoAdapt, shouldRipple)
import Game.Port (inputPort, noPort, outputPort)

type UnaryOperation =
  { name :: PieceId
  , capacity :: Capacity
  , op :: PieceOperation
  }

{-
  UNARY OPERATIONS:
    - take signal from the left, output to the right
    - both inputs have the same capacity
-}
mkUnaryOperation :: UnaryOperation -> Piece
mkUnaryOperation { name, capacity, op } = mkPieceNoAdapt
    { name
    , op
    , ports: Frame.fromFoldable noPort [ Tuple Direction.Left (inputPort capacity), Tuple Direction.Right (outputPort capacity)]
    , complexity: Complexity.space 1.0
    , shouldRipple: false
    , updateCapacity: \_ _ -> Nothing
    , isSimplifiable: Nothing
    }

mkShiftLeftBy :: Int -> Capacity -> Piece
mkShiftLeftBy bitShift capacity = mkUnaryOperation
  { name: PieceId "shift-left-piece"
  , capacity
  , op: Operation.ShiftLeft bitShift
  }

mkShiftRightBy :: Int -> Capacity -> Piece
mkShiftRightBy bitShift capacity = mkUnaryOperation 
  { name: PieceId "shift-left-piece"
  , capacity
  , op: Operation.ShiftRight bitShift
  }


twoBitCrossOver :: Piece
twoBitCrossOver = mkUnaryOperation
  { name: PieceId "two-bit-cross-over"
  , capacity: TwoBit
  , op: Operation.TwoBitCrossOver
  }