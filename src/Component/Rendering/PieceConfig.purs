module Component.Rendering.PieceConfig where

import Prelude

import Component.Rendering.Background (eggshellBackground)
import Component.Rendering.Icon (andGateIcon, notGateIcon, orGateIcon, xorGateIcon)
import Component.Rendering.PieceShape (IconConfig(..), JunctionType(..), PieceRenderConfig, Trace(..))
import Data.Maybe (Maybe(..))
import Game.Direction (CardinalDirection(..))
import Game.Piece (Piece, andPiece, name, notPiece, orPiece, superPiece, xorPiece)
import Game.Port (PortType(..))
import Halogen.Svg.Attributes (Color(..))
import Partial.Unsafe (unsafeCrashWith)

superPieceTrace :: Trace
superPieceTrace =
  Link { direction: Left, portType: Input } (Just Curved)
    (Link { direction: Up, portType: Output } (Just Curved)
      (Link { direction: Right, portType: Output } (Just Curved)
        (Link { direction: Down, portType: Output } (Just Curved) End)))

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
  | name piece == name superPiece =
      { background: { fill: Just (Named "white"), frame: true }
      , outline: { shape: [ superPieceTrace ] }
      , icon: NoIcon
      }
  | name piece == name notPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ notPieceTrace ] }
      , icon: VectorIcon (const notGateIcon)
      }
  | name piece == name andPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ dualInputGateTrace ] }
      , icon: VectorIcon (const andGateIcon)
      }
  | name piece == name orPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ dualInputGateTrace ] }
      , icon: VectorIcon (const orGateIcon)
      }
  | name piece == name xorPiece =
      { background: { fill: Just eggshellBackground, frame: true }
      , outline: { shape: [ dualInputGateTrace ] }
      , icon: VectorIcon (const xorGateIcon)
      }
  | otherwise =
      unsafeCrashWith "Component.Rendering.PieceConfig.pieceRenderConfig: not implemented for this piece yet"
