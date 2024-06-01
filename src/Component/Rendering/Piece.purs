module Component.Rendering.Piece where

import Prelude

import Component.Piece.Types (Action, State)
import Component.Piece.Types as Piece
import Component.Rendering.CrossOver (renderChicken, renderCornerCut, renderCrossOver)
import Component.Rendering.Path (renderPathWithEvents)
import Component.Rendering.Port (portPath)
import Component.Rendering.Wire (renderWire)
import Control.Alternative (guard)
import Data.Array (elem)
import Data.Array as A
import Data.Int (toNumber)
import Data.Map as M
import Data.Maybe (Maybe(..), isJust, isNothing, maybe)
import Data.Number (pi)
import Debug (trace)
import Game.Piece.Direction (allDirections, clockwiseRotation, rotateDirection)
import Game.Piece.Direction as Direction
import Game.Piece (PieceId(..), chickenPiece, cornerCutPiece, crossPiece, isWirePiece, name)
import Game.Piece.Rotation (Rotation(..), toDegrees, toRadians)
import Halogen (ComponentHTML)
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Attributes.Duration (defaultDuration)
import Halogen.Svg.Elements as SE

renderPiece :: forall s m. State -> ComponentHTML Action s m
renderPiece state = 
    SE.svg
      [ SA.viewBox 0.0 0.0 100.0 100.0 ]
      [ SE.g
        attributes
        ([ render ] <> animations)
      ]
  where
    pieceRotation =   maybe (toDegrees state.rotation) (_.currentRotation >>> mul (180.0 / pi)) state.isRotating

    attributes = [ SA.transform [Rotate pieceRotation 50.0 50.0] ]
      --if (isJust state.isRotating)
      --  then [ SA.transform [Rotate pieceRotation 50.0 50.0] ]
      --  else []

    animations = []
    --animations = do
    --  guard (isNothing state.isRotating)
    --  pure $ SE.animateMotion
    --    [ SA.attributeName "transform"
    --    , SA.to ("rotate(" <> show pieceRotation <> ",50.0,50.0)")
    --    , SA.dur (defaultDuration { milliseconds = Just 500.0 })
    --    , SA.repeatCount "1"
    --    ]

    render
      | isWirePiece state.piece = renderWire state.portStates
      | name state.piece == name crossPiece = renderCrossOver state.portStates
      | name state.piece == name cornerCutPiece = renderCornerCut state.portStates
      | name state.piece == name chickenPiece = renderChicken state.portStates
      | otherwise = renderDefaultPiece state

renderDefaultPiece :: forall s m. State -> ComponentHTML Action s m
renderDefaultPiece state = SE.g [] (allPorts <> [ center ])
  where
    allPorts = do
      dir <- allDirections
      let r = clockwiseRotation Direction.Up dir 
      
      pure $ SE.g 
        [ SA.transform
          [ Rotate (toDegrees r) 50.0 50.0
          , Translate 25.0 0.0 ]
        ] $
        do
          portInfo <- A.fromFoldable (M.lookup dir state.portStates)
          let path = portPath portInfo
          pure $ renderPathWithEvents path (Piece.PortOnMouseEnter dir) Piece.PortOnMouseLeave

    center = SE.g 
      [ SA.transform [ Translate 30.0 30.0 ] ]
      [ SE.svg [ SA.width 50.0, SA.height 50.0 ]
        [ renderPieceCenter (name state.piece) ]
      ]

    renderPieceCenter (PieceId id) = SE.image
      [ SA.href ("./images/" <> id <> ".png") 
      , SA.width 40.0
      , SA.height 40.0 
      ]
