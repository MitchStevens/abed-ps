module Game.Piece.UnaryOperationPiece where

import Prelude

import Data.Int.Bits as Int
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece (Capacity, Piece(..), PieceId(..), clampSignal, inputPort, outputPort, updateCapacity)
import Game.Piece.Complexity (space)
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

mkShiftLeft :: Capacity -> Piece
mkShiftLeft capacity = mkUnaryOperation { name: PieceId "shift-left-piece", capacity, operation: \n -> Int.shl n 1 }

mkShiftRight :: Capacity -> Piece
mkShiftRight capacity = mkUnaryOperation { name: PieceId "shift-left-piece", capacity, operation: \n -> Int.shr n 1 }