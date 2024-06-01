module Game.Board.PieceInfo where

import Prelude

import Data.Lens (Lens')
import Data.Lens.Record (prop)
import Game.Piece.Rotation (Rotation(..))
import Game.Piece (Piece(..))
import Type.Proxy (Proxy(..))

type PieceInfo =
  { piece :: Piece
  , rotation :: Rotation 
  }

_piece :: Lens' PieceInfo Piece
_piece = prop (Proxy :: _ "piece")

_rotation :: Lens' PieceInfo Rotation
_rotation = prop (Proxy :: _ "rotation")