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

import Component.Piece.Movement as Piece
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Game.Board (Board, BoardError, BoardM, Path, evalBoardM, runBoardM, standardBoard)
import Game.Board.Compiled (PortIndex)
import Game.Direction (CardinalDirection)
import Game.Frame (Frame)
import Game.Location (Location(..))
import Game.Piece (Piece(..))
import Game.Port (Port(..), noPort)
import Game.PortInfo (PortInfo, noPortInfo)
import Game.Rotation (Rotation(..))
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
  , inputs :: Frame Signal
  , outputs :: Frame Signal
  -- the tick state threaded through `Game.Board.Compiled.evaluate` from one
  -- `EvaluateBoard` to the next -- what makes a wormhole piece remember
  -- what it captured last tick.
  , lastEvalState :: Map PortIndex Signal
  -- both precomputed once per `EvaluateBoard`, straight off `lastEvalState`
  -- -- render just reads them.
  , pieceInputs :: Map Location Piece.Input
  , boardPortInfoMap :: Frame PortInfo
  , boardPorts :: Frame Port
  , isCreatingWire :: Maybe
    { initialDirection :: CardinalDirection
    , locations :: Array Location
    }
  , isMouseOverBoardPort :: Maybe CardinalDirection
  , isMouseOverLocation :: Maybe Location
  }

pieceInput :: State -> Location -> Maybe Piece.Input
pieceInput state location = M.lookup location state.pieceInputs

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location Piece (Either BoardError Unit -> a)
  | AddPath CardinalDirection (Array Location) CardinalDirection (Either BoardError Path -> a)
  | RemovePiece Location  (Either BoardError { rotation :: Rotation, piece :: Board } -> a)
  | RotatePieceBy Location Rotation (Either BoardError Unit -> a)
  | GetMouseOverLocation (Location -> a)
  | SetInputs (Frame Signal) (Frame Signal -> a)
  | SetGoalPorts (Frame Port) a
  | SetBoardSize Int (Either BoardError Unit -> a)
  | Undo a
  | Redo a
  | Clear a
  | RunTestCase TestCaseData (TestCaseOutcome -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output

  | ToggleInput CardinalDirection
  | IncrementInput CardinalDirection
  | DecrementInput CardinalDirection
  | SetOutputs (Frame Signal)

  | SetBoard Board
  | EvaluateBoard
  -- fired every 500ms while the component lives, so a wormhole piece's
  -- state keeps advancing even with no input change -- see `Initialise`.
  | Tick
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

-- `Component.Multimeter` exists but isn't currently wired into the board --
-- it used to be slotted here and driven off port-focus events, but that
-- wiring depended on the retired `EvaluableBoard`-era port-info map and was
-- removed rather than migrated. Revisit if/when it's reintroduced.
type Slots =
  ( piece :: Slot Piece.Query Piece.Output Location
  )

initialState :: Input -> State
initialState { board } =
  { boardHistory: Z.singleton board
  , boardPorts: pure noPort
  , inputs: pure zero
  , outputs: pure zero
  , lastEvalState: M.empty
  , pieceInputs: M.empty
  , boardPortInfoMap: pure noPortInfo
  , isCreatingWire: Nothing
  , isMouseOverLocation: Nothing
  , isMouseOverBoardPort: Nothing
  }

slot = Proxy :: Proxy "board"

_board :: Lens' State Board
_board = prop (Proxy :: Proxy "boardHistory") <<< Z._head

_inputs :: Lens' State (Frame Signal)
_inputs = prop (Proxy :: Proxy "inputs")

_outputs :: Lens' State (Frame Signal)
_outputs = prop (Proxy :: Proxy "outputs")

_wireLocations :: Traversal' State (Array Location)
_wireLocations = prop (Proxy :: Proxy "isCreatingWire") <<< _Just <<< prop (Proxy :: Proxy "locations")

boardPortInfo :: State -> Frame PortInfo
boardPortInfo = _.boardPortInfoMap