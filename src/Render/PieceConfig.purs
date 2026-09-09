module Render.PieceConfig where

import Prelude

import Render.Background (eggshellBackground)
import Render.Icon (xorGateIcon)
import Render.PieceShape (IconConfig(..), JunctionType(..), PieceRenderConfig, Trace(..))
import Data.Maybe (Maybe(..))
import Game.Direction (CardinalDirection(..))
import Game.Piece (Piece, andPiece, name, notPiece, orPiece, xorPiece)
import Game.Port (PortType(..))
import Partial.Unsafe (unsafeCrashWith)

-- | Left in, Right out -- the same 2-leg loop as idPiece.
notPieceTrace :: Trace
notPieceTrace =
  Link { direction: Left, portType: Input } (Just Curved)
    (Link { direction: Right, portType: Output } (Just Curved) End)

-- | Left and Up in, Right out -- shared by every dual-input/single-output
-- | gate (and, or, xor).
dualInputGateTrace :: Trace
dualInputGateTrace =
  Link { direction: Left, portType: Input } (Just Curved)
    (Link { direction: Up, portType: Input } (Just Curved)
      (Link { direction: Right, portType: Output } (Just Curved) End))

-- | The single place that knows which background/outline/icon a given piece
-- | gets. Every other rendering module is generic over this config.
pieceRenderConfig :: forall w i. Piece -> PieceRenderConfig w i
pieceRenderConfig piece
  | name piece == name notPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ notPieceTrace ] }
      , icon: ImageIcon (name notPiece)
      }
  | name piece == name andPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ dualInputGateTrace ] }
      , icon: ImageIcon (name andPiece)
      }
  | name piece == name orPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ dualInputGateTrace ] }
      , icon: ImageIcon (name orPiece)
      }
  | name piece == name xorPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ dualInputGateTrace ] }
      , icon: VectorIcon (const xorGateIcon)
      }
  | otherwise =
      unsafeCrashWith "Render.PieceConfig.pieceRenderConfig: not implemented for this piece yet"
