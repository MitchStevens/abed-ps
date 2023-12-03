{-
  Psuedo pieces are used by the board during evaluation

  To evaluation a board, we first create a `Map` to hold connections between input/outputs. This works will for all the connections between pieces, but doesn't work for all the piece/board port connections. This piece is used to mock a board port and create an input or output in the `Right` direction.

-}
module Game.Board.PseudoPiece where

import Prelude

import Data.Array (elem)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..))
import Data.String as String
import Game.Direction as Direction
import Game.Piece (class Piece, APiece, PieceId(..), Port(..), mkPiece, name, portCapacity, portType, updateCapacity)
import Game.Piece as Port

-- used for board evaluation, outputs
newtype PseudoPiece = Pseudo Port

instance Piece PseudoPiece where
  name (Pseudo port) = case portType port of
    Port.Input -> PieceId "psuedo-input"
    Port.Output -> PieceId "psuedo-output"
  eval _ _ = M.empty
  getCapacity (Pseudo port) = Just (portCapacity port)
  updateCapacity  _ _ = Nothing
  getPorts (Pseudo port) = M.singleton Direction.Right port
  updatePort _ _ _ = Nothing

psuedoPiece :: Port -> APiece
psuedoPiece port = mkPiece (Pseudo port)

isPseudoPiece :: forall p. Piece p => p -> Boolean
isPseudoPiece piece = name piece `elem` [ PieceId "psuedo-input", PieceId "psuedo-output" ]