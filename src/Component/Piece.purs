module Component.Piece
  ( PieceComponent
  , component
  , mkPieceComponent
  , module Component.Piece.Types
  )
  where

import Component.Piece.Types
import Data.Lens
import Prelude

import Component.DataAttribute as DA
import Component.Piece.Outline as Outline
import Component.Piece.Render (ChildSlots, outlineSegmentsFor, renderPiece)
import Control.Monad.State.Trans (gets, modify_)
import Data.Enum (enumFromTo, fromEnum)
import Data.Foldable (for_, traverse_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Group (ginverse)
import Data.Int (round, toNumber)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), isJust, isNothing, maybe)
import Data.Number (acos, atan2, pi, sqrt)
import Data.Tuple (Tuple(..))
import Debug (trace)
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (relative)
import Game.Piece (name)
import Game.PortInfo (clampPortInfo)
import Game.Rotation (rotation, toRadians)
import Halogen (AttrName(..), ClassName(..), Component, HalogenM, HalogenQ, RefLabel(..), ComponentHTML, defaultEval, getHTMLElementRef, getRef, gets, mkComponent, mkEval, raise)
import Halogen as H
import Halogen.Component (EvalSpec)
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.HTML.Properties.Extras as HP
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))
import Web.DOM.Element (Element, clientHeight, clientLeft, clientTop, clientWidth, getBoundingClientRect)
import Web.Event.Event (EventType(..), preventDefault, type_)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.HTML.HTMLElement (HTMLElement, fromElement, offsetHeight, offsetLeft, offsetTop, offsetWidth, setDraggable, toElement)
import Web.UIEvent.KeyboardEvent (key, shiftKey)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY, screenX, screenY)
import Web.UIEvent.MouseEvent as MouseEvent

--import Web.UIEvent.MouseEvent.Extras (MouseButton(..), button)

type PieceComponent m = Component Query Input Output m

type PieceComponentSpec m =
  { renderPiece :: State -> Array (ComponentHTML Action ChildSlots m)
  }

component :: forall m. MonadAff m => PieceComponent m
component = mkPieceComponent { renderPiece: \st -> [ renderPiece st ] }

mkPieceComponent :: forall m. MonadAff m => PieceComponentSpec m -> PieceComponent m
mkPieceComponent { renderPiece } = mkComponent { eval , initialState , render }
  where
  -- | Not memoized: `HH.memoized` here previously skipped re-rendering when
  -- | `piece`/`portStates` were unchanged (see the removed `renderEq`), on
  -- | the theory that the Outline child's own shape updates ride on an
  -- | explicit `H.tell` query (see `Receive` below) rather than on this
  -- | render being re-invoked. That part held, but a skipped/thunked render
  -- | doesn't just leave the DOM alone here -- it also detaches the
  -- | already-mounted Outline child slot nested inside it, so any `modify_`
  -- | that Halogen's memoization considered a no-op (e.g. clicking, which
  -- | sets `isRotating` to the value it already had) silently deleted the
  -- | piece's outline from the page.
  render = \state ->
    trace ("Piece.render: " <> show (name state.piece) <> " at " <> show state.location) \_ ->
    HH.div
      [ HP.classes [ ClassName "piece-component" ]
      , DA.attr DA.isDragging state.isDragging
      , DA.attr DA.rotation state.rotation
      , DA.attr DA.pieceId (name state.piece)
      , HP.draggable (isNothing state.isRotating)
      , HP.ref refPiece
      , HP.tabIndex 0

      , HE.onDragEnd (OnDrop state.location)
      , HE.onDrag OnDrag
      , HE.onMouseDown OnMouseDown
      , HE.onMouseMove OnMouseMove
      , HE.onMouseUp OnMouseUp
      , HE.onKeyDown OnKeyDown
      ]
      (renderPiece state)

  eval = mkEval defaultPieceEval

defaultPieceEval :: forall m. MonadAff m => EvalSpec State Query Action ChildSlots Input Output m
defaultPieceEval = defaultEval
    { finalize = Just Finalise
    , handleAction = case _ of
        Initialise -> pure unit
        Finalise -> pure unit
        Receive { piece, location, rotation, portStates } -> do
          oldPiece <- gets _.piece
          oldPortStates <- gets _.portStates
          let
            mOld = outlineSegmentsFor oldPiece oldPortStates
            mNew = outlineSegmentsFor piece portStates
          modify_ $ _
            { piece = piece
            , location = location
            , rotation = rotation
            , portStates = map clampPortInfo portStates }
          case mOld, mNew of
            Just oldSegs, Just newSegs | oldSegs /= newSegs ->
              void $ H.tell Outline.slot unit (Outline.Transition newSegs)
            _, _ -> pure unit

        OnDrop loc event -> do
          modify_ (_ { isDragging = false })
          raise (Dropped loc)
        OnDrag dragEvent -> do
          -- The native `drag` event fires continuously for the whole
          -- gesture, but `isDragging` only actually changes once (false ->
          -- true) -- only modify_ then, so the dozens of no-op events later
          -- in the same drag don't each force a full re-render.
          isDragging <- gets (_.isDragging)
          unless isDragging $ modify_ (_ { isDragging = true })
        OnMouseDown me ->
          getHTMLElementRef refPiece >>= traverse_ \he -> do
            r <- liftEffect $ mul 0.5 <$> clientWidth (toElement he)
            c <- liftEffect $ elementCenterClient (toElement he)
            let Tuple x y = sub (getPosition me) c
            if r*r > x*x + y*y
            -- if the mouse outside the inner circle of the piece...
              then do
                -- start dragging
                modify_ (_ { isRotating = Nothing })
              else do
                -- else start rotation
                liftEffect $ setDraggable false he
                rotation <- gets (_.rotation)
                modify_ (_
                  { isRotating = Just { initialClickPosition: getPosition me, currentRotation: toRadians rotation }
                  , isDragging = false
                })
        OnAuxClick _ -> do
          loc <- gets (_.location)
          H.raise (Dropped loc)

        OnMouseMove me -> do
          getRef (RefLabel "piece") >>= traverse_ \e -> do
            -- if the piece is being rotated...
            gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
              rotation <- gets (_.rotation)
              let p1 = initialClickPosition
              -- get the current mouse position
              let p2 = getPosition me
              c <- liftEffect $ elementCenterClient e

              -- find the angle between the initialClick and the current mouse position...
              let angle = toRadians rotation + angleBetween (p1 - c) (p2 - c)

              -- rotate the piece by this angle
              modify_ (_ {
                isRotating = Just { initialClickPosition, currentRotation: angle }
              })
        OnMouseUp me -> do
          gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
            let closestSnapPoint = rotation $ round (4.0 * currentRotation / (2.0 * pi))
            rotation <- gets (_.rotation)
            location <- gets (_.location)
            modify_ (_ { isRotating = Nothing })
            raise (Rotated location (closestSnapPoint <> ginverse rotation))
        OnKeyDown ke -> do
          when (key ke == "r") do
            loc <- gets (_.location)
            raise (Rotated loc (rotation 1))
          when (key ke == "R") do
            loc <- gets (_.location)
            raise (Rotated loc (rotation 3))

        PortOnMouseEnter dir -> do
          portStates <- gets (_.portStates)
          loc <- gets (_.location)
          raise $ NewMultimeterFocus do
            let relativeEdge = relative loc dir
            info <- M.lookup dir portStates
            pure { relativeEdge, info }
        PortOnMouseLeave -> do
          raise (NewMultimeterFocus Nothing)
    , initialize = Just Initialise
    , receive = Just <<< Receive
    }

angleBetween :: Tuple Number Number -> Tuple Number Number -> Number
angleBetween  v1 v2 = atan2 (v1 `det` v2) (v1 `dot` v2)
  where
    dot (Tuple x1 y1) (Tuple x2 y2) = x1*x2 + y1*y2
    det (Tuple x1 y1) (Tuple x2 y2) = x1*y2 - x2*y1

getPosition :: MouseEvent -> Tuple Number Number 
getPosition e = Tuple (toNumber (clientX e)) (toNumber (clientY e))

elementCenterClient :: Element -> Effect (Tuple Number Number)
elementCenterClient e = do
  bb <- getBoundingClientRect e
  let cx = (bb.right + bb.left) / 2.0
  let cy = (bb.bottom + bb.top) / 2.0
  pure $ Tuple cx cy

refPiece :: RefLabel
refPiece = RefLabel "piece"