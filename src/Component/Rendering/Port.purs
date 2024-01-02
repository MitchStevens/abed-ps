module Component.Rendering.Port where

import Component.Piece.Types
import Prelude

import Component.DataAttribute as DA
import Component.Piece.Types as Piece
import Component.Rendering.Gradient (createPortGradient)
import Component.Rendering.Path (Path, SimplifiedF(..), SimplifiedPathCommand, rotateByAround, toPathCommand)
import Data.Foldable (intercalate)
import Data.Tuple (Tuple(..))
import Game.Board.PortInfo (PortInfo)
import Game.Piece (Capacity(..), Port(..), isInput, portCapacity, portType, toInt)
import Game.Piece as Port
import Game.Rotation (rotation)
import Game.Signal (Signal(..))
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML (HTML, IProp, object)
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (Color(..), PathCommand, Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE


portPath :: PortInfo -> Path
portPath info =
  { path: map toPathCommand simplifiedPath
  , gradient: createPortGradient info
  , attrs: DA.attr DA.connected info.connected
  }
  where
    simplifiedPath = map (rotateByAround rot (Tuple 25.0 12.5)) $ [M (Tuple 10.0 25.0)] <> case portType info.port, info.connected of
        Port.Input, _ -> arrowHeadPath
        Port.Output, true -> stubPath
        Port.Output, false -> arrowHeadPath

    rot = case portType info.port of
      Port.Input  -> rotation 2
      Port.Output -> rotation 0

arrowHeadPath :: Array SimplifiedPathCommand
arrowHeadPath = map L
  [ Tuple 0.0 (-13.0)
  , Tuple (-10.0) 0.0
  , Tuple 25.0 (-12.0)
  , Tuple 25.0 12.0
  , Tuple (-10.0) 0.0
  , Tuple 0.0 13.0
  ]

stubPath :: Array SimplifiedPathCommand
stubPath = map L
  [ Tuple 0.0 (-25.0)
  , Tuple 30.0 0.0
  , Tuple 0.0 25.0
  ]