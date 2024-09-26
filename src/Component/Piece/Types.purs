module Component.Piece.Types
  ( Action(..)
  , Input
  , Output(..)
  , Query(..)
  , State
  , _portStates
  , initialState
  , slot
  )
  where

import Prelude

import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens (Lens')
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple)
import Game.Board (RelativeEdge)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..), location)
import Game.Piece (Piece(..))
import Game.PortInfo (PortInfo)
import Game.Rotation (Rotation(..), rotation)
import Game.Signal (Signal)
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input =
  { piece :: Piece
  , location :: Location
  }

type State = 
  { piece :: Piece
  , location :: Location
  , rotation  :: Rotation
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number 
    }
  , isDragging :: Boolean
  , portStates :: Map CardinalDirection PortInfo
  }

data Query a
  = SetPortStates (Map CardinalDirection PortInfo) a
  | SetPiece Piece a 
  | SetRotation Rotation a

data Action
  = Initialise Input
  | OnDrop Location DragEvent
  | OnDrag DragEvent
  | OnMouseDown MouseEvent
  | OnMouseMove MouseEvent
  | OnMouseUp Location MouseEvent
  | PortOnMouseEnter CardinalDirection
  | PortOnMouseLeave
  | OnKeyDown KeyboardEvent

data Output
  = Rotated Location Rotation
  | Dropped Location
  | RemoveThis Location
  | NewMultimeterFocus (Maybe {info :: PortInfo, relativeEdge :: RelativeEdge })

slot = Proxy :: Proxy "piece"

initialState :: Input -> State
initialState { piece: Piece p, location } = 
  { piece: Piece p
  , location
  , rotation: rotation 0
  , isRotating: Nothing
  , isDragging: false
  , portStates: map (\port -> { port, signal: zero, connected: false }) $ p.ports
  }

_portStates :: Lens' State (Map CardinalDirection PortInfo)
_portStates = prop (Proxy :: _ "portStates")