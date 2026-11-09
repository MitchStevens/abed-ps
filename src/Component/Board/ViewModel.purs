-- | What a board looks like, as plain data: every leaf piece with its
-- | rotation and port states, every nested board the same way, down to a
-- | depth budget. Built once per evaluation (see `EvaluateBoard`), then just
-- | read by the renderers -- `Component.Board.Render` for the interactive
-- | grid and `Component.BoardView` for everything that's only drawn.
module Component.Board.ViewModel
  ( BoardView
  , CellView(..)
  , PortSource
  , leafInputs
  , liveSource
  , maxDepth
  , staticSource
  , viewBoard
  )
  where

import Prelude

import Component.Piece.Types as Piece
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens (view)
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Board (Board, Cell(..), _pieces, _ports, _size)
import Game.Direction (CardinalDirection)
import Game.Eval (Netlist, portInfo)
import Game.Frame (Frame, PieceIndex)
import Game.Location (Location)
import Game.Piece (Piece, getPorts)
import Game.Port (Port, hasPort)
import Game.PortInfo (PortInfo, noPortInfo)
import Game.Rotation (Rotation)
import Game.Signal (Signal)

data CellView
  = LeafView { piece :: Piece, rotation :: Rotation, portStates :: Frame PortInfo }
  | NestedView BoardView
  -- past the depth budget: there's a board here, too small to be worth drawing
  | TooDeep

derive instance Eq CellView

type BoardView =
  { size :: Int
  , ports :: Frame PortInfo
  , cells :: Map Location CellView
  }

-- | How many levels of board are drawn, counting the one being looked at.
maxDepth :: Int
maxDepth = 3

-- | Where a port's state comes from: the port at `dir` of the piece (or
-- | board) at `index`.
type PortSource = PieceIndex -> CardinalDirection -> Port -> PortInfo

-- | The signals from an evaluation.
liveSource :: Netlist -> Array Signal -> PortSource
liveSource netlist signals index dir port = portInfo netlist signals (Tuple index dir) port

-- | No evaluation to read from (the board doesn't compile): everything off.
staticSource :: PortSource
staticSource _ _ port
  | hasPort port = { port, connected: false, signal: zero }
  | otherwise = noPortInfo

-- | The board at `index`, with `budget` levels drawn (itself included).
viewBoard :: PortSource -> Int -> PieceIndex -> Board -> BoardView
viewBoard src budget index board =
  { size: view _size board
  , ports: mapWithIndex (src index) (view _ports board)
  , cells: mapWithIndex cellView (view _pieces board)
  }
  where
    cellView loc { rotation, piece: cell } = case cell of
      Leaf piece -> LeafView
        { piece
        , rotation
        , portStates: mapWithIndex (src (index <> L.singleton loc)) (getPorts piece)
        }
      Nested inner
        | budget > 1 -> NestedView (viewBoard src (budget - 1) (index <> L.singleton loc) inner)
        | otherwise -> TooDeep

-- | The board's own leaf pieces, as `Component.Piece.Movement` takes them.
leafInputs :: BoardView -> Map Location Piece.Input
leafInputs bv = M.mapMaybeWithKey toInput bv.cells
  where
    toInput location = case _ of
      LeafView { piece, rotation, portStates } -> Just { piece, location, rotation, portStates }
      _ -> Nothing
