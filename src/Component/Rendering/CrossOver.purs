module Component.Rendering.CrossOver where

import Prelude

import Component.Piece.Types as Piece
import Component.Rendering.Segment (renderPath)
import Component.Rendering.Wire (renderWire, wirePath, wirePieceFrame)
import Data.Foldable (elem)
import Data.Int (toNumber)
import Data.Map (Map)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Debug (trace)
import Game.Direction (CardinalDirection, clockwiseRotation)
import Game.Direction as Direction
import Game.PortInfo (PortInfo)
import Game.Rotation (Rotation(..))
import Halogen (ComponentHTML)
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

renderCrossOver :: forall s m. Map CardinalDirection PortInfo -> ComponentHTML Piece.Action s m
renderCrossOver = renderDualInputDualOutputPiece (Tuple Direction.Left Direction.Right) (Tuple Direction.Up Direction.Down)

renderCornerCut :: forall s m. Map CardinalDirection PortInfo -> ComponentHTML Piece.Action s m
renderCornerCut = renderDualInputDualOutputPiece (Tuple Direction.Left Direction.Down) (Tuple Direction.Up Direction.Right)

renderChicken :: forall s m. Map CardinalDirection PortInfo -> ComponentHTML Piece.Action s m
renderChicken = renderDualInputDualOutputPiece (Tuple Direction.Left Direction.Down) (Tuple Direction.Right Direction.Up)

renderReverseChicken :: forall s m. Map CardinalDirection PortInfo -> ComponentHTML Piece.Action s m
renderReverseChicken = renderDualInputDualOutputPiece (Tuple Direction.Left Direction.Right) (Tuple Direction.Up Direction.Down)

renderDualInputDualOutputPiece :: forall s m. Tuple CardinalDirection CardinalDirection -> Tuple CardinalDirection CardinalDirection -> Map CardinalDirection PortInfo -> ComponentHTML Piece.Action s m
renderDualInputDualOutputPiece (Tuple to1 from1) (Tuple to2 from2) portStates = SE.g []
  [ wirePieceFrame
  , renderPath path1
  , renderPath path2
  ]
  where
    path1 = wirePath false (M.filterKeys (_ `elem` [to1, from1]) portStates)
    path2 = wirePath false (M.filterKeys (_ `elem` [to2, from2]) portStates)



--render :: forall s m. Map CardinalDirection  -> ComponentHTML Piece.Action s m
--renderWire portStates = renderPathWithEvents (wirePath portStates) (Piece.PortOnMouseEnter Direction.Left) Piece.PortOnMouseLeave -- todo: change direction.left to