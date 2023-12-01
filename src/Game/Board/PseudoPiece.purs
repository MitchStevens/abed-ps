{-
  Psuedo pieces are used by the board during evaluation

  To evaluation a board, we first create a `Map` to hold connections between input/outputs. This works will for all the connections between pieces, but doesn't work for all the piece/board port connections. This piece is used to mock a board port and create an input or output in the `Right` direction.

-}
module Game.Board.PseudoPiece where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..))
import Game.Direction as Direction
import Game.Piece (class Piece, APiece, PieceId(..), Port(..), mkPiece, portCapacity, updateCapacity)
import Game.Piece as Port

-- used for board evaluation, outputs
newtype PseudoPiece = Pseudo Port

instance Piece PseudoPiece where
  name _ = PieceId "psuedo"
  eval _ _ = M.empty
  getCapacity (Pseudo port) = Just (portCapacity port)
  updateCapacity  _ _ = Nothing
  getPorts (Pseudo port) = M.singleton Direction.Left port
  updatePort _ _ _ = Nothing

psuedoPiece :: Port -> APiece
psuedoPiece port = mkPiece (Pseudo port)