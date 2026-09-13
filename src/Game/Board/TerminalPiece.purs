{-
  Terminal pieces are used by the board during evaluation.

  To evaluate a board, we first create a `Map` to hold connections between
  inputs/outputs. This works well for all the connections between pieces, but
  doesn't work for the piece/board-edge connections. This piece is used to mock
  a board-edge terminal and create an input or output in the `Right` direction.
-}
module Game.Board.TerminalPiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..))
import Data.String as String
import Game.Direction as Direction
import Game.Piece (Piece(..), PieceId(..), mkPieceNoAdapt)
import Game.Piece.Complexity as Complexity
import Game.Port (Port(..), getPortType, matchingPort)
import Game.Port as Port
import Partial.Unsafe (unsafeCrashWith)

{-
  used for board evaluation, outputs

  The role of the terminal input is to provide a signal to a port adjacent to
  the edge of the board. This means that a terminal-input has an output port on
  the right, and a terminal-output has an input port on the right.
-}
terminalPiece :: Port -> Piece
terminalPiece port = mkPieceNoAdapt
  { name: PieceId $ case getPortType port of
      Port.Input  -> "terminal-input"
      Port.Output -> "terminal-output"
      -- wormhole ports are not surfaced as board-edge terminal pieces (yet);
      -- fall back to their structural equivalents
      Port.WormholeOut -> "terminal-input"
      Port.WormholeIn  -> "terminal-output"
  , eval: \_ -> M.empty
  , ports: M.singleton Direction.Right (matchingPort port)
  , complexity: Complexity.space 0.0

  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

isTerminalPiece :: Piece -> Boolean
isTerminalPiece (Piece p) =  p.name `elem` [ PieceId "terminal-input", PieceId "terminal-output" ]

isTerminalInput :: Piece -> Boolean
isTerminalInput (Piece p) = p.name == PieceId "terminal-input"

getTerminalPiecePort :: Piece -> Maybe Port
getTerminalPiecePort (Piece p) = do
  guard (isTerminalPiece (Piece p))
  M.lookup Direction.Right p.ports
