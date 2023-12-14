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
import Game.Piece.Complexity as Complexity
import Game.Piece.Port (Port(..), portType)
import Game.Piece.Port as Port
import Game.Piece.Types (Piece(..), PieceId(..))

-- used for board evaluation, outputs
type PseudoPiece = Port

psuedoPiece :: Port -> Piece
psuedoPiece port = Piece
  { name: PieceId $ case portType port of
      Port.Input  -> "psuedo-input"
      Port.Output -> "psuedo-output"
  , eval: \_ -> M.empty
  , complexity: Complexity.space 0.0

  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing

  , ports: M.singleton Direction.Right port
  , updatePort: \_ _ -> Nothing
  }

isPseudoPiece :: Piece -> Boolean
isPseudoPiece (Piece p) =  p.name `elem` [ PieceId "psuedo-input", PieceId "psuedo-output" ]