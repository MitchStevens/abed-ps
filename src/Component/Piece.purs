module Component.Piece where

import Prelude

import Control.Apply (lift2)
import Data.Enum (enumFromTo)
import Data.Foldable (for_, traverse_)
import Data.Int (round, toNumber)
import Data.Lens ((^.))
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isNothing, maybe)
import Data.Number (acos, atan2, pi, sqrt)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Location (CardinalDirection, Location, Rotation(..), rotation)
import Game.Location as Direction
import Game.Piece (class Piece, APiece(..), Port(..), getPort, name)
import Game.Piece as Port
import Halogen (ClassName(..), HalogenM, RefLabel(..), gets)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Partial.Unsafe (unsafeCrashWith)
import Web.DOM.Element (Element, clientHeight, clientLeft, clientTop, clientWidth, getBoundingClientRect)
import Web.Event.Event (EventType(..), type_)
import Web.Event.Internal.Types (Event)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.HTML.HTMLElement (HTMLElement, fromElement, offsetHeight, offsetLeft, offsetTop, offsetWidth, setDraggable, toElement)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY, screenX, screenY)
import Web.UIEvent.WheelEvent (WheelEvent)
import Web.UIEvent.WheelEvent as WheelEvent

type Input =
  { piece :: APiece
  , location :: Location
  }

type State = 
  { piece :: APiece
  , location :: Location
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number 
    }
  }

data Query a

data Action
  = Initialise
  | OnDrop Location DragEvent
  | OnDrag DragEvent
  | OnMouseDown MouseEvent
  | OnMouseMove MouseEvent
  | OnMouseUp Location MouseEvent

data Output
  = Rotated Location Rotation
  | Dropped Location

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState { piece, location } = { piece, location, isRotating: Nothing }

  --this :: forall slots. Unit -> HalogenM State Action slots Output m Element
  --this _ = fromMaybe (unsafeCrashWith "coldn't find self??") <$> H.getRef (RefLabel "piece")

  render state =
    HH.div
      [ HP.class_ (ClassName "piece-component")
      , HP.draggable isDraggable
      , HP.style ("transform: rotate(" <> show rotation <> "rad);")
      , HP.ref (RefLabel "piece")
      , HE.onDragEnd (OnDrop state.location)
      , HE.onDrag OnDrag
      , HE.onMouseDown OnMouseDown
      , HE.onMouseMove OnMouseMove
      , HE.onMouseUp (OnMouseUp state.location)
      ]
      ([ pieceTitle ] <> ports)
    where
      rotation = maybe 0.0 (_.currentRotation) state.isRotating
      isDraggable = isNothing state.isRotating

      ports = enumFromTo Direction.Up Direction.Left <#> \dir ->
        HH.div
          [ HP.class_ (ClassName (show dir))
          , HP.draggable false
          ]
          [ HH.img
            [ HP.src (portIconSrc dir)
            , HP.classes [ ClassName "port-icon"]
            , HP.draggable false
            ]
          ]
      
      portIconSrc dir = case getPort state.piece dir of
        Just (Port.Input _) -> "./input-port.svg"
        Just (Port.Output _ )-> "./output-port.svg"
        Nothing -> "./no-port.svg"
      
      pieceTitle = HH.div 
        [ HP.class_ (ClassName "piece-name") 
        , HP.draggable false ]
        [ HH.div_ [ HH.text ( name state.piece) ] ]

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
        Initialise -> do
          pure unit
        OnDrop loc event -> do
          H.raise (Dropped loc)
        OnDrag dragEvent -> pure unit
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
          H.getRef (RefLabel "piece") >>= traverse_ \e -> 
            H.gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
              let p1 = initialClickPosition
              let p2 = getPosition me
              c <- liftEffect $ elementCenterClient e

              let v1 = p1 - c
              let v2 = p2 - c
              let dot (Tuple x1 y1) (Tuple x2 y2) = x1*x2 + y1*y2
              let det (Tuple x1 y1) (Tuple x2 y2) = x1*y2 - x2*y1
              let angle = atan2 (v1 `det` v2) (v1 `dot` v2)

              H.modify_ (_ {
                isRotating = Just { initialClickPosition, currentRotation: angle }
              })
        OnMouseUp loc _ -> do
          H.gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
            let rot = rotation $ round (4.0 * currentRotation / (2.0 * pi))
            H.raise (Rotated loc rot)
          H.modify_ (_ { isRotating = Nothing })
    , handleQuery: case _ of
      _ -> pure Nothing
    , initialize: Just Initialise 
    , receive: const Nothing -- :: input -> Maybe action
    }
