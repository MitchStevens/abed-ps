{-
  A `Board` with a focus on one of its nested boards: what the player is
  looking at after zooming in.

  A `Board` is a tree of `BoardF Cell` layers, so this is the usual zipper
  over it (McBride's derivative). One layer of context is `BoardHole`, which
  is `BoardF` with one slot punched out. A path through the tree is a list of
  those, innermost first, and the board in the hole is the `focus`.

  The path holds `Cell`s, since a sibling can be a leaf piece or a nested
  board, but the focus is a `Board`: only a nested board can be zoomed into.

  A `ZoomedBoard` is not a `Board` and can't be evaluated. `rebuild` plugs it
  back into the real board underneath, and that's what gets compiled.

  It differs from a pure derivative in two places, both because a slot can be
  empty:

    - zooming into an empty slot focuses a fresh, empty `standardBoard`, and
    - plugging an empty board back into a slot leaves the slot empty.

  Together these keep `rebuild <$> zoomIn loc z == Right (rebuild z)` true.
  Only a slot holding a nested board, or nothing, can be zoomed into: a leaf
  `Piece` has no board inside it. Every `BoardM` operation runs on the focus
  unchanged (`runAtFocus`).
-}
module Game.Board.Zoom
  ( BoardHole(..)
  , ZoomedBoard(..)
  , _focus
  , _rootPorts
  , emptyHole
  , focusIndex
  , isEmptyBoard
  , isZoomed
  , plug
  , punch
  , rebuild
  , runAtFocus
  , unzoomed
  , zoomIn
  , zoomOut
  ) where

import Prelude

import Data.Either (Either(..))
import Data.Lens (Lens', assign, lens, set, view)
import Data.List (List(..))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), isNothing)
import Data.Newtype (class Newtype)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Board.Operation (syncWormholePorts)
import Game.Board.Query (getBoardPorts)
import Game.Board.Types (Board, Cell(..), BoardError(..), BoardF(..), BoardM, Wormhole, _ports, mkBoard, runBoardM, standardBoard, unBoard)
import Game.Frame (Frame, PieceIndex)
import Game.Frame as Frame
import Game.Location (Location(..))
import Game.Port (Port, hasPort)
import Game.Rotation (Rotation)

-- | `BoardF a` with one slot punched out. The slot's `{ rotation, piece :: a }`
-- | has exactly one `a`, so its derivative leaves just the `rotation`.
newtype BoardHole a = BoardHole
  { size :: Int
  , ports :: Frame Port
  , wormhole :: Maybe Wormhole
  , location :: Location
  , rotation :: Rotation
  -- every other slot -- never contains `location`
  , siblings :: M.Map Location { rotation :: Rotation, piece :: a }
  }



derive instance Functor BoardHole
derive instance Newtype (BoardHole a) _
derive instance Eq a => Eq (BoardHole a)

newtype ZoomedBoard = ZoomedBoard
  { path :: List (BoardHole Cell) -- innermost first; `Nil` when not zoomed
  , focus :: Board
  }

derive instance Newtype ZoomedBoard _
derive instance Eq ZoomedBoard

instance Show ZoomedBoard where
  show (ZoomedBoard z) =
    "(ZoomedBoard " <> show (L.reverse (holeLocation <$> z.path)) <> " " <> show z.focus <> ")"

holeLocation :: forall a. BoardHole a -> Location
holeLocation (BoardHole h) = h.location

-- | Take the occupied slot at `loc` out of a board layer.
punch :: forall a. Location -> BoardF a -> Maybe (Tuple (BoardHole a) a)
punch loc (BoardF b) = M.lookup loc b.pieces <#> \{ rotation, piece } ->
  Tuple
    (BoardHole { size: b.size, ports: b.ports, wormhole: b.wormhole, location: loc, rotation, siblings: M.delete loc b.pieces })
    piece

-- | A hole over an empty slot, as if it held something with no rotation.
emptyHole :: forall a. Location -> BoardF a -> BoardHole a
emptyHole loc (BoardF b) =
  BoardHole { size: b.size, ports: b.ports, wormhole: b.wormhole, location: loc, rotation: mempty, siblings: M.delete loc b.pieces }

-- | Put something back into the hole. `plug` and `punch` are inverses.
plug :: forall a. BoardHole a -> a -> BoardF a
plug (BoardHole h) piece = BoardF
  { size: h.size
  , ports: h.ports
  , wormhole: h.wormhole
  , pieces: M.insert h.location { rotation: h.rotation, piece } h.siblings
  }

-- | Like `plug`, but an empty board goes back as an empty slot -- see the
-- | module comment.
plugBoard :: BoardHole Cell -> Board -> Board
plugBoard hole@(BoardHole h) child
  | isEmptyBoard child = mkBoard (BoardF { size: h.size, ports: h.ports, wormhole: h.wormhole, pieces: h.siblings })
  | otherwise = mkBoard (plug hole (Nested child))

-- | A board with nothing on it and nothing on its sides. Its size doesn't
-- | matter: nothing could tell one empty board from another.
isEmptyBoard :: Board -> Boolean
isEmptyBoard board =
  M.isEmpty b.pieces && S.isEmpty (Frame.directionsWhere hasPort b.ports) && isNothing b.wormhole
  where BoardF b = unBoard board

unzoomed :: Board -> ZoomedBoard
unzoomed focus = ZoomedBoard { path: Nil, focus }

isZoomed :: ZoomedBoard -> Boolean
isZoomed (ZoomedBoard z) = not (L.null z.path)

-- | Zoom into the slot at `loc` of the focus. Fails outside the board, or on a
-- | slot holding a leaf piece.
zoomIn :: Location -> ZoomedBoard -> Either BoardError ZoomedBoard
zoomIn loc@(Location { x, y }) (ZoomedBoard z) = do
  let boardF = unBoard z.focus
      BoardF b = boardF
  when (x < 0 || y < 0 || x >= b.size || y >= b.size) do
    Left (InvalidLocation loc)
  case punch loc boardF of
    Nothing -> Right (ZoomedBoard { path: Cons (emptyHole loc boardF) z.path, focus: standardBoard })
    Just (Tuple hole cell) -> case cell of
      Leaf _ -> Left (LocationOccupied loc)
      Nested board -> Right (ZoomedBoard { path: Cons hole z.path, focus: board })

-- | Zoom out one level. `Nothing` when not zoomed in.
zoomOut :: ZoomedBoard -> Maybe ZoomedBoard
zoomOut (ZoomedBoard z) = case z.path of
  Nil -> Nothing
  Cons hole rest -> Just (ZoomedBoard { path: rest, focus: plugBoard hole z.focus })

-- | The real board: zoom all the way out.
rebuild :: ZoomedBoard -> Board
rebuild (ZoomedBoard z) = L.foldl (flip plugBoard) z.focus z.path

-- | Where the focus sits, as the `PieceIndex` `Game.Eval` addresses it by
-- | (root first).
focusIndex :: ZoomedBoard -> PieceIndex
focusIndex (ZoomedBoard z) = L.reverse (holeLocation <$> z.path)

_focus :: Lens' ZoomedBoard Board
_focus = lens (\(ZoomedBoard z) -> z.focus) (\(ZoomedBoard z) focus -> ZoomedBoard z { focus = focus })

-- | The ports of the root board, wherever the focus is.
_rootPorts :: Lens' ZoomedBoard (Frame Port)
_rootPorts = lens getter setter
  where
  getter (ZoomedBoard z) = case L.last z.path of
    Nothing -> view _ports z.focus
    Just (BoardHole h) -> h.ports

  setter (ZoomedBoard z) ports = case L.unsnoc z.path of
    Nothing -> ZoomedBoard z { focus = set _ports ports z.focus }
    Just { init, last: BoardHole h } -> ZoomedBoard z { path = L.snoc init (BoardHole h { ports = ports }) }

-- | Run a `BoardM` operation on the focus. A nested focus's ports are then
-- | rederived from the pieces on its edges (`getBoardPorts`), so the parent
-- | sees whatever the sub-board now offers. The root's ports are the level's
-- | goal ports, so they're left alone -- all but its wormhole's sides, which
-- | the goal leaves empty and the pieces on those edges declare.
runAtFocus :: forall a. BoardM a -> ZoomedBoard -> Either BoardError (Tuple a ZoomedBoard)
runAtFocus boardM zoomed =
  map (\focus -> set _focus focus zoomed) <$> runBoardM op (view _focus zoomed)
  where
  op
    | isZoomed zoomed = boardM <* (getBoardPorts >>= assign _ports)
    | otherwise = boardM <* syncWormholePorts
