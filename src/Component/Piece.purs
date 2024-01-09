module Component.Piece
  ( component
  , module Component.Piece.Types
  )
  where

import Component.Piece.Types
import Data.Lens
import Prelude

import Component.Rendering.Piece (renderPiece)
import Data.Array as A
import Data.Enum (enumFromTo, fromEnum)
import Data.Foldable (for_, traverse_)
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
import Game.Direction as Direction
import Game.Piece (PieceId(..), getPort, name)
import Game.Piece.Port (Port)
import Game.Piece.Port as Port
import Game.Rotation (rotation)
import Halogen (AttrName(..), ClassName(..), HalogenM, RefLabel(..), gets)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))
import Web.DOM.Element (Element, clientHeight, clientLeft, clientTop, clientWidth, getBoundingClientRect)
import Web.Event.Event (EventType(..), type_)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.HTML.HTMLElement (HTMLElement, fromElement, offsetHeight, offsetLeft, offsetTop, offsetWidth, setDraggable, toElement)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY, screenX, screenY)

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  render state = trace ("piece componetn state:" <> show state) \_ ->
    HH.div
      [ HP.classes
        [ ClassName "piece-component" ]
      , HP.draggable isDraggable
      , HP.style ("transform: rotate(" <> show currentRotation <> "rad);")
      , HP.ref (RefLabel "piece")

      , HE.onDragEnd (OnDrop state.location)
      , HE.onDrag OnDrag
      , HE.onMouseDown OnMouseDown
      , HE.onMouseMove OnMouseMove
      , HE.onMouseUp (OnMouseUp state.location)
      ]
      [ renderPiece state ]
    where
      isDraggable = isNothing state.isRotating
      currentRotation = maybe 0.0 (_.currentRotation) state.isRotating

  getPosition :: MouseEvent -> Tuple Number Number 
  getPosition e = Tuple (toNumber (clientX e)) (toNumber (clientY e))

  elementCenterClient :: Element -> Effect (Tuple Number Number)
  elementCenterClient e = do
    bb <- getBoundingClientRect e
    let cx = (bb.right + bb.left) / 2.0
    let cy = (bb.bottom + bb.top) / 2.0
    pure $ Tuple cx cy

  eval :: forall slots. H.HalogenQ Query Action Input ~> H.HalogenM State Action slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
      -- not used, might use later
        Initialise { piece, location } -> pure unit
        OnDrop loc event -> do
          H.raise (Dropped loc)
        OnDrag dragEvent -> 
          pure unit
        OnMouseDown me ->
          H.getHTMLElementRef (RefLabel "piece") >>= traverse_ \he -> do
            r <- liftEffect $ mul 0.5 <$> clientWidth (toElement he)
            c <- liftEffect $ elementCenterClient (toElement he)
            let Tuple x y = sub (getPosition me) c
            if r*r > x*x + y*y
              then do
                H.modify_ (_ { isRotating = Nothing })
              else do
                liftEffect $ setDraggable false he
                H.modify_ (_ {
                  isRotating = Just { initialClickPosition: getPosition me, currentRotation: 0.0 }
                })
        OnMouseMove me -> do --pure unit --do
          H.getRef (RefLabel "piece") >>= traverse_ \e -> do
            -- if the piece is being rotated...
            H.gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
              let p1 = initialClickPosition
              -- get the current mouse position
              let p2 = getPosition me
              c <- liftEffect $ elementCenterClient e

              -- find the angle between the initialClick and the current mouse position...
              let angle = angleBetween (p1 - c) (p2 - c)

              -- rotate the piece by this angle
              H.modify_ (_ {
                isRotating = Just { initialClickPosition, currentRotation: angle }
              })
        OnMouseUp loc _ -> do
          H.gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
            let rot = rotation $ round (4.0 * currentRotation / (2.0 * pi))
            H.raise (Rotated loc rot)
          H.modify_ (_ { isRotating = Nothing })
        PortOnMouseEnter dir -> do
          portStates <- H.gets (_.portStates)
          loc <- H.gets (_.location)
          pure unit
          H.raise $ NewMultimeterFocus do
            let relativeEdge = relative loc dir
            info <- M.lookup dir portStates
            pure { relativeEdge, info }
        PortOnMouseLeave -> do
          H.raise (NewMultimeterFocus Nothing)

    , handleQuery: case _ of
        SetPortStates portStates -> do
          H.modify_ $ _ { portStates = portStates }
          pure Nothing
        SetPiece piece -> do
          H.modify_ (_ {piece = piece})
          pure Nothing
    , initialize: Nothing
    , receive: \_ -> Nothing --Just <<< Initialise -- :: input -> Maybe action
    }

angleBetween :: Tuple Number Number -> Tuple Number Number -> Number
angleBetween  v1 v2 = atan2 (v1 `det` v2) (v1 `dot` v2)
  where
    dot (Tuple x1 y1) (Tuple x2 y2) = x1*x2 + y1*y2
    det (Tuple x1 y1) (Tuple x2 y2) = x1*y2 - x2*y1