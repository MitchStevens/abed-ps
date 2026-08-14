module PieceViewer.Main where

import Prelude

import Capability.Animate (headShake)
import Component.Piece as Piece
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
import Game.Piece (name)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, defaultEval, gets, mkComponent, mkEval, modify_)
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
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

type ChildSlots = ( piece :: H.Slot Piece.Query Piece.Output Int )

data Action
  = NoOp
  | HandleUpdate Update.Update
  | HandlePieceOutput Piece.Output

component :: forall query input. Component query input Void Aff
component =
  mkComponent
    { initialState: const Types.initialState
    , render
    , eval: mkEval $ defaultEval { handleAction = handleAction }
    }

sidebarInput :: State -> Sidebar.Input
sidebarInput = identity

pieceInputFor :: Types.State -> Piece.Input
pieceInputFor st =
  { piece: st.piece
  , location: location 0 0
  , rotation: st.rotation
  , portStates: Types.portStatesForPiece st.piece st.inputValues
  }

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

runAnimation :: Types.Animation -> HalogenM State Action ChildSlots Void Aff Unit
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

handleAction :: Action -> HalogenM State Action ChildSlots Void Aff Unit
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
  -- | The Piece component diffs and animates its own outline transition
  -- | internally (on `Receive`), so only the resulting rotation needs to
  -- | flow back up into the shared viewer state here.
  HandlePieceOutput output -> case output of
    Piece.Rotated _ rot ->
      modify_ (_ { rotation = rot })
    Piece.Dropped _ ->
      pure unit
    Piece.RemoveThis _ ->
      pure unit
    Piece.NewMultimeterFocus _ ->
      pure unit

render :: State -> ComponentHTML Action ChildSlots Aff
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

  renderPieceSlot :: Int -> ComponentHTML Action ChildSlots Aff
  renderPieceSlot key =
    HH.slot Piece.slot key Piece.component (pieceInputFor st) HandlePieceOutput

  -- | Keyed apart from `tileGrid`'s `0 .. 8`: `singleView` and `tileGrid` are
  -- | mutually exclusive, but Halogen tracks "piece" slot children by key
  -- | across the whole render tree, not by position -- reusing key `0` here
  -- | let the toggle hand this instance's mount off to the tile-0 slot
  -- | instead of remounting it, and its memoized render kept the stale
  -- | (pre-tiling) HTML, silently dropping the outline.
  singleView =
    HH.div
      [ HP.class_ (ClassName "pv-scale-wrap")
      , HP.style $ "transform: scale(" <> Nf.toStringWith (Nf.fixed 3) st.scale <> ");"
      ]
      [ HH.div
          [ HP.class_ (ClassName "pv-piece-stage") ]
          [ renderPieceSlot (-1) ]
      ]

  tileGrid =
    HH.div
      [ HP.class_ (ClassName "pv-tile-grid") ]
      ( A.range 0 8 <#> \i ->
          HH.div
            [ HP.class_ (ClassName "pv-tile-cell") ]
            [ HH.div
                [ HP.class_ (ClassName "pv-scale-wrap pv-scale-wrap--tile")
                ]
                [ HH.div
                    [ HP.class_ (ClassName "pv-piece-stage") ]
                    [ renderPieceSlot i ]
                ]
            ]
      )
