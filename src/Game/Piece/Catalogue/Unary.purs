module Game.Piece.Catalogue.Unary where

import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..))
import Game.Port (inputPort, noPort, outputPort)

type UnaryOperation =
  { capacity :: Capacity
  , op :: PieceOperation
  }

{-
  UNARY OPERATIONS:
    - take signal from the left, output to the right
    - both inputs have the same capacity
-}
mkUnaryOperation :: UnaryOperation -> Piece
mkUnaryOperation { capacity, op } = Piece
    { op
    , ports: Frame.fromFoldable noPort [ Tuple Direction.Left (inputPort capacity), Tuple Direction.Right (outputPort capacity)]
    }

mkShiftLeftBy :: Int -> Capacity -> Piece
mkShiftLeftBy bitShift capacity = mkUnaryOperation
  { capacity
  , op: Operation.ShiftLeft bitShift
  }

mkShiftRightBy :: Int -> Capacity -> Piece
mkShiftRightBy bitShift capacity = mkUnaryOperation 
  { capacity
  , op: Operation.ShiftRight bitShift
  }


twoBitCrossOver :: Piece
twoBitCrossOver = mkUnaryOperation
  { capacity: TwoBit
  , op: Operation.TwoBitCrossOver
  }
