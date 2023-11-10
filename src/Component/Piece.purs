module Component.Piece where

import Data.Lens
import Prelude

import Component.DataAttribute as DataAttr
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
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, Location, Rotation(..), allDirections, locationId, rotateDirection, rotation)
import Game.Location as Direction
import Game.Piece (class Piece, APiece(..), PieceId(..), getPort, name, ports)
import Game.Piece.Port (Port, PortInfo)
import Game.Piece.Port as Port
import Halogen (AttrName(..), ClassName(..), HalogenM, RefLabel(..), gets)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML)
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

type Input =
  { piece :: APiece
  , location :: Location
  }

type State = 
  { piece :: APiece
  , location :: Location
  , rotation  :: Rotation
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number 
    }
  , portStates :: Map CardinalDirection PortInfo
  }

data Query a
  = PaintSignals (Map CardinalDirection Signal)
  | PaintConnected CardinalDirection Boolean
  | PaintPort CardinalDirection PortInfo

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

_portStates = prop (Proxy :: Proxy "portStates")
_signal = prop (Proxy :: Proxy "signal")
_connected = prop (Proxy :: Proxy "connected")

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState { piece, location } =
    { piece
    , location
    , rotation: rotation 0
    , isRotating: Nothing
    , portStates: map (\p -> {connected: false, port: p, signal: Signal 0}) (ports piece) }

  render state =
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
      ] $ pure $
        SE.svg
          [  SA.viewBox 0.0 0.0 100.0 100.0 ]  $
          allPorts <> [ center ]


    where
      isDraggable = isNothing state.isRotating
      currentRotation = maybe 0.0 (_.currentRotation) state.isRotating

      allPorts = do
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
          [ pieceCenter (name state.piece) ]
        ]

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
            -- if the piece is being rotated...
            H.gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
              let p1 = initialClickPosition
              -- get the current mouse position
              let p2 = getPosition me
              c <- liftEffect $ elementCenterClient e

              let v1 = p1 - c
              let v2 = p2 - c
              let dot (Tuple x1 y1) (Tuple x2 y2) = x1*x2 + y1*y2
              let det (Tuple x1 y1) (Tuple x2 y2) = x1*y2 - x2*y1
              -- find the angle between the initialClick and the current mouse position...
              let angle = atan2 (v1 `det` v2) (v1 `dot` v2)

              -- rotate the piece by this angle
              H.modify_ (_ {
                isRotating = Just { initialClickPosition, currentRotation: angle }
              })
        OnMouseUp loc _ -> do
          H.gets (_.isRotating) >>= traverse_ \{ initialClickPosition, currentRotation } -> do
            let rot = rotation $ round (4.0 * currentRotation / (2.0 * pi))
            H.raise (Rotated loc rot)
          H.modify_ (_ { isRotating = Nothing })
    , handleQuery: case _ of
        PaintSignals signals -> do
          for_ (M.toUnfoldable signals :: Array (Tuple CardinalDirection Signal)) \(Tuple dir signal) ->
            _portStates <<< ix dir <<< _signal .= signal
          pure Nothing
        PaintConnected dir connected -> do
          _portStates <<< ix dir <<< _connected .= connected
          pure Nothing
        PaintPort dir portInfo -> do
          piece <- gets (_.piece)
          when (isJust $ getPort piece dir) do
            _portStates <<< at dir .= Just portInfo
          pure Nothing
    , initialize: Just Initialise 
    , receive: const Nothing -- :: input -> Maybe action
    }


electricBlue = RGB 62 207 207
gunMetalGrey = RGB 204 226 237

renderPort :: forall p i. CardinalDirection -> PortInfo -> HTML p i
renderPort direction {connected, port, signal} = SE.g []
  [ SE.defs [] gradients
  , portShape
  ]
  where
    portShape = case port of
      (Port.Input n) ->
        SE.polyline
          [ SA.points portShapePoints
          , SA.classes [ClassName "port-in", ClassName "port"]
          , DataAttr.attr DataAttr.connected connected
          , SA.fillGradient (if signal /= Signal 0 then "#port-in-gradient" else "#port-in-gradient-off")
          ]
      (Port.Output n) ->
        SE.polyline
          [ SA.points portShapePoints
          , DataAttr.attr DataAttr.connected connected
          , SA.classes [ClassName "port-out", ClassName "port"]
          , SA.fillGradient (if signal /= Signal 0 then "#port-out-gradient" else "#port-out-gradient-off")
          ]

    portShapePoints = case port of
      (Port.Input n) ->
        [ Tuple 10.0  0.0
        , Tuple 10.0  12.0
        , Tuple 0.0   12.0
        , Tuple 25.0  25.0
        , Tuple 50.0  12.0
        , Tuple 40.0  12.0
        , Tuple 40.0  0.0
        ]
      (Port.Output n) ->
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

pieceCenter :: forall p i. PieceId -> HTML p i
pieceCenter (PieceId id) = SE.image
  [ SA.href ("./images/" <> id <> ".png") 
  , SA.width 40.0
  , SA.height 40.0 
  ]