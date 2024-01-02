module Component.Board.Types where

import Prelude

import Component.MultimeterComponent as Multimeter
import Component.Piece as Piece
import Control.Monad.State (evalState, runState)
import Data.Either (Either)
import Data.Lens (Lens', Traversal', _Just, lens, lens')
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe)
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Game.Board (Board(..), RelativeEdge)
import Game.Board.Operation (BoardError)
import Game.Board.PortInfo (PortInfo)
import Game.Board.Query (getBoardPort)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (Piece(..), PieceId(..))
import Game.Signal (Signal(..))
import Halogen (Slot)
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = Maybe Board

type State = 
  { boardHistory :: Zipper Board
  , mouseOverLocation :: Maybe Location
  , lastEvalWithPortInfo :: Map RelativeEdge PortInfo
  , isCreatingWire :: Maybe
    { initialDirection :: CardinalDirection
    , locations :: Array Location
    }
  }

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location Piece (Either BoardError Unit -> a)
  | RemovePiece Location (Either BoardError PieceId -> a)
  | GetMouseOverLocation (Location -> a)
  | SetInputs (Map CardinalDirection Signal) (Map CardinalDirection Signal -> a)
  | IncrementBoardSize (Board -> a)
  | DecrementBoardSize (Board -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output
  | MultimeterOutput Multimeter.Output
  | Undo
  | Redo
  | ToggleInput CardinalDirection

  | GlobalOnKeyDown KeyboardEvent
  | BoardOnDragExit DragEvent
  | LocationOnMouseDown Location MouseEvent
  | LocationOnMouseOver Location MouseEvent
  | LocationOnMouseUp Location MouseEvent
  | LocationOnDragEnter Location DragEvent
  | LocationOnDragOver Location DragEvent
  | LocationOnDragLeave DragEvent
  | LocationOnDrop Location DragEvent

  | BoardPortOnMouseEnter CardinalDirection
  | BoardPortOnMouseLeave

data Output
  = NewBoardState Board

type Slots =
  ( piece :: Slot Piece.Query Piece.Output Location
  , multimeter :: Slot Multimeter.Query Multimeter.Output Unit
  )

_piece = Proxy :: Proxy "piece"
_multimeter = Proxy :: Proxy "multimeter"

_board :: Lens' State Board
_board = prop (Proxy :: Proxy "boardHistory") <<< Z._head

_wireLocations :: Traversal' State (Array Location)
_wireLocations = prop (Proxy :: Proxy "isCreatingWire") <<< _Just <<< prop (Proxy :: Proxy "locations")

_boardPort :: CardinalDirection -> Lens' State (Maybe PortInfo)
_boardPort dir = lens getPort setPort
  where
    getPort state =
      let board = Z.head state.boardHistory
          relEdge = evalState (getBoardPort dir) board
      in M.lookup relEdge state.lastEvalWithPortInfo

    setPort :: State -> Maybe PortInfo -> State
    setPort state maybePortInfo =
      let board = Z.head state.boardHistory
          relEdge = evalState (getBoardPort dir) board
      in state { lastEvalWithPortInfo = M.alter (\_ -> maybePortInfo) relEdge state.lastEvalWithPortInfo }
