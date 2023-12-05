module Component.Piece.Types where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple)
import Game.Board (RelativeEdge)
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..), location)
import Game.Piece (APiece)
import Game.Rotation (Rotation(..), rotation)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input =
  { piece :: APiece
  , location :: Location
  , portStates :: Map CardinalDirection PortInfo
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
  = SetPortStates (Map CardinalDirection PortInfo)

data Action
  = Initialise Input
  | OnDrop Location DragEvent
  | OnDrag DragEvent
  | OnMouseDown MouseEvent
  | OnMouseMove MouseEvent
  | OnMouseUp Location MouseEvent
  | PortOnMouseEnter CardinalDirection
  | PortOnMouseLeave

data Output
  = Rotated Location Rotation
  | Dropped Location
  | NewMultimeterFocus (Maybe {info :: PortInfo, relativeEdge :: RelativeEdge })


defaultState :: APiece -> State
defaultState piece =
  { piece
  , location: location 0 0
  , rotation: rotation 0
  , isRotating: Nothing
  , portStates: M.empty 
  }