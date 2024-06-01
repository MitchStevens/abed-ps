module Component.Rendering.BoardPortDiagram
  ( renderBoardPortDiagram
  )
  where

import Prelude

import Component.DataAttribute (DataAttribute)
import Component.DataAttribute as DA
import Component.Rendering.Colours (red)
import Data.Array as A
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..))
import Game.Board (EvaluableBoard(..), evaluableBoardPiece)
import Game.Piece.Capacity (toInt)
import Game.Piece.Direction (CardinalDirection, allDirections, clockwiseRotation)
import Game.Piece.Direction as Direction
import Game.Level.Completion (PortMismatch(..), isPortMismatch)
import Game.Piece (Piece(..), getPort)
import Game.Piece.Port (Port(..), portCapacity, portType)
import Game.Piece.Port as Port
import Game.Piece.Rotation (toDegrees)
import Halogen (AttrName(..), ClassName(..), ComponentHTML)
import Halogen.HTML as HH
import Halogen.Svg.Attributes (Baseline(..), CommandPositionReference(..), Orient(..), TextAnchor(..), Transform(..), l, m, z)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements (defs)
import Halogen.Svg.Elements as SE



renderBoardPortDiagram :: forall a s m. Piece -> Map CardinalDirection Port -> ComponentHTML a s m
renderBoardPortDiagram goal boardPorts =
  SE.svg
    [ SA.viewBox 0.0 0.0 100.0 100.0
    , SA.class_ (ClassName "board-port-diagram") ]
    ([center] <> map port allDirections)
  where
    centerWidth = 30.0
    arrowLength = ((100.0 - centerWidth) / 2.0) - 5.0

    center = SE.rect
      [ SA.width centerWidth
      , SA.height centerWidth 
      , SA.x ((100.0 - centerWidth) / 2.0)
      , SA.y ((100.0 - centerWidth) / 2.0)
      ]

    port :: CardinalDirection -> ComponentHTML a s m
    port dir =
      SE.g
        ([ SA.classes [ ClassName "port" ]
        , DA.attr DA.direction dir
        ] <> portMismatchAttribute)
        [ defs
        , SE.g [] $
          case portMismatch of
              Just (PortExpected { direction, expected }) -> [ arrow (portType expected), label (portCapacity expected) ]
              Just (NoPortExpected { direction, received }) -> [ arrow (portType received) ]
              Just (IncorrectPortType { direction, capacity, received, expected }) -> [ arrow received, label capacity ]
              Just (IncorrectCapacity { direction, portType, received, expected }) -> [ arrow portType, label expected ]
              Nothing -> maybe [] (\(Port { capacity, portType }) -> [ arrow portType, label capacity ]) (M.lookup dir boardPorts)
        ]
      where
        portMismatchAttribute = maybe [] (A.singleton <<< DA.attr DA.portMismatch) portMismatch

        portMismatch = isPortMismatch dir (getPort goal dir) (M.lookup dir boardPorts)

        arrow portType = SE.g
          [ SA.transform [ Rotate (toDegrees (clockwiseRotation Direction.Up dir)) 50.0 50.0 ] ]
          [ SE.line
            [ SA.x1 50.0
            , SA.y1 5.0
            , SA.x2 50.0
            , SA.y2 arrowLength
            , SA.strokeWidth 2.0
            , if portType == Port.Input 
                then SA.markerEnd $ "url(#arrow" <> show dir <> ")" 
                else SA.markerStart $ "url(#arrow" <> show dir  <>")"
            ]
          ]

        label capacity =
          let Tuple x y = case dir of
                Direction.Up -> Tuple 55.0 (arrowLength - 5.0)
                Direction.Right -> Tuple (100.0 - arrowLength + 5.0) (50.0 - 5.0)
                Direction.Down -> Tuple 55.0 (100.0 - arrowLength + 3.0)
                Direction.Left -> Tuple (arrowLength - 5.0) (50.0 - 5.0)
              textAnchor = if dir == Direction.Left then AnchorEnd else AnchorStart
              baseline = if dir == Direction.Down then Hanging else Auto
          in
            SE.text
            [ SA.x x, SA.y y, SA.textAnchor textAnchor, SA.dominantBaseline baseline ]
            [ HH.text $ show (toInt capacity) ]
        
        defs = SE.defs []
          [ SE.marker
            [ SA.id $ "arrow" <> show dir
            , SA.refX 5.0
            , SA.refY 5.0
            , SA.markerWidth 5.0
            , SA.markerHeight 5.0
            , SA.orient AutoStartReverse
            , SA.viewBox 0.0 0.0 10.0 10.0
            ]
            [ SE.path [ SA.d [ m Abs 0.0 0.0, l Abs 10.0 5.0, l Abs 0.0 10.0, z] ]
            ]
          ]

