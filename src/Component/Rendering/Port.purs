module Component.Rendering.Port where

import Component.Piece.Types
import Prelude

import Component.DataAttribute as DA
import Component.Piece.Types as Piece
import Component.Rendering.Gradient (createPortGradient)
import Component.Rendering.Path (Path)
import Component.Rendering.Wire (arrowPath, betweenPath, initialLocation)
import Data.Foldable (intercalate)
import Data.Tuple (Tuple(..))
import Game.Board.PortInfo (PortInfo)
import Game.Direction as Direction
import Game.Piece (Capacity(..), Port(..), isInput, portCapacity, portType, toInt)
import Game.Piece as Port
import Game.Rotation (rotation)
import Game.Signal (Signal(..))
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML (HTML, IProp, object)
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (Color(..), CommandPositionReference(..), PathCommand, Transform(..), m)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE


portPath :: PortInfo -> Path
portPath info =
  { path
  , gradient: createPortGradient info
  , attrs: DA.attr DA.connected info.connected
  }
  where
    Tuple x0 y0 = if portType info.port == Port.Input then Tuple 40.0 0.0 else  Tuple 10.0 25.0
    path = [ m Rel x0 y0 ] <> headPath <> betweenPath Direction.Up Direction.Up

    headPath = case portType info.port, info.connected of
        Port.Input, _ -> arrowPath Direction.Down
        --Port.Output, true -> stubPa Direction.Up
        --Port.Output, false -> arrowPath Direction.Up
        Port.Output, _ -> arrowPath Direction.Up