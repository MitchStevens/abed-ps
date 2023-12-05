module Component.Piece.Render where

import Prelude

import Component.DataAttribute as DataAttr
import Component.Piece.Types (Action(..), State)
import Data.Array as A
import Data.Enum (fromEnum)
import Data.HeytingAlgebra (ff)
import Data.Int (toNumber)
import Data.Map as M
import Data.Maybe (maybe)
import Data.Tuple (Tuple(..))
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection, allDirections, rotateDirection)
import Game.Piece (PieceId(..), name, portType)
import Game.Piece as Port
import Halogen.HTML (ClassName(..), HTML, PlainHTML, ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

electricBlue = RGB 62 207 207
gunMetalGrey = RGB 204 226 237

renderWire :: forall s m. ComponentHTML Action s m
renderWire = HH.text "nothing yet..."

renderPiece :: forall s m. State -> ComponentHTML Action s m
renderPiece state =
  SE.svg
    [ SA.viewBox 0.0 0.0 100.0 100.0 ]
    [ allPorts, center ]
  where

    allPorts = SE.g [] do
      dir <- allDirections
      let r = fromEnum (rotateDirection dir state.rotation)
      pure $ SE.g 
        [ SA.transform
          [ Rotate (toNumber r * 90.0) 50.0 50.0
          , Translate 25.0 0.0 ]
        ] $
        do
          portInfo <- A.fromFoldable (M.lookup dir state.portStates)
          pure $ renderPort (rotateDirection dir state.rotation) portInfo

    center = SE.g 
      [ SA.transform [ Translate 30.0 30.0 ] ]
      [ SE.svg [ SA.width 50.0, SA.height 50.0 ]
        [ renderPieceCenter (name state.piece) ]
      ]

renderPieceCenter :: forall p i. PieceId -> HTML p i
renderPieceCenter (PieceId id) = SE.image
  [ SA.href ("./images/" <> id <> ".png") 
  , SA.width 40.0
  , SA.height 40.0 
  ]

renderPort :: forall s m. CardinalDirection -> PortInfo -> ComponentHTML Action s m
renderPort direction {connected, port, signal} = SE.g []
  [ SE.defs [] gradients
  , portShape
  ]
  where
    portShape = case portType port of
      (Port.Input) ->
        SE.polyline
          [ SA.points portShapePoints
          , SA.classes [ClassName "port-in", ClassName "port"]
          , DataAttr.attr DataAttr.connected connected
          , SA.fillGradient (if signal /= ff then "#port-in-gradient" else "#port-in-gradient-off")
          , HP.onMouseEnter (\_ -> PortOnMouseEnter direction)
          , HP.onMouseLeave (\_ -> PortOnMouseLeave)
          ]
      (Port.Output) ->
        SE.polyline
          [ SA.points portShapePoints
          , DataAttr.attr DataAttr.connected connected
          , SA.classes [ClassName "port-out", ClassName "port"]
          , SA.fillGradient (if signal /= ff then "#port-out-gradient" else "#port-out-gradient-off")
          , HP.onMouseEnter (\_ -> PortOnMouseEnter direction)
          , HP.onMouseLeave (\_ -> PortOnMouseLeave)
          ]

    portShapePoints = case portType port of
      (Port.Input) ->
        [ Tuple 10.0  0.0
        , Tuple 10.0  12.0
        , Tuple 0.0   12.0
        , Tuple 25.0  25.0
        , Tuple 50.0  12.0
        , Tuple 40.0  12.0
        , Tuple 40.0  0.0
        ]
      (Port.Output) ->
        [ Tuple 10.0  0.0
        , Tuple 10.0  25.0
        , Tuple 40.0  25.0
        , Tuple 40.0  0.0
        ]

gradients :: forall p i. Array (HTML p i)
gradients =
  [ SE.linearGradient
    [ SA.id "port-in-gradient" , SA.gradientTransform [ Rotate 90.0 0.0 0.0 ] ]
    [ SE.stop [ SA.offset "5%" , SA.stopColor electricBlue, SA.stopOpacity 0.5 ] 
    , SE.stop [ SA.offset "95%" , SA.stopColor electricBlue ] 
    ]
  , SE.linearGradient
    [ SA.id "port-out-gradient" , SA.gradientTransform [ Rotate 90.0 0.0 0.0 ] ]
    [ SE.stop [ SA.offset "5%" , SA.stopColor electricBlue, SA.stopOpacity 0.5 ] 
    , SE.stop [ SA.offset "95%" , SA.stopColor electricBlue, SA.stopOpacity 0.0 ] 
    ]
  , SE.linearGradient
    [ SA.id "port-in-gradient-off" , SA.gradientTransform [ Rotate 90.0 0.0 0.0 ] ]
    [ SE.stop [ SA.offset "5%" , SA.stopColor gunMetalGrey, SA.stopOpacity 0.5 ] 
    , SE.stop [ SA.offset "95%" , SA.stopColor gunMetalGrey ] 
    ]
  , SE.linearGradient
    [ SA.id "port-out-gradient-off" , SA.gradientTransform [ Rotate 90.0 0.0 0.0 ] ]
    [ SE.stop [ SA.offset "5%" , SA.stopColor gunMetalGrey, SA.stopOpacity 0.5 ] 
    , SE.stop [ SA.offset "95%" , SA.stopColor gunMetalGrey, SA.stopOpacity 0.0 ] 
    ]
  ]