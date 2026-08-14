-- | Owns every drag/rotate gesture concern that used to live in
-- | `Component.Piece`: hit-testing whether a mousedown starts a drag or a
-- | rotate, tracking the in-progress gesture, and applying the resulting
-- | rotation as a CSS transform on its own wrapping element. The actual
-- | piece drawing is delegated to a nested `Component.Piece.Visual` slot, so
-- | the high-frequency updates here (every mousemove of a rotate drag) never
-- | touch that child's own render cycle.
-- |
-- | Not wired up anywhere yet -- `Board`/etc. still talk to the old
-- | `Component.Piece`.
module Component.Piece.Movement
  ( Action(..)
  , ChildSlots
  , Input
  , Output(..)
  , Query
  , State
  , component
  , slot
  )
  where

import Prelude

import Component.DataAttribute as DA
import Component.Piece.Visual as Visual
import Data.Foldable (traverse_)
import Data.Int (round, toNumber)
import Data.Map (Map)
import Data.Maybe (Maybe(..), isNothing)
import Data.Number (pi, atan2)
import Data.Group (ginverse)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (liftEffect)
import Game.Direction (CardinalDirection)
import Game.Location (Location)
import Game.Piece (Piece, name)
import Game.PortInfo (PortInfo, clampPortInfo)
import Game.Rotation (Rotation, rotation, toDegrees, toRadians)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, RefLabel(..), defaultEval, getHTMLElementRef, getRef, gets, mkComponent, mkEval, modify_, raise)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.DOM.Element (Element, clientWidth, getBoundingClientRect)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.HTML.HTMLElement (setDraggable, toElement)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, key)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY)

type ChildSlots = ( pieceVisual :: H.Slot Visual.Query Visual.Output Unit )

type Input =
  { piece :: Piece
  , location :: Location
  , rotation :: Rotation
  , portStates :: Map CardinalDirection PortInfo
  }

type State =
  { piece :: Piece
  , location :: Location
  , rotation :: Rotation
  , portStates :: Map CardinalDirection PortInfo
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number
    }
  , isDragging :: Boolean
  }

data Action
  = Initialise
  | Finalise
  | Receive Input
  | OnDrop Location DragEvent
  | OnDrag DragEvent
  | OnMouseDown MouseEvent
  | OnMouseMove MouseEvent
  | OnMouseUp MouseEvent
  | OnAuxClick MouseEvent
  | OnKeyDown KeyboardEvent

data Query a

data Output
  = Rotated Location Rotation
  | Dropped Location
  | RemoveThis Location

slot = Proxy :: Proxy "piece"

initialState :: Input -> State
initialState { piece, location, rotation, portStates } =
  { piece
  , location
  , rotation
  , portStates
  , isRotating: Nothing
  , isDragging: false
  }

component :: forall m. MonadAff m => Component Query Input Output m
component =
  mkComponent
    { initialState
    , render
    , eval: mkEval $ defaultEval
        { handleAction = handleAction
        , initialize = Just Initialise
        , finalize = Just Finalise
        , receive = Just <<< Receive
        }
    }

render :: forall m. MonadAff m => State -> ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ HP.classes [ ClassName "piece-component" ]
    , DA.attr DA.isDragging state.isDragging
    , DA.attr DA.rotation state.rotation
    , DA.attr DA.pieceId (name state.piece)
    , HP.draggable (isNothing state.isRotating)
    , HP.ref refPiece
    , HP.tabIndex 0
    , HP.style ("transform: rotate(" <> show (displayDegrees state) <> "deg);")

    , HE.onDragEnd (OnDrop state.location)
    , HE.onDrag OnDrag
    , HE.onMouseDown OnMouseDown
    , HE.onMouseMove OnMouseMove
    , HE.onMouseUp OnMouseUp
    , HE.onKeyDown OnKeyDown
    ]
    [ HH.slot_ Visual.slot unit Visual.component
        { piece: state.piece, portStates: state.portStates }
    ]

-- | The angle actually shown: the live drag preview while a rotate gesture
-- | is in progress, otherwise the last committed rotation.
displayDegrees :: State -> Number
displayDegrees state = case state.isRotating of
  Just { currentRotation } -> currentRotation * 180.0 / pi
  Nothing -> toDegrees state.rotation

handleAction :: forall m. MonadAff m => Action -> HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialise -> pure unit
  Finalise -> pure unit
  Receive { piece, location, rotation, portStates } ->
    modify_ $ _
      { piece = piece
      , location = location
      , rotation = rotation
      , portStates = map clampPortInfo portStates
      }

  OnDrop loc _event -> do
    modify_ (_ { isDragging = false })
    raise (Dropped loc)
  OnDrag _dragEvent -> do
    -- The native `drag` event fires continuously for the whole gesture, but
    -- `isDragging` only actually changes once (false -> true) -- only
    -- modify_ then, so the dozens of no-op events later in the same drag
    -- don't each force a full re-render.
    isDragging <- gets (_.isDragging)
    unless isDragging $ modify_ (_ { isDragging = true })
  OnMouseDown me ->
    getHTMLElementRef refPiece >>= traverse_ \he -> do
      r <- liftEffect $ mul 0.5 <$> clientWidth (toElement he)
      c <- liftEffect $ elementCenterClient (toElement he)
      let Tuple x y = sub (getPosition me) c
      if r * r > x * x + y * y
        -- if the mouse is inside the inner circle of the piece...
        then
          -- start dragging
          modify_ (_ { isRotating = Nothing })
        else do
          -- else start rotation
          liftEffect $ setDraggable false he
          committedRotation <- gets (_.rotation)
          modify_ (_
            { isRotating = Just
                { initialClickPosition: getPosition me
                , currentRotation: toRadians committedRotation
                }
            , isDragging = false
            })
  OnAuxClick _ -> do
    loc <- gets (_.location)
    raise (Dropped loc)

  OnMouseMove me ->
    getRef (RefLabel "piece") >>= traverse_ \e ->
      gets (_.isRotating) >>= traverse_ \{ initialClickPosition } -> do
        committedRotation <- gets (_.rotation)
        let p1 = initialClickPosition
        let p2 = getPosition me
        c <- liftEffect $ elementCenterClient e
        let angle = toRadians committedRotation + angleBetween (p1 - c) (p2 - c)
        modify_ (_ { isRotating = Just { initialClickPosition, currentRotation: angle } })
  OnMouseUp _me ->
    gets (_.isRotating) >>= traverse_ \{ currentRotation } -> do
      let closestSnapPoint = rotation $ round (4.0 * currentRotation / (2.0 * pi))
      committedRotation <- gets (_.rotation)
      location <- gets (_.location)
      modify_ (_ { isRotating = Nothing })
      raise (Rotated location (closestSnapPoint <> ginverse committedRotation))
  OnKeyDown ke -> do
    when (key ke == "r") do
      loc <- gets (_.location)
      raise (Rotated loc (rotation 1))
    when (key ke == "R") do
      loc <- gets (_.location)
      raise (Rotated loc (rotation 3))

angleBetween :: Tuple Number Number -> Tuple Number Number -> Number
angleBetween v1 v2 = atan2 (v1 `det` v2) (v1 `dot` v2)
  where
  dot (Tuple x1 y1) (Tuple x2 y2) = x1 * x2 + y1 * y2
  det (Tuple x1 y1) (Tuple x2 y2) = x1 * y2 - x2 * y1

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
