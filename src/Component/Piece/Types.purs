module Component.Piece.Types
  ( Action(..)
  , Input
  , Output(..)
  , Query(..)
  , State
  , _portStates
  , boardInputs
  , initialState
  , slot
  )
  where

import Prelude

import Component.Piece.Outline as Outline
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens (Lens', view)
import Data.Lens.Record (prop)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Either (Either(..))
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Tuple (Tuple(..))
import Game.Frame (Frame)
import Game.Board (Board, RelativeEdge, _pieces, resumeBoard)
import Game.Eval (Netlist, portInfo)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..), location)
import Game.Frame as Frame
import Game.Piece (Piece(..), getPorts)
import Game.Port (hasPort)
import Game.PortInfo (PortInfo)
import Game.Rotation (Rotation(..), rotation)
import Game.Signal (Signal)
import Halogen as H
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input =
  { piece :: Piece
  , location :: Location
  , rotation :: Rotation
  , portStates :: Frame PortInfo
  }

type State =
  { piece :: Piece
  , location :: Location
  , rotation  :: Rotation
  , portStates :: Frame PortInfo
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number
    }
  , isDragging :: Boolean
  }

data Query a
  -- = SetPortStates (Frame PortInfo) a
  -- | SetPiece Piece a 
  -- | SetRotation Rotation a

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
  | PortOnMouseEnter CardinalDirection
  | PortOnMouseLeave
  | OnKeyDown KeyboardEvent

data Output
  = Rotated Location Rotation
  | Dropped Location
  | RemoveThis Location
  | NewMultimeterFocus (Maybe {info :: PortInfo, relativeEdge :: RelativeEdge })

type ChildSlots = ( outline :: H.Slot Outline.Query Void Unit )

-- the subset of state used for rendering (for memoization)
type RenderState =
  { piece :: Piece
  , location :: Location
  , rotation  :: Rotation
  , portStates :: Frame PortInfo
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number
    }
  }

slot = Proxy :: Proxy "piece"

initialState :: Input -> State
initialState { piece, rotation, location, portStates } =
  { piece
  , location
  , rotation
  , portStates
  , isRotating: Nothing
  , isDragging: false
  }

_portStates :: Lens' State (Frame PortInfo)
_portStates = prop (Proxy :: _ "portStates")

--type State =
--  { piece :: Piece
--  , location :: Location
--  , rotation  :: Rotation
--  , portStates :: Frame PortInfo
--  , isRotating :: Maybe
--    { initialClickPosition :: Tuple Number Number
--    , currentRotation :: Number
--    }
--  , isDragging :: Boolean
--
--  }

{-
  Every root-level piece's `Input`, ready to hand to `Component.Piece`. Takes
  the already-`compile`d `Netlist` (the caller needs one anyway, to `step` it
  and produce `signals`) rather than compiling `board` again here. `board`
  supplies the pieces themselves and their `Rotation`s, which a `Netlist`
  doesn't keep.

  A nested board can't be shown as a piece in this UI yet -- same
  limitation as `Component.Board.Types.pieceInput` -- so only the root's own
  leaf pieces are included.
-}
boardInputs :: Netlist -> Board -> Array Signal -> Map Location Input
boardInputs netlist board signals = M.mapMaybeWithKey toInput (view _pieces board)
  where
  toInput :: Location -> { rotation :: Rotation, piece :: Board } -> Maybe Input
  toInput loc { rotation, piece: cell } = case resumeBoard cell of
    Left _ -> Nothing
    Right piece -> Just
      { piece
      , location: loc
      , rotation
      , portStates: mapWithIndex (\dir port -> portInfo netlist signals (Tuple (L.singleton loc) dir) port) (getPorts piece)
      }