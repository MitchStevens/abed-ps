module PieceViewer.Sidebar
  ( Input
  , render
  ) where

import Prelude

import Data.Array as A
import Data.Int (round)
import Data.Int as Int
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Number (fromString) as N
import Data.Number.Format as Nf
import Game.Direction (CardinalDirection(..), allDirections)
import Game.Piece (PieceId(..), adapt, allPieces, getPort, name)
import Game.Port (PortType(..), isInput)
import Game.Rotation (toDegrees)
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import PieceViewer.Types as Types
import PieceViewer.Update (Update(..))

type Input = Types.State

render
  :: forall action slots m
   . Input
  -> (Update -> action)
  -> ComponentHTML action slots m
render input onUpdate =
  HH.div
    [ HP.class_ (ClassName "pv-pane") ]
    [ HH.h2 [ HP.class_ (ClassName "pv-pane-title") ] [ HH.text "Controls" ]
    , HH.div
        [ HP.class_ (ClassName "pv-controls") ]
        [ controlSection "Piece" pieceSelect
        , controlSection "Inputs" inputsField
        , controlSection "Scale" scaleField
        , controlSection "Rotation" rotationField
        , controlSection "Animations" animationsField
        , controlSection "Tiling" tilingField
        , controlSection "Adapting" adaptingField
        ]
    ]
  where
  controlSection title body =
    HH.section
      [ HP.class_ (ClassName "pv-control-section") ]
      [ HH.h3 [ HP.class_ (ClassName "pv-section-title") ] [ HH.text title ]
      , HH.div [ HP.class_ (ClassName "pv-section-body") ] [ body ]
      ]

  rotationDegreesLabel :: String
  rotationDegreesLabel =
    show (round (toDegrees input.rotation)) <> "°"

  rotationField =
    HH.div_
      [ HH.p
          [ HP.class_ (ClassName "pv-rotation-readout") ]
          [ HH.text ("Current rotation: " <> rotationDegreesLabel) ]
      , HH.div
          [ HP.class_ (ClassName "pv-row") ]
          [ HH.button
              [ HP.class_ (ClassName "pv-btn")
              , HE.onClick (const (onUpdate RotateCW)) ]
              [ HH.text "Rotate CW" ]
          , HH.button
              [ HP.class_ (ClassName "pv-btn")
              , HE.onClick (const (onUpdate RotateCCW)) ]
              [ HH.text "Rotate CCW" ]
          ]
      ]

  animationsField =
    HH.div
      [ HP.class_ (ClassName "pv-row") ]
      [ HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary")
          , HE.onClick (const (onUpdate AnimateHeadShake)) ]
          [ HH.text "Head shake" ]
      , HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary")
          , HE.onClick (const (onUpdate AnimateSpin)) ]
          [ HH.text "Spin once" ]
      , HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary")
          , HE.onClick (const (onUpdate AnimatePieceAdded)) ]
          [ HH.text "Piece added" ]
      , HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary")
          , HE.onClick (const (onUpdate AnimatePieceRemoved)) ]
          [ HH.text "Piece removed" ]
      ]

  tilingField =
    HH.div
      [ HP.class_ (ClassName "pv-toggle-row") ]
      [ HH.input
          [ HP.id "pv-tiling-toggle"
          , HP.type_ HP.InputCheckbox
          , HP.checked input.tiled
          , HE.onChecked (onUpdate <<< SetTiled)
          ]
      , HH.label
          [ HP.class_ (ClassName "pv-toggle-label")
          , HP.for "pv-tiling-toggle"
          ]
          [ HH.text "Show 3×3 tile grid" ]
      ]

  pieceSelect =
    HH.div
      [ HP.class_ (ClassName "pv-field") ]
      [ HH.select
          [ HP.id "pv-piece-select"
          , HE.onValueChange (onUpdate <<< SelectPiece <<< PieceId)
          ]
          (map option allPieces)
      ]
    where
      option p =
        HH.option
          [ HP.value (show (name p))
          , HP.selected (name p == name input.piece)
          ]
          [ HH.text (show (name p)) ]

  isInputDir :: CardinalDirection -> Boolean
  isInputDir dir = maybe false isInput (getPort input.piece dir)

  inputValueFor :: CardinalDirection -> Int
  inputValueFor dir = Map.lookup dir input.inputValues # fromMaybe 0

  inputsField =
    HH.div_
      [ HH.table
          [ HP.class_ (ClassName "pv-input-table") ]
          [ HH.tbody_
              [ HH.tr_
                  ( [ HH.th
                        [ HP.scope HP.ScopeRow
                        , HP.class_ (ClassName "pv-input-row-label")
                        ]
                        [ HH.text "Direction" ]
                    ]
                    <> map directionCell allDirections
                  )
              , HH.tr_
                  ( [ HH.th
                        [ HP.scope HP.ScopeRow
                        , HP.class_ (ClassName "pv-input-row-label")
                        ]
                        [ HH.text "Value" ]
                    ]
                    <> map valueCell allDirections
                  )
              ]
          ]
      , HH.datalist
          [ HP.id "pv-input-values" ]
          [ HH.option [ HP.value "0" ] []
          , HH.option [ HP.value "1" ] []
          ]
      ]
    where
    directionCell dir =
      let enabled = isInputDir dir
      in HH.td
        [ HP.class_ (ClassName $ "pv-input-dir" <> if enabled then "" else " pv-input-dir--disabled") ]
        [ HH.text (show dir) ]

    valueCell dir =
      let enabled = isInputDir dir
          value = inputValueFor dir
      in HH.td
        [ HP.class_ (ClassName $ if enabled then "pv-input-value" else "pv-input-dir--disabled") ]
        [ if enabled then
            HH.input
              [ HP.type_ HP.InputText
              , HP.list "pv-input-values"
              , HP.value (show value)
              , HE.onValueInput \s ->
                  case Int.fromString s of
                    Just n -> onUpdate (SetInputValue dir n)
                    Nothing -> onUpdate (SetInputValue dir value)
              ]
          else
            HH.span [ HP.class_ (ClassName "pv-input-disabled") ] [ HH.text "—" ]
        ]

  scaleField =
    HH.div
      [ HP.class_ (ClassName $ "pv-field" <> if input.tiled then " pv-field--disabled" else "") ]
      [ HH.input
          [ HP.type_ HP.InputRange
          , HP.min 0.25
          , HP.max 2.5
          , HP.step (HP.Step 0.05)
          , HP.value (Nf.toStringWith (Nf.fixed 2) input.scale)
          , HP.disabled input.tiled
          , HE.onValueInput \s ->
              if input.tiled then
                onUpdate (SetScale input.scale)
              else
                let n = fromMaybe input.scale (N.fromString s)
                in onUpdate (SetScale n)
          ]
      , HH.div
          [ HP.class_ (ClassName "pv-scale-readout") ]
          [ HH.text
              $ if input.tiled then
                  "Disabled while tiling"
                else
                  Nf.toStringWith (Nf.fixed 3) input.scale
          ]
      ]

  adaptingField =
    HH.div
      [ HP.class_ (ClassName "pv-field-stack") ]
      [ HH.div
          [ HP.class_ (ClassName "pv-field pv-field--inline") ]
          [ HH.label [ HP.for "pv-adapt-direction" ] [ HH.text "Direction" ]
          , HH.select
              [ HP.id "pv-adapt-direction"
              , HE.onValueChange (onUpdate <<< SetAdaptDirection <<< parseDirection)
              ]
              (map directionOption allDirections)
          ]
      , HH.div
          [ HP.class_ (ClassName "pv-field pv-field--inline") ]
          [ HH.label [ HP.for "pv-adapt-port-type" ] [ HH.text "Port type" ]
          , HH.select
              [ HP.id "pv-adapt-port-type"
              , HE.onValueChange (onUpdate <<< SetAdaptPortType <<< parsePortType)
              ]
              [ portTypeOption "Port In" (Just Input)
              , portTypeOption "Port Out" (Just Output)
              , portTypeOption "Nothing" Nothing
              ]
          ]
      , HH.p
          [ HP.class_ (ClassName $ "pv-adapt-preview" <> if adaptWillChange then " pv-adapt-preview--pending" else "") ]
          [ HH.text adaptSummary ]
      , HH.button
          [ HP.class_ (ClassName $ "pv-btn" <> if adaptWillChange then " pv-btn--warning" else "")
          , HP.disabled (not adaptWillChange)
          , HE.onClick (const (onUpdate ApplyAdapt))
          ]
          [ HH.text "Adapt piece" ]
      ]
    where
    adaptPreview = adapt input.adaptDirection input.adaptPortType input.piece
    adaptWillChange = adaptPreview /= input.piece

    adaptSummary =
      if adaptWillChange then
        "Will change \"" <> show (name input.piece) <> "\" into \"" <> show (name adaptPreview) <> "\" — click Adapt piece to apply."
      else
        "No effect: " <> show (name input.piece) <> " already matches this direction/port type."

    directionOption dir =
      HH.option
        [ HP.value (show dir)
        , HP.selected (dir == input.adaptDirection)
        ]
        [ HH.text (show dir) ]

    portTypeOption label maybePortType =
      HH.option
        [ HP.value (showPortType maybePortType)
        , HP.selected (maybePortType == input.adaptPortType)
        ]
        [ HH.text label ]

parseDirection :: String -> CardinalDirection
parseDirection = case _ of
  "Up" -> Up
  "Right" -> Right
  "Down" -> Down
  _ -> Left

parsePortType :: String -> Maybe PortType
parsePortType = case _ of
  "Port In" -> Just Input
  "Port Out" -> Just Output
  _ -> Nothing

showPortType :: Maybe PortType -> String
showPortType = case _ of
  Just Input -> "Port In"
  Just Output -> "Port Out"
  Nothing -> "Nothing"
