module Render.Wire where

import Prelude

import Render.LegShape (curveBetweenPath, initialLocation, outputPath, stubPath, terminalLocation)
import Render.Segment (Segment, renderPath)
import Data.Array (zip)
import Data.Array as A
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (maybe)
import Data.Tuple (Tuple(..), fst, snd, uncurry)
import Game.Frame (Frame)
import Game.Direction (CardinalDirection)
import Game.Frame as Frame
import Game.Port (isInput)
import Game.PortInfo (PortInfo, hasPortInfo)
import Halogen (ComponentHTML)
import Halogen.Svg.Attributes (Color(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

{-
A wirepath is a path that implies the operation of a piece. The outline traces a path with arrows for outputs and stubs for inputs.
-}



wirePieceFrameStroke :: Color
wirePieceFrameStroke = RGB 198 193 183

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

renderWire :: forall action s m. Frame PortInfo -> ComponentHTML action s m
renderWire portStates =
  SE.g []
    [ wirePieceFrame
    , renderPath (wirePath portStates)
    ]

wirePath :: Frame PortInfo -> Array Segment
wirePath ports = maybe [] render (A.uncons present)
  where
  -- the loop runs through the sides that actually have a port, in
  -- up/right/down/left order -- a side with no port isn't part of it
  present :: Array (Tuple CardinalDirection PortInfo)
  present = A.filter (hasPortInfo <<< snd) (A.fromFoldable (Frame.toListWithIndex ports))

  render :: { head :: Tuple CardinalDirection PortInfo, tail :: Array (Tuple CardinalDirection PortInfo) } -> Array Segment
  render { head, tail } =
    A.concatMap (uncurry renderSide) sides
    where
    sides = zip present (map fst $ tail <> [head])

  renderSide :: Tuple CardinalDirection PortInfo -> CardinalDirection -> Array Segment
  renderSide (Tuple from info) to =
    (if isInput info.port then stubPath (initialLocation from) from else outputPath info.connected (initialLocation from) from)
      <> curveBetweenPath (terminalLocation from) from to
