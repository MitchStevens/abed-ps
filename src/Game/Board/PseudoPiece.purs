module Game.Board.PseudoPiece where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..))
import Game.Direction as Direction
import Game.Piece (class Piece, APiece, PieceId(..), Port(..), mkPiece, portType)
import Game.Piece as Port

-- used for board evaluation, outputs
newtype PseudoPiece = Pseudo Port

instance Piece PseudoPiece where
  name _ = PieceId "psuedo"
  eval _ _ = M.empty
  getCapacity _ = Nothing
  updateCapacity _ _ = Nothing
  getPorts (Pseudo port) = M.singleton Direction.Left port
  updatePort _ _ _ = Nothing

psuedoPiece :: Port -> APiece
psuedoPiece port = mkPiece (Pseudo port)