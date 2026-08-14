-- | The "simplified piece" from the Piece.Movement/Piece.Visual split --
-- | knows nothing about dragging or rotation gestures, just how to draw a
-- | `Piece` given its current `portStates`. Mounted as a child slot of
-- | `Component.Piece.Movement`, so its own re-renders are gated by its own
-- | `Receive`/`Eq`-driven eval cycle, independent of how often the movement
-- | wrapper re-renders during a drag or rotate gesture.
-- |
-- | `Visual` is a placeholder name -- open to something better once this is
-- | wired up for real.
module Component.Piece.Visual
  ( Action(..)
  , ChildSlots
  , Input
  , Output
  , Query
  , State
  , component
  , slot
  )
  where

import Prelude

import Component.Piece.Render as Piece.Render
import Component.Piece.Types
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Game.Direction (CardinalDirection)
import Game.Location (location)
import Game.Piece (Piece)
import Game.PortInfo (PortInfo)
import Game.Rotation (rotation)
import Halogen (Component, ComponentHTML, HalogenM, defaultEval, mkComponent, mkEval, modify_)
import Type.Proxy (Proxy(..))

type ChildSlots = Render.ChildSlots

type Input =
  { piece :: Piece
  , portStates :: Map CardinalDirection PortInfo
  }

type State = Input

data Action
  = Receive Input

data Query a

type Output = Void

slot = Proxy :: Proxy "pieceVisual"

component :: forall m. MonadAff m => Component Query Input Output m
component =
  mkComponent
    { initialState: identity
    , render
    , eval: mkEval $ defaultEval
        { handleAction = handleAction
        , receive = Just <<< Receive
        }
    }

-- | `Render.renderPiece` still takes the full (movement-era) `PieceTypes.State`
-- | -- pad the fields it doesn't actually read (`location`, `rotation`,
-- | `isRotating`, `isDragging`) so this always renders upright, regardless of
-- | the piece's real committed rotation or any in-progress drag gesture.
render :: forall m. MonadAff m => State -> ComponentHTML Action ChildSlots m
render state = Render.renderPiece paddedState
  where
  paddedState :: PieceTypes.State
  paddedState =
    { piece: state.piece
    , portStates: state.portStates
    , location: location 0 0
    , rotation: rotation 0
    , isRotating: Nothing
    , isDragging: false
    }

handleAction :: forall m. MonadAff m => Action -> HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Receive input -> modify_ (const input)
