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
  , liftBoardM
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
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Game.Board (Board(..), BoardError, BoardM, RelativeEdge, getBoardPortEdge, runBoardM, standardBoard)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (Piece(..))
import Game.Port (Port(..))
import Game.PortInfo (PortInfo)
import Game.Signal (Signal(..))
import Halogen (Slot)
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = { board ::Board }

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

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location Piece
  | RemovePiece Location 
  | GetMouseOverLocation (Location -> a)
  | SetInputs (Map CardinalDirection Signal) (Map CardinalDirection Signal -> a)
  | SetGoalPorts (Map CardinalDirection Port)
  | IncrementBoardSize (Board -> a)
  | DecrementBoardSize (Board -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output
  | MultimeterOutput Multimeter.Output
  | Undo
  | Redo

  | ToggleInput CardinalDirection
  | IncrementInput CardinalDirection
  | DecrementInput CardinalDirection

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

slot =
  { piece: Proxy :: _ "piece"
  , multimeter: Proxy :: _ "multimeter"
  }

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
    gets (_.lastEvalWithPortInfo >>> M.lookup relEdge >>> fromMaybe { connected: false, port, signal: Signal 0})

liftBoardM :: forall m a. MonadState State m => BoardM a -> m (Either BoardError (Tuple a Board))
liftBoardM boardM = do
  eitherBoard <- runBoardM boardM <$> use _board
  for_ eitherBoard \(Tuple _ board) -> _board .= board
  pure eitherBoard