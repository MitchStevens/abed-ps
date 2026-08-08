module Component.Rendering.Wire where

import Prelude

import Component.Piece.Types as Piece
import Component.Rendering.LegShape (curveBetweenPath, initialLocation, outputPath, stubPath, terminalLocation)
import Component.Rendering.Segment (Segment, renderPath)
import Data.Array (zip)
import Data.Array as A
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (maybe)
import Data.Tuple (Tuple(..), fst, uncurry)
import Game.Direction (CardinalDirection)
import Game.Piece (Piece, name, superPiece)
import Game.Port (isInput)
import Game.PortInfo (PortInfo)
import Halogen (ComponentHTML)
import Halogen.Svg.Attributes (Color(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

{-
A wirepath is a path that implies the operation of a piece. The outline traces a path with arrows for outputs and stubs for inputs.
-}



wirePieceFrameStroke :: Color
wirePieceFrameStroke = RGB 198 193 183

superPieceWireStroke :: Color
superPieceWireStroke = RGB 72 78 90

-- | The rounded-rect border shared by every wire-family piece (simple wires and the
-- | dual-input/dual-output crossover pieces), so they all frame their trace consistently.
wirePieceFrame :: forall a s m. ComponentHTML a s m
wirePieceFrame =
  SE.rect
    [ SA.x inset
    , SA.y inset
    , SA.width (100.0 - 2.0 * inset)
    , SA.height (100.0 - 2.0 * inset)
    , SA.rx cornerRadius
    , SA.ry cornerRadius
    , SA.fill (Named "none")
    , SA.stroke wirePieceFrameStroke
    , SA.strokeWidth 0.55
    ]
  where
  inset = 5.0
  cornerRadius = 9.0

renderWire :: forall s m. Piece -> Map CardinalDirection PortInfo -> ComponentHTML Piece.Action s m
renderWire piece portStates =
  SE.g []
    [ wirePieceFrame
    , renderPath (wirePath (name piece == name superPiece) portStates)
    ]

-- | When `strokeOnly` is true (super piece), draw the trace as an unfilled path with a thin stroke instead of a port gradient.
wirePath :: Boolean -> Map CardinalDirection PortInfo -> Array Segment
wirePath _strokeOnly ports = maybe [] render (A.uncons (M.toUnfoldable ports))
  where
  render :: { head :: Tuple CardinalDirection PortInfo, tail :: Array (Tuple CardinalDirection PortInfo) } -> Array Segment
  render { head, tail } =
    A.concatMap (uncurry renderSide) sides
    where
    sides = zip (M.toUnfoldable ports) (map fst $ tail <> [head])

  renderSide :: Tuple CardinalDirection PortInfo -> CardinalDirection -> Array Segment
  renderSide (Tuple from info) to =
    (if isInput info.port then stubPath (initialLocation from) from else outputPath info.connected (initialLocation from) from)
      <> curveBetweenPath (terminalLocation from) from to
