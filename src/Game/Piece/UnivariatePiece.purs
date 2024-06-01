module Game.Piece.UnivariatePiece where

import Prelude

import Data.Array (elem)
import Data.Int.Bits as Int
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Piece.Capacity (Capacity(..), clampSignal)
import Game.Piece.Direction as Direction
import Game.Piece.Complexity (Complexity, space)
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), mkPiece)
import Game.Piece.Port (inputPort, outputPort)
import Game.Piece.Signal (Signal(..))


{-
  univariate pieces:
    - take signal from the left, output to the right
    - both inputs have the same capacity
-}
type UnivariatePiece =
  { name :: PieceId
  , operation :: Signal -> Signal
  , capacity :: Capacity
  , complexity :: Complexity
  }

mkUnivariatePiece :: UnivariatePiece -> Piece
mkUnivariatePiece piece = mkPiece
  { name: piece.name
  , eval:
    \inputs ->
      let a = fromMaybe (Signal 0) $ M.lookup Direction.Left  inputs
      in  M.singleton Direction.Right (clampSignal piece.capacity $ piece.operation a)
  , complexity: piece.complexity

  , shouldRipple: true
  , updateCapacity: \dir capacity ->
      if dir `elem` [Direction.Left, Direction.Right]
        then Just $ mkUnivariatePiece (piece { capacity = capacity })
        else  Nothing
  , ports:
    M.fromFoldable 
      [ Tuple Direction.Left (inputPort piece.capacity)
      , Tuple Direction.Right (outputPort piece.capacity)
      ]
  }

allUnivariatePieces = [ notPiece ]

notPiece :: Piece
notPiece = mkUnivariatePiece
  { name: PieceId "not-piece"
  , capacity: OneBit
  , operation: \(Signal n) -> Signal (Int.complement n)
  , complexity: Complexity.space 2.0
  }

mkShiftLeftBy :: Int -> Capacity -> Piece
mkShiftLeftBy bitShift capacity = mkUnivariatePiece
  { name: PieceId "shift-left-piece"
  , capacity
  , operation: \(Signal n) -> Signal (Int.shl n bitShift)
  , complexity: mempty
  }

mkShiftRightBy :: Int -> Capacity -> Piece
mkShiftRightBy bitShift capacity = mkUnivariatePiece 
  { name: PieceId "shift-left-piece"
  , capacity
  , operation: \(Signal n) -> Signal (Int.shr n bitShift)
  , complexity: mempty
  }