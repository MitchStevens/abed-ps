module PieceViewer.Main where

import Prelude

import Capability.Animate (headShake)
import Component.Piece.Types as Piece
import Component.Rendering.Piece (renderPiece)
import Control.Monad.Error.Class (throwError)
import Data.Array as A
import Data.Enum (fromEnum)
import Data.Int (round)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Number (fromString) as N
import Data.Number.Format as Nf
import Effect (Effect)
import Effect.Aff (Aff, Milliseconds(..), delay)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Effect.Exception (error)
import Game.Location (location)
import Game.Piece (Piece, allPieces, defaultPortInfo, name, superPiece)
import Game.Rotation (Rotation, rotation, toDegrees)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, defaultEval, mkComponent, mkEval, modify_)
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HP
import Halogen.VDom.Driver (runUI)
import Partial.Unsafe (unsafeCrashWith)
import Web.DOM.DOMTokenList as DOMTokenList
import Web.DOM.Element (classList)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.HTMLElement (HTMLElement)
import Web.HTML.Window as Window

main :: Effect Unit
main =
  HA.runHalogenAff do
    HA.awaitLoad
    root <- rootElement
    void $ runUI component unit root

rootElement :: Aff HTMLElement
rootElement =
  HA.selectElement (QuerySelector "#piece-viewer-root") >>=
    maybe (throwError (error "Could not find #piece-viewer-root")) pure

-- | Index of `superPiece` in `allPieces`, or 0 if not found.
defaultPieceIx :: Int
defaultPieceIx =
  fromMaybe 0 (A.findIndex (\p -> name p == name superPiece) allPieces)

type State =
  { pieceIx :: Int
  , scale :: Number
  , rotation :: Rotation
  , tiled :: Boolean
  }

data Action
  = NoOp
  | SelectPiece Int
  | SetScale String
  | RotateCW
  | RotateCCW
  | SetTiled Boolean
  | AnimateHeadShake
  | AnimateSpin
  | AnimatePieceAdded
  | AnimatePieceRemoved

initialState :: State
initialState =
  { pieceIx: defaultPieceIx
  , scale: 1.0
  , rotation: rotation 0
  , tiled: false
  }

component :: forall query input. Component query input Void Aff
component =
  mkComponent
    { initialState: const initialState
    , render
    , eval: mkEval $ defaultEval { handleAction = handleAction }
    }

currentPiece :: State -> Piece
currentPiece s = case allPieces A.!! s.pieceIx of
  Just p -> p
  Nothing -> unsafeCrashWith "piece-viewer: piece index out of range"

pieceStateFor :: Piece -> Rotation -> Piece.State
pieceStateFor piece rot =
  Piece.initialState
    { piece
    , location: location 0 0
    , rotation: rot
    , portStates: defaultPortInfo piece
    }

renderPieceHtml :: forall slots m. Piece -> Rotation -> ComponentHTML Action slots m
renderPieceHtml piece rot =
  mapActionOverHTML (const NoOp) (renderPiece (pieceStateFor piece rot))

-- | Add a CSS animation class to the first `.pv-piece-stage` in the document, wait, then remove it.
flashCssClassOnFirstPieceStage :: String -> Milliseconds -> Aff Unit
flashCssClassOnFirstPieceStage cls (Milliseconds durationMs) = do
  htmlDocument <- liftEffect $ window >>= Window.document
  maybeElement <- liftEffect $ querySelector (QuerySelector ".pv-piece-stage") (toParentNode htmlDocument)
  for_ maybeElement \element -> do
    tokenList <- liftEffect $ classList element
    liftEffect $ DOMTokenList.add tokenList cls
    delay (Milliseconds durationMs)
    tokenList' <- liftEffect $ classList element
    liftEffect $ DOMTokenList.remove tokenList' cls

handleAction :: Action -> HalogenM State Action () Void Aff Unit
handleAction = case _ of
  NoOp -> pure unit
  SelectPiece ix ->
    when (ix >= 0 && ix < A.length allPieces) do
      modify_ (_ { pieceIx = ix })
  SetScale s ->
    case N.fromString s of
      Just n -> modify_ (_ { scale = clamp 0.25 2.5 n })
      Nothing -> pure unit
  RotateCW ->
    modify_ \st -> st { rotation = rotation (fromEnum st.rotation + 1) }
  RotateCCW ->
    modify_ \st -> st { rotation = rotation (fromEnum st.rotation - 1) }
  SetTiled tiled ->
    modify_ (_ { tiled = tiled })
  AnimateHeadShake ->
    void $ liftAff $ headShake (QuerySelector ".pv-piece-stage")
  AnimateSpin ->
    void $ liftAff $ flashCssClassOnFirstPieceStage "piece-viewer-spin-once" (Milliseconds 800.0)
  AnimatePieceAdded ->
    void $ liftAff $ flashCssClassOnFirstPieceStage "pv-animate-piece-added" (Milliseconds 600.0)
  AnimatePieceRemoved ->
    void $ liftAff $ flashCssClassOnFirstPieceStage "pv-animate-piece-removed" (Milliseconds 600.0)

render :: forall m. State -> ComponentHTML Action () m
render st =
  HH.div
    [ HP.class_ (ClassName "pv-shell") ]
    [ HH.div
        [ HP.class_ (ClassName "pv-pane") ]
        [ HH.h2 [ HP.class_ (ClassName "pv-pane-title") ] [ HH.text "Preview" ]
        , HH.p
            [ HP.class_ (ClassName "pv-current-piece") ]
            [ HH.text (show (name piece)) ]
        , HH.div
            [ HP.class_ (ClassName "pv-viewport") ]
            [ if st.tiled then tileGrid else singleView ]
        ]
    , HH.div
        [ HP.class_ (ClassName "pv-pane") ]
        [ HH.h2 [ HP.class_ (ClassName "pv-pane-title") ] [ HH.text "Controls" ]
        , HH.div
            [ HP.class_ (ClassName "pv-controls") ]
            [ controlSection "Piece" pieceSelect
            , controlSection "Scale" scaleField
            , controlSection "Rotation" rotationField
            , controlSection "Animations" animationsField
            , controlSection "Tiling" tilingField
            ]
        ]
    ]
  where
  piece = currentPiece st

  controlSection title body =
    HH.section
      [ HP.class_ (ClassName "pv-control-section") ]
      [ HH.h3 [ HP.class_ (ClassName "pv-section-title") ] [ HH.text title ]
      , HH.div [ HP.class_ (ClassName "pv-section-body") ] [ body ]
      ]

  rotationDegreesLabel :: String
  rotationDegreesLabel =
    show (round (toDegrees st.rotation)) <> "°"

  rotationField =
    HH.div_
      [ HH.p
          [ HP.class_ (ClassName "pv-rotation-readout") ]
          [ HH.text ("Current rotation: " <> rotationDegreesLabel) ]
      , HH.div
          [ HP.class_ (ClassName "pv-row") ]
          [ HH.button
              [ HP.class_ (ClassName "pv-btn"), HE.onClick (const RotateCW) ]
              [ HH.text "Rotate CW" ]
          , HH.button
              [ HP.class_ (ClassName "pv-btn"), HE.onClick (const RotateCCW) ]
              [ HH.text "Rotate CCW" ]
          ]
      ]

  animationsField =
    HH.div
      [ HP.class_ (ClassName "pv-row") ]
      [ HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary"), HE.onClick (const AnimateHeadShake) ]
          [ HH.text "Head shake" ]
      , HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary"), HE.onClick (const AnimateSpin) ]
          [ HH.text "Spin once" ]
      , HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary"), HE.onClick (const AnimatePieceAdded) ]
          [ HH.text "Piece added" ]
      , HH.button
          [ HP.class_ (ClassName "pv-btn pv-btn--primary"), HE.onClick (const AnimatePieceRemoved) ]
          [ HH.text "Piece removed" ]
      ]

  tilingField =
    HH.div
      [ HP.class_ (ClassName "pv-toggle-row") ]
      [ HH.input
          [ HP.id "pv-tiling-toggle"
          , HP.type_ HP.InputCheckbox
          , HP.checked st.tiled
          , HE.onChecked SetTiled
          ]
      , HH.label
          [ HP.class_ (ClassName "pv-toggle-label")
          , HP.for "pv-tiling-toggle"
          ]
          [ HH.text "Show 3×3 tile grid" ]
      ]

  singleView =
    HH.div
      [ HP.class_ (ClassName "pv-scale-wrap")
      , HP.style $ "transform: scale(" <> Nf.toStringWith (Nf.fixed 3) st.scale <> ");"
      ]
      [ HH.div
          [ HP.class_ (ClassName "pv-piece-stage") ]
          [ renderPieceHtml piece st.rotation ]
      ]

  tileGrid =
    HH.div
      [ HP.class_ (ClassName "pv-tile-grid") ]
      ( A.replicate 9 unit <#> \_ ->
          HH.div
            [ HP.class_ (ClassName "pv-tile-cell") ]
            [ HH.div
                [ HP.class_ (ClassName "pv-scale-wrap pv-scale-wrap--tile")
                , HP.style "transform: scale(0.31);"
                ]
                [ HH.div
                    [ HP.class_ (ClassName "pv-piece-stage") ]
                    [ renderPieceHtml piece st.rotation ]
                ]
            ]
      )

  pieceSelect =
    HH.div
      [ HP.class_ (ClassName "pv-field") ]
      [ HH.select
          [ HP.id "pv-piece-select"
          , HE.onSelectedIndexChange SelectPiece
          ]
          (A.mapWithIndex option allPieces)
      ]
    where
    option i p =
      HH.option
        [ HP.selected (i == st.pieceIx) ]
        [ HH.text (show (name p)) ]

  scaleField =
    HH.div
      [ HP.class_ (ClassName "pv-field") ]
      [ HH.input
          [ HP.type_ HP.InputRange
          , HP.min 0.25
          , HP.max 2.5
          , HP.step (HP.Step 0.05)
          , HP.value (Nf.toStringWith (Nf.fixed 2) st.scale)
          , HE.onValueInput SetScale
          ]
      , HH.div
          [ HP.class_ (ClassName "pv-scale-readout") ]
          [ HH.text (Nf.toStringWith (Nf.fixed 3) st.scale) ]
      ]
