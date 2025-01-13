module Component.Board.Types
  ( Action(..)
  , Input
  , Output(..)
  , Query(..)
  , Slots
  , State
  , _board
  , _inputs
  , _outputs
  , _wireLocations
  , boardPortInfo
  , initialState
  , pieceInput
  , slot
  )
  where

import Data.Lens
import Prelude

import Component.Multimeter as Multimeter
import Component.Piece as Piece
import Control.Monad.State (class MonadState, evalState, gets, runState)
import Data.Either (Either)
import Data.Foldable (for_)
import Data.Lens.At (at)
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Game.Board (Board(..), BoardError, BoardM, PieceInfo, RelativeEdge, Path, _pieces, evalBoardM, getBoardPortEdge, runBoardM, standardBoard, toLocalInputs)
import Game.Direction (CardinalDirection)
import Game.GameEvent (BoardEvent)
import Game.Location (Location(..))
import Game.Piece (Piece(..), defaultPortInfo)
import Game.Port (Port(..))
import Game.PortInfo (PortInfo)
import Game.Signal (Signal)
import Game.TestCase (TestCase, TestCaseData, TestCaseOutcome)
import Halogen (Slot)
import Type.Proxy (Proxy(..))
import Web.Event.Internal.Types (Event)
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = { board :: Board }

type State = 
  { boardHistory :: Zipper Board -- todo: limit the number of boards in this data structure
  , inputs :: Map CardinalDirection Signal
  , outputs :: Map CardinalDirection Signal
  , lastEvalWithPortInfo :: Map RelativeEdge PortInfo
  , boardPorts :: Map CardinalDirection Port
  , isCreatingWire :: Maybe
    { initialDirection :: CardinalDirection
    , locations :: Array Location
    }
  , isMouseOverBoardPort :: Maybe CardinalDirection
  , isMouseOverLocation :: Maybe Location
  }

pieceInput :: State -> Location -> Maybe Piece.Input
pieceInput state location = do
  { piece, rotation } <- state ^. _board <<< _pieces <<< at location
  let portStates = M.union (toLocalInputs location state.lastEvalWithPortInfo) (defaultPortInfo piece) 
  pure { piece, location, rotation, portStates}

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location Piece (Either BoardError Unit -> a)
  | AddPath CardinalDirection (Array Location) CardinalDirection (Either BoardError Path -> a)
  | RemovePiece Location  (Either BoardError PieceInfo -> a)
  | GetMouseOverLocation (Location -> a)
  | SetInputs (Map CardinalDirection Signal) (Map CardinalDirection Signal -> a)
  | SetGoalPorts (Map CardinalDirection Port) a
  | SetBoardSize Int (Either BoardError Unit -> a)
  | Undo a
  | Redo a
  | Clear a
  | RunTestCase TestCaseData (TestCaseOutcome -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output
  | MultimeterOutput Multimeter.Output

  | ToggleInput CardinalDirection
  | IncrementInput CardinalDirection
  | DecrementInput CardinalDirection
  | SetOutputs (Map CardinalDirection Signal)

  | SetBoard Board
  | EvaluateBoard
  -- | UpdatePieceComponents

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
  | BoardEvent BoardEvent

type Slots =
  ( piece :: Slot Piece.Query Piece.Output Location
  , multimeter :: Slot Multimeter.Query Multimeter.Output Unit
  )

initialState :: Input -> State
initialState { board } = 
  { boardHistory: Z.singleton board
  , boardPorts: M.empty
  , inputs: M.empty
  , outputs: M.empty
  , lastEvalWithPortInfo: M.empty
  , isCreatingWire: Nothing
  , isMouseOverLocation: Nothing
  , isMouseOverBoardPort: Nothing
  }

slot = Proxy :: Proxy "board"

_board :: Lens' State Board
_board = prop (Proxy :: Proxy "boardHistory") <<< Z._head

_inputs :: Lens' State (Map CardinalDirection Signal)
_inputs = prop (Proxy :: Proxy "inputs")

_outputs :: Lens' State (Map CardinalDirection Signal)
_outputs = prop (Proxy :: Proxy "outputs")

_wireLocations :: Traversal' State (Array Location)
_wireLocations = prop (Proxy :: Proxy "isCreatingWire") <<< _Just <<< prop (Proxy :: Proxy "locations")

boardPortInfo :: forall m. MonadState State m => m (Map CardinalDirection PortInfo)
boardPortInfo = do
  boardPorts <- gets (_.boardPorts)
  board <- use _board
  forWithIndex boardPorts \dir port -> do
    let relEdge = evalState (getBoardPortEdge dir) board
    gets (_.lastEvalWithPortInfo >>> M.lookup relEdge >>> fromMaybe { connected: false, port, signal: zero})