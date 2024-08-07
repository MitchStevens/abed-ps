module Game.Piece.CastPiece where

import Prelude

import Data.Map as M
import Game.Piece (Piece(..), PieceId(..), mkPiece)
import Game.Piece.Capacity (Capacity)
import Game.Piece.Direction as Direction

-- capacity <= 4
--mkUpCastPiece :: Capacity -> Piece
--mkUpCastPiece inputCapacity = mkPiece
--  { name: PieceId "upcast-piece"
--  , ports: \{u, d, l, r} -> 
--  }