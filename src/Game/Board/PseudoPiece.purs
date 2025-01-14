{-
  Psuedo pieces are used by the board during evaluation

  To evaluation a board, we first create a `Map` to hold connections between input/outputs. This works will for all the connections between pieces, but doesn't work for all the piece/board port connections. This piece is used to mock a board port and create an input or output in the `Right` direction.

-}
module Game.Board.PseudoPiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..))
import Data.String as String
import Game.Direction as Direction
import Game.Piece (Piece(..), PieceId(..), mkPieceNoGlob)
import Game.Piece.Complexity as Complexity
import Game.Port (Port(..), matchingPort, portType)
import Game.Port as Port
import Partial.Unsafe (unsafeCrashWith)

{-
  used for board evaluation, outputs

  
  The role of the psuedo input is to provide a signal to a port adjacent to the edge of the board. This means that a pseudo-input has an output port on the right, and a psuedo-output has an input port on the right.
-}
psuedoPiece :: Port -> Piece
psuedoPiece port = mkPieceNoGlob
  { name: PieceId $ case portType port of
      Port.Input  -> "psuedo-input"
      Port.Output -> "psuedo-output"
  , eval: \_ -> M.empty
  , ports: M.singleton Direction.Right (matchingPort port)
  , complexity: Complexity.space 0.0

  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

isPseudoPiece :: Piece -> Boolean
isPseudoPiece (Piece p) =  p.name `elem` [ PieceId "psuedo-input", PieceId "psuedo-output" ]

isPseudoInput :: Piece -> Boolean
isPseudoInput (Piece p) = p.name == PieceId "psuedo-input"

getPsuedoPiecePort :: Piece -> Maybe Port
getPsuedoPiecePort (Piece p) = do
  guard (isPseudoPiece (Piece p))
  M.lookup Direction.Right p.ports