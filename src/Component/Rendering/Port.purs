module Component.Rendering.Port where

import Component.Piece.Types
import Prelude

import Component.Piece.Types as Piece
import Component.Rendering.LegShape (arrowPath, curveBetweenPath, stubPath)
import Component.Rendering.Segment (Segment, endPoint)
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


portPath :: PortInfo -> Array Segment
portPath info = headSegments <> curveBetweenPath curveStart Direction.Up Direction.Up
  where
    start = if getPortType info.port == Port.Input then { x: 40.0, y: 0.0 } else { x: 10.0, y: 25.0 }
    curveStart = fromMaybe start (endPoint <$> A.last headSegments)

    headSegments = case getPortType info.port, info.connected of
        Port.Input, _ -> arrowPath start Direction.Down
        Port.Output, true -> stubPath start Direction.Up
        Port.Output, false -> arrowPath start Direction.Up