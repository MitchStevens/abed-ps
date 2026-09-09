module Render.Port where

import Component.Piece.Types
import Prelude

import Component.Piece.Types as Piece
import Render.LegShape (arrowPath, stubPath)
import Render.Segment (Segment(..), endPoint)
import Data.Array as A
import Data.Foldable (intercalate)
import Data.Maybe (fromMaybe)
import Game.Direction as Direction
import Game.Port (getPortType)
import Game.Port as Port
import Game.PortInfo (PortInfo)
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML (HTML, IProp, object)
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE


-- | `portPath` draws a single self-contained closed icon (unlike
-- | `Render.Outline`/`Wire`, which chain several legs together
-- | with `curveBetweenPath`) -- so it closes back to its own `start` with a
-- | plain line rather than that generic between-legs curve. The two aren't
-- | interchangeable: `curveBetweenPath`'s offset is fixed by direction, not
-- | by where `start` actually is, so it only closed the loop by coincidence
-- | for the output/`arrowPath ... Direction.Up` case (its own fixed offset
-- | happened to match that `start`) and left a dangling stray segment for
-- | the input/`arrowPath ... Direction.Down` case, where it doesn't.
portPath :: PortInfo -> Array Segment
portPath info = headSegments <> [ LineTo { from: curveStart, to: start } ]
  where
    start = if getPortType info.port == Port.Input then { x: 40.0, y: 0.0 } else { x: 10.0, y: 25.0 }
    curveStart = fromMaybe start (endPoint <$> A.last headSegments)

    headSegments = case getPortType info.port, info.connected of
        Port.Input, _ -> arrowPath start Direction.Down
        Port.Output, true -> stubPath start Direction.Up
        Port.Output, false -> arrowPath start Direction.Up