module Component.Board.Types
  ( Action(..)
  , Input
  , Output(..)
  , Query(..)
  , WormholeRole(..)
  , BoardViewKey(..)
  , Slots
  , State
  , _board
  , _zoomed
  , _inputs
  , _outputs
  , _wireLocations
  , boardPortInfo
  , canHoldWormhole
  , initialState
  , pieceInput
  , slot
  , wormholeCandidate
  , wormholeEnd
  , zoomGeometry
  , zoomInset
  , zoomTransform
  )
  where

import Data.Lens
import Prelude

import Component.Piece.Movement as Piece
import Component.Board.ViewModel (BoardView, maxDepth, staticSource, viewBoard)
import Data.List (List(..))
import Component.BoardView as BoardView
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
import Control.Monad.State (evalState)
import Game.Board (Board, BoardError, BoardM, Cell, Path, Wormhole, ZoomedBoard, _focus, _wormhole, evalBoardM, getBoardPorts, isZoomed, runBoardM, standardBoard, unzoomed, wormholeBetween)
import Game.Direction (CardinalDirection)
import Game.Frame (Frame, PortIndex)
import Game.Frame as Frame
import Game.Location (Location(..))
import Game.Piece (Piece(..))
import Game.Port (Port(..), hasPort, noPort)
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
  -- every wormhole's buffer after the last `EvaluateBoard`, keyed by its
  -- tail's `PortIndex` (`Game.Eval.saveState`) -- what makes a wormhole
  -- remember what it captured last tick. Keyed by port rather than slot so
  -- it survives recompiling an edited board: adding a piece doesn't wipe a
  -- memory cell in a nested board. Moving that board does (its path changes).
  , registerState :: Map PortIndex Signal
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
  -- a board side being dragged from: to another side, to make a wormhole
  -- between them, or, when it's one end of the wormhole (`existing`), off the
  -- board to close it. `outside` is whether the mouse has left the board.
  , wormholeDrag :: Maybe { from :: CardinalDirection, existing :: Boolean, outside :: Boolean }
  -- the slot being scaled up to fill the board (or back down), while a
  -- zoom animates -- see `zoomTransform`. Purely visual: the zoom itself
  -- lives in `boardHistory`. `animate` is false for the one frame a zoom
  -- out starts from, so it jumps to fully scaled up and then animates down.
  -- `inset` is the zoomed-in board's `zoomInset`: the slot is scaled to fill
  -- the board less that margin, which is where its neighbours show.
  , zoomAnimation :: Maybe { location :: Location, animate :: Boolean, inset :: Number }
  -- the board was just zoomed into, so its grid fades in
  , fadeInGrid :: Boolean
  -- the focus as it's drawn, nested boards and all. `pieceInputs` is its
  -- leaves, ready for `Component.Piece.Movement`
  , focusView :: BoardView
  -- while zoomed in, the board around the focus, which shows at its edges,
  -- and where the focus sits in it
  , contextView :: Maybe { parent :: BoardView, hole :: Location }
  }

pieceInput :: State -> Location -> Maybe Piece.Input
pieceInput state location = M.lookup location state.pieceInputs

-- | The mouth takes a signal in from the board; the tail gives it back out a
-- | tick later.
data WormholeRole = Mouth | Tail

derive instance Eq WormholeRole

data Query a
  -- the real board: everything, rebuilt from the zoom
  = GetBoard (Board -> a)
  -- the board being looked at, which every edit below applies to
  | GetFocus (Board -> a)
  | AddPiece Location Cell (Either BoardError Unit -> a)
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
  | BoardPortOnMouseDown CardinalDirection MouseEvent
  | BoardOnMouseEnter
  | BoardOnMouseLeave
  | GlobalOnMouseUp MouseEvent

data Output
  = NewBoardState ZoomedBoard

-- `Component.Multimeter` exists but isn't currently wired into the board --
-- it used to be slotted here and driven off port-focus events, but that
-- wiring depended on the retired `EvaluableBoard`-era port-info map and was
-- removed rather than migrated. Revisit if/when it's reintroduced.
type Slots =
  ( piece :: Slot Piece.Query Piece.Output Location
  -- everything only drawn: nested boards, and the board around a zoomed-in one
  , boardView :: Slot BoardView.Query Void BoardViewKey
  )

data BoardViewKey
  = ContextKey
  | NestedKey Location

derive instance Eq BoardViewKey
derive instance Ord BoardViewKey

initialState :: Input -> State
initialState { board } =
  { boardHistory: Z.singleton (unzoomed board)
  , boardPorts: pure noPort
  , inputs: pure zero
  , outputs: pure zero
  , registerState: M.empty
  , pieceInputs: M.empty
  , boardPortInfoMap: pure noPortInfo
  , isCreatingWire: Nothing
  , isMouseOverLocation: Nothing
  , isMouseOverBoardPort: Nothing
  , wormholeDrag: Nothing
  , zoomAnimation: Nothing
  , fadeInGrid: false
  , focusView: viewBoard staticSource maxDepth Nil board
  , contextView: Nothing
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
-- | Which end of the focus's wormhole is on `dir`, if any.
wormholeEnd :: State -> CardinalDirection -> Maybe { role :: WormholeRole, wormhole :: Wormhole }
wormholeEnd state dir = view (_board <<< _wormhole) state >>= \wormhole ->
  if wormhole.wormholeIn == dir then Just { role: Mouth, wormhole }
  else if wormhole.wormholeOut == dir then Just { role: Tail, wormhole }
  else Nothing

-- | Whether a wormhole could have an end on `dir`. Any side of a nested board
-- | can; the root's sides with a goal port are the level's, so only its
-- | others can.
canHoldWormhole :: State -> CardinalDirection -> Boolean
canHoldWormhole state dir =
  isZoomed (view _zoomed state) || not (hasPort (Frame.index dir state.boardPorts))

-- | The wormhole a drag from `from` dropped on `to` would make, if it's
-- | allowed -- see `Game.Board.wormholeBetween`.
wormholeCandidate :: State -> CardinalDirection -> CardinalDirection -> Maybe Wormhole
wormholeCandidate state from to
  | canHoldWormhole state from && canHoldWormhole state to =
      wormholeBetween (evalState getBoardPorts (view _board state)) from to
  | otherwise = Nothing
