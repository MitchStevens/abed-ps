module Component.Board.Types
  ( Action(..)
  , Input
  , Output(..)
  , Query(..)
  , Slots
  , State
  , _board
  , _zoomed
  , _inputs
  , _outputs
  , _wireLocations
  , boardPortInfo
  , initialState
  , pieceInput
  , slot
  , zoomGeometry
  , zoomInset
  , zoomTransform
  )
  where

import Data.Lens
import Prelude

import Component.Piece.Movement as Piece
import Component.Piece.Visual as Visual
import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Game.Board (Board, BoardError, BoardM, Cell, Path, ZoomedBoard, _focus, evalBoardM, runBoardM, standardBoard, unzoomed)
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
import Web.UIEvent.WheelEvent (WheelEvent)

type Input = { board :: Board }

type State =
  -- zooming in or out is a move like any other, so it's in the history too
  { boardHistory :: Zipper ZoomedBoard -- todo: limit the number of boards in this data structure
  , inputs :: Frame Signal
  , outputs :: Frame Signal
  -- the signals threaded through `Game.Eval.step` from one `EvaluateBoard`
  -- to the next -- what makes a wormhole remember what it captured last
  -- tick -- along with the board they belong to. Slots are only meaningful
  -- for the board that was compiled, so any edit starts again from
  -- `initialSignals` (which also resets every wormhole, as an edit should).
  , lastEvalState :: Maybe { board :: Board, signals :: Array Signal }
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
  -- the slot being scaled up to fill the board (or back down), while a
  -- zoom animates -- see `zoomTransform`. Purely visual: the zoom itself
  -- lives in `boardHistory`. `animate` is false for the one frame a zoom
  -- out starts from, so it jumps to fully scaled up and then animates down.
  -- `inset` is the zoomed-in board's `zoomInset`: the slot is scaled to fill
  -- the board less that margin, which is where its neighbours show.
  , zoomAnimation :: Maybe { location :: Location, animate :: Boolean, inset :: Number }
  -- the board was just zoomed into, so its grid fades in
  , fadeInGrid :: Boolean
  -- while zoomed in, the pieces of the board around the focus, which show
  -- at its edges -- `pieceInputs`, one level up
  , contextInputs :: Map Location Piece.Input
  }

pieceInput :: State -> Location -> Maybe Piece.Input
pieceInput state location = M.lookup location state.pieceInputs

data Query a
  -- the real board: everything, rebuilt from the zoom
  = GetBoard (Board -> a)
  -- the board being looked at, which every edit below applies to
  | GetFocus (Board -> a)
  | AddPiece Location Piece (Either BoardError Unit -> a)
  | AddPath CardinalDirection (Array Location) CardinalDirection (Either BoardError Path -> a)
  | RemovePiece Location  (Either BoardError { rotation :: Rotation, piece :: Cell } -> a)
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

  | SetBoard ZoomedBoard
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
  | LocationOnWheel Location WheelEvent
  | BoardOnWheel WheelEvent
  | FinishZoomIn Location
  | FinishZoomOut Location

  | BoardPortOnMouseEnter CardinalDirection
  | BoardPortOnMouseLeave

data Output
  = NewBoardState ZoomedBoard

-- `Component.Multimeter` exists but isn't currently wired into the board --
-- it used to be slotted here and driven off port-focus events, but that
-- wiring depended on the retired `EvaluableBoard`-era port-info map and was
-- removed rather than migrated. Revisit if/when it's reintroduced.
type Slots =
  ( piece :: Slot Piece.Query Piece.Output Location
  -- the pieces around a zoomed-in board: drawn, but not interactive
  , contextPiece :: Slot Visual.Query Visual.Output Location
  -- the pieces inside a nested board, drawn as a static preview. Keyed by
  -- which grid the preview is in (the board's own or its context) and the
  -- nested board's location, then the piece's location inside it
  , nestedPiece :: Slot Visual.Query Visual.Output (Tuple String (Tuple Location Location))
  )

initialState :: Input -> State
initialState { board } =
  { boardHistory: Z.singleton (unzoomed board)
  , boardPorts: pure noPort
  , inputs: pure zero
  , outputs: pure zero
  , lastEvalState: Nothing
  , pieceInputs: M.empty
  , boardPortInfoMap: pure noPortInfo
  , isCreatingWire: Nothing
  , isMouseOverLocation: Nothing
  , isMouseOverBoardPort: Nothing
  , zoomAnimation: Nothing
  , fadeInGrid: false
  , contextInputs: M.empty
  }

slot = Proxy :: Proxy "board"

_zoomed :: Lens' State ZoomedBoard
_zoomed = prop (Proxy :: Proxy "boardHistory") <<< Z._head

-- | The board being looked at -- the focus of the zoom, not the real board.
_board :: Lens' State Board
_board = _zoomed <<< _focus

_inputs :: Lens' State (Frame Signal)
_inputs = prop (Proxy :: Proxy "inputs")

_outputs :: Lens' State (Frame Signal)
_outputs = prop (Proxy :: Proxy "outputs")

_wireLocations :: Traversal' State (Array Location)
_wireLocations = prop (Proxy :: Proxy "isCreatingWire") <<< _Just <<< prop (Proxy :: Proxy "locations")

-- | How far in from each edge of the board its grid of slots starts, as a
-- | fraction of the board's width: the port track either side. The grid is
-- | `25fr` of port track either side of `n` tracks of `100fr`.
zoomInset :: Int -> Number
zoomInset n = 25.0 / (100.0 * toNumber n + 50.0)

-- | Scaling a board of size `n` by `scale`, then shifting it by `dx`/`dy`
-- | board widths, puts the slot at this location `inset` in from every edge
-- | of the board. With an `inset` of 0 the slot fills the board exactly.
-- |
-- | Unscaled, the board is `n + 0.5` slots wide and the slot's left edge is
-- | `x + 0.25` slots in. Scaled, a slot is `1 - 2 * inset` board widths, so
-- | its left edge is `(x + 0.25) * (1 - 2 * inset)` in, and the shift moves
-- | that to `inset`. Assumes `transform-origin: 0 0`.
zoomGeometry :: Int -> Number -> Location -> { scale :: Number, dx :: Number, dy :: Number }
zoomGeometry n inset (Location { x, y }) =
  { scale: (toNumber n + 0.5) * slot
  , dx: offset x
  , dy: offset y
  }
  where
    slot = 1.0 - 2.0 * inset
    offset i = inset - (toNumber i + 0.25) * slot

-- | `zoomGeometry` as a CSS transform. Shifts are percentages of the element
-- | itself, which is the board's size.
zoomTransform :: Int -> Number -> Location -> String
zoomTransform n inset loc =
  "translate(" <> percent dx <> ", " <> percent dy <> ") scale(" <> show scale <> ")"
  where
    { scale, dx, dy } = zoomGeometry n inset loc
    percent v = show (v * 100.0) <> "%"

boardPortInfo :: State -> Frame PortInfo
boardPortInfo = _.boardPortInfoMap