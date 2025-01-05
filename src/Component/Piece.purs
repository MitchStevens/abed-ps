module Component.Piece
  ( component
  , module Component.Piece.Types
  )
  where

import Component.Piece.Types
import Data.Lens
import Prelude

import Component.DataAttribute as DA
import Component.Rendering.Piece (renderPiece)
import Control.Monad.State.Trans (gets, modify_)
import Data.Array as A
import Data.Enum (enumFromTo, fromEnum)
import Data.Foldable (for_, traverse_)
import Data.Group (ginverse)
import Data.Int (round, toNumber)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Number (acos, atan2, pi, sqrt)
import Data.Tuple (Tuple(..))
import Debug (trace)
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (relative)
import Game.Piece (name)
import Game.Rotation (rotation, toRadians)
import Halogen (AttrName(..), ClassName(..), Component, HalogenM, HalogenQ, RefLabel(..), getHTMLElementRef, getRef, gets, mkComponent, mkEval, raise)
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Properties.Extras as HP
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))
import Web.DOM.Element (Element, clientHeight, clientLeft, clientTop, clientWidth, getBoundingClientRect)
import Web.Event.Event (EventType(..), type_)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.HTML.HTMLElement (HTMLElement, fromElement, offsetHeight, offsetLeft, offsetTop, offsetWidth, setDraggable, toElement)
import Web.UIEvent.KeyboardEvent (key, shiftKey)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY, screenX, screenY)

component :: forall m. MonadEffect m => Component Query Input Output m
component = mkComponent { eval , initialState , render }
  where
  render = HH.lazy $ \state ->
    HH.div
      [ HP.classes [ ClassName "piece-component" ]
      , DA.attr DA.isDragging state.isDragging
      , DA.attr DA.rotation state.rotation
      , DA.attr DA.pieceId (name state.piece)
      , HP.draggable (isNothing state.isRotating)
      , HP.ref (RefLabel "piece")
      , HP.contentEditable true

      , HE.onDragEnd (OnDrop state.location)
      , HE.onDrag OnDrag
      , HE.onMouseDown OnMouseDown
      , HE.onMouseMove OnMouseMove
      , HE.onMouseUp (OnMouseUp state.location)
      , HE.onKeyDown OnKeyDown
      ]
      [ renderPiece state ]

  getPosition :: MouseEvent -> Tuple Number Number 
  getPosition e = Tuple (toNumber (clientX e)) (toNumber (clientY e))

  elementCenterClient :: Element -> Effect (Tuple Number Number)
  elementCenterClient e = do
    bb <- getBoundingClientRect e
    let cx = (bb.right + bb.left) / 2.0
    let cy = (bb.bottom + bb.top) / 2.0
    pure $ Tuple cx cy

  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = mkEval
    { finalize: Nothing
    , handleAction: case _ of
      -- not used, might use later
        Initialise { piece, location } -> pure unit
        OnDrop loc event -> do
          modify_ (_ { isDragging = false })
          raise (Dropped loc)
        OnDrag dragEvent -> do
          modify_ (_ { isDragging = true })
          pure unit
        OnMouseDown me ->
          getHTMLElementRef (RefLabel "piece") >>= traverse_ \he -> do
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
        OnMouseMove me -> do --pure unit --do
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
        OnMouseUp loc _ -> do
          gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
            let closestSnapPoint = rotation $ round (4.0 * currentRotation / (2.0 * pi))
            rotation <- gets (_.rotation)
            modify_ (_ { isRotating = Nothing })
            raise (Rotated loc (closestSnapPoint <> ginverse rotation))
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

    , handleQuery: case _ of
        SetPortStates portStates -> do
          modify_ $ _ { portStates = portStates }
          pure Nothing
        SetPiece piece -> do
          modify_ (_ {piece = piece})
          pure Nothing
        SetRotation rot -> do
          modify_ (_ { rotation = rot })
          pure Nothing
    , initialize: Nothing
    , receive: \_ -> Nothing --Just <<< Initialise -- :: input -> Maybe action
    }

angleBetween :: Tuple Number Number -> Tuple Number Number -> Number
angleBetween  v1 v2 = atan2 (v1 `det` v2) (v1 `dot` v2)
  where
    dot (Tuple x1 y1) (Tuple x2 y2) = x1*x2 + y1*y2
    det (Tuple x1 y1) (Tuple x2 y2) = x1*y2 - x2*y1