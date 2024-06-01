module Game.Piece.BivariatePiece where

import Prelude

import Data.Int.Bits as Int
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Piece.Capacity (Capacity(..), clampSignal)
import Game.Piece.Direction as Direction
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), mkPiece, shouldRipple, updateCapacity)
import Game.Piece.Port (inputPort, outputPort)
import Game.Piece.Signal (Signal(..))


type BivariatePiece =
  { name :: PieceId
  , operation :: Int -> Int -> Int
  , capacity :: Capacity
  , complexity :: Complexity
  }

mkBivariatePiece :: BivariatePiece -> Piece
mkBivariatePiece piece = mkPiece
  { name: piece.name
  , eval:
    \inputs ->
      let Signal a = fromMaybe (Signal 0) $ M.lookup Direction.Left  inputs
          Signal b = fromMaybe (Signal 0) $ M.lookup Direction.Up    inputs
          c = clampSignal piece.capacity (Signal (piece.operation a b))
      in  M.singleton Direction.Right c
  , complexity: piece.complexity

  , shouldRipple: true
  , updateCapacity: \dir capacity -> case dir of
      Direction.Down -> Nothing
      _ -> Just (mkBivariatePiece (piece { capacity = capacity }))

  , ports:
    M.fromFoldable 
      [ Tuple Direction.Up (inputPort piece.capacity)
      , Tuple Direction.Left (inputPort piece.capacity)
      , Tuple Direction.Right (outputPort piece.capacity)
      ]
  }

allBivariatePieces :: Array Piece
allBivariatePieces =
  [ orPiece, andPiece, xorPiece ]


orPiece :: Piece
orPiece = mkBivariatePiece
  { name: PieceId "or-piece"
  , operation: Int.or
  , capacity: OneBit
  , complexity: Complexity.space 3.0
  }

andPiece :: Piece
andPiece = mkBivariatePiece
  { name: PieceId "and-piece" 
  , operation: Int.and
  , capacity: OneBit
  , complexity: Complexity.space 3.0
  }

xorPiece :: Piece
xorPiece = mkBivariatePiece
  { name: PieceId "xor-piece"
  , operation: Int.xor
  , capacity: OneBit
  , complexity: Complexity.space 3.0
  }