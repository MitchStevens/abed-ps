module PieceViewer.Main where

import Prelude

import Capability.Animate (headShake)
import Component.Piece.Types as Piece
import Component.Rendering.Piece (renderPiece)
import Control.Monad.Error.Class (throwError)
import Data.Array as A
import Data.Foldable (for_)
import Data.Maybe (maybe)
import Data.Number.Format as Nf
import Effect (Effect)
import Effect.Aff (Aff, Milliseconds(..), delay)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log, logShow)
import Effect.Exception (error)
import Game.Location (location)
import Game.Piece (Piece, name)
import Game.Rotation (Rotation)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, defaultEval, gets, mkComponent, mkEval, modify_)
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HP
import Halogen.VDom.Driver (runUI)
import PieceViewer.Sidebar as Sidebar
import PieceViewer.Types as Types
import PieceViewer.Update as Update
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

type State = Types.State

data Action
  = NoOp
  | HandleUpdate Update.Update

component :: forall query input. Component query input Void Aff
component =
  mkComponent
    { initialState: const Types.initialState
    , render
    , eval: mkEval $ defaultEval { handleAction = handleAction }
    }

sidebarInput :: State -> Sidebar.Input
sidebarInput = identity

pieceStateFor :: Piece -> Rotation -> Types.State -> Piece.State
pieceStateFor piece rot st =
  Piece.initialState
    { piece
    , location: location 0 0
    , rotation: rot
    , portStates: Types.portStatesForPiece piece st.inputValues
    }

renderPieceHtml :: forall slots m. Types.State -> ComponentHTML Action slots m
renderPieceHtml st =
  mapActionOverHTML (const NoOp) (renderPiece (pieceStateFor st.piece st.rotation st))

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

runAnimation :: Types.Animation -> HalogenM State Action () Void Aff Unit
runAnimation = case _ of
  Types.HeadShake ->
    void $ liftAff $ headShake (QuerySelector ".pv-piece-stage")
  Types.Spin ->
    void $ liftAff $ flashCssClassOnFirstPieceStage "piece-viewer-spin-once" (Milliseconds 800.0)
  Types.PieceAdded ->
    void $ liftAff $ flashCssClassOnFirstPieceStage "pv-animate-piece-added" (Milliseconds 600.0)
  Types.PieceRemoved ->
    void $ liftAff $ flashCssClassOnFirstPieceStage "pv-animate-piece-removed" (Milliseconds 600.0)

logStateSnapshot :: State -> Effect Unit
logStateSnapshot st = do
  log "piece-viewer state changed"
  logShow
    { pieceName: show (name st.piece)
    , piece: st.piece
    , scale: st.scale
    , rotation: st.rotation
    , tiled: st.tiled
    , adaptDirection: st.adaptDirection
    , adaptPortType: st.adaptPortType
    , inputValues: st.inputValues
    , portStates: Types.portStatesForPiece st.piece st.inputValues
    }

handleAction :: Action -> HalogenM State Action () Void Aff Unit
handleAction = case _ of
  NoOp ->
    pure unit
  HandleUpdate update -> do
    modify_ (Update.applyUpdate update)
    st <- gets identity
    liftEffect $ logStateSnapshot st
    for_ st.animation \anim -> do
      runAnimation anim
      modify_ Types.clearAnimation

render :: State -> ComponentHTML Action () Aff
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
    , Sidebar.render (sidebarInput st) HandleUpdate
    ]
  where
  piece = Types.currentPiece st

  singleView =
    HH.div
      [ HP.class_ (ClassName "pv-scale-wrap")
      , HP.style $ "transform: scale(" <> Nf.toStringWith (Nf.fixed 3) st.scale <> ");"
      ]
      [ HH.div
          [ HP.class_ (ClassName "pv-piece-stage") ]
          [ renderPieceHtml st ]
      ]

  tileGrid =
    HH.div
      [ HP.class_ (ClassName "pv-tile-grid") ]
      ( A.replicate 9 unit <#> \_ ->
          HH.div
            [ HP.class_ (ClassName "pv-tile-cell") ]
            [ HH.div
                [ HP.class_ (ClassName "pv-scale-wrap pv-scale-wrap--tile")
                ]
                [ HH.div
                    [ HP.class_ (ClassName "pv-piece-stage") ]
                    [ renderPieceHtml st ]
                ]
            ]
      )
