module Game.Piece.UnaryOperationPiece where

import Prelude

import Data.Int.Bits as Int
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity, clampSignal)
import Game.Direction as Direction
import Game.Piece.Types (Piece(..), PieceId(..))
import Game.Piece.Complexity (space)
import Game.Port (inputPort, outputPort)
import Game.Signal (Signal(..))

type UnaryOperation =
  { name :: PieceId
  , capacity :: Capacity
  , operation :: Int -> Int
  }

{-
  UNARY OPERATIONS:
    - take signal from the left, output to the right
    - both inputs have the same capacity
-}
mkUnaryOperation :: UnaryOperation -> Piece
mkUnaryOperation { name, capacity, operation } = Piece
  { complexity: space 1.0 -- todo: what space complexity should this piece have?
  , name
  , eval: \inputs ->
      let Signal n = clampSignal capacity $ fromMaybe (Signal 0) (M.lookup Direction.Left inputs)
      in M.singleton Direction.Right (clampSignal capacity (Signal (operation n)))

  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing

  , ports: M.fromFoldable [ Tuple Direction.Left (inputPort capacity), Tuple Direction.Right (outputPort capacity)]
  , updatePort: \_ _ -> Nothing
  }

mkShiftLeftBy :: Int -> Capacity -> Piece
mkShiftLeftBy bitShift capacity = mkUnaryOperation
  { name: PieceId "shift-left-piece"
  , capacity
  , operation: \n -> Int.shl n bitShift }

mkShiftRightBy :: Int -> Capacity -> Piece
mkShiftRightBy bitShift capacity = mkUnaryOperation 
  { name: PieceId "shift-left-piece"
  , capacity
  , operation: \n -> Int.shr n bitShift }