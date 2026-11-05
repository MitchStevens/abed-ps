{-
  Step 1 of compiling a `Board` to a netlist: erase the nesting.

  `flatten` walks the `Free BoardF` once, top-down, and reports everything
  later passes need in terms of global `PortIndex`es only -- no `Location`
  arithmetic, rotations or nested boards survive past this module:

    - `leaves`: every leaf `Piece`, by its path from the root.
    - `links`: pairs of ports that carry the *same* signal. Two kinds:
        * a neighbour link, between an `Output` and the matching `Input` facing
          it at one board level (always written writer first), and
        * a side alias, between a board's own side `(path, side)` and the port
          of the piece just inside that side that backs it.
      A nested board's sides are real `PortIndex`es too, so a signal crossing
      into a nested board is two links: outer neighbour -> board side, board
      side -> inner piece. Union-find over `links` (step 2) gives the nets.
    - `registers`: one-tick delays, mouth -> tail. Both a board's own
      `wormhole` and a leaf piece's `WormholeIn`/`WormholeOut` pair end up
      here, and look identical from now on.
    - `boundary`: the root's harness-facing ports, each addressed `(Nil, side)`.

  A board side attaches to the piece at the middle of that edge -- the same
  cell `Game.Board.Query.getBoardEdges` uses. Boards are odd-sized precisely so
  every side has a middle cell, so an even-sized board is a `BadBoardSize`
  rather than a guess at which cell to use. A side attaches only when that piece's port
  facing the side is exactly the side's declared `Port`. A wormhole side is
  declared like any other side (`Output` at the mouth, `Input` at the tail),
  but is never visible from outside: the parent sees `noPort` there, and the
  harness never drives or reads it.
-}
module Game.Eval.Flatten
  ( Flat
  , Leaf
  , Link
  , Parts
  , Register
  , flatten
  , outerPorts
  , sideLocation
  ) where

import Prelude

import Control.Alternative (guard)
import Data.Either (Either(..))
import Data.Int (even)
import Data.Foldable (fold)
import Data.Group (ginverse)
import Data.List (List(..))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.TraversableWithIndex (traverseWithIndex)
import Data.Tuple (Tuple(..))
import Game.Board.Types (Board, BoardError(..), BoardF(..), resumeBoard)
import Game.Direction (CardinalDirection, oppositeDirection, rotateDirection)
import Game.Direction as Direction
import Game.Frame (Frame, PieceIndex, PortIndex)
import Game.Frame as Frame
import Game.Location (Location, followDirection, location)
import Game.Piece (Piece, getPorts, getWormhole)
import Game.Port (Port, hasPort, isOutput, noPort, portMatches)
import Game.Rotation (Rotation)

type NetListMemoryMapping =
  { portIndex :: List (Tuple PortIndex Int)
  , largestUnused :: Int }



type Leaf = { index :: PieceIndex, piece :: Piece }

-- | Two ports carrying the same signal. Unordered as far as nets go; neighbour
-- | links happen to be written writer first, side aliases board side first.
type Link = Tuple PortIndex PortIndex

-- | `tail` emits, this tick, whatever `mouth` held at the end of last tick.
type Register = { mouth :: PortIndex, tail :: PortIndex }

-- | What one subtree contributes. A record of `List`s, so it's a `Monoid`
-- | and subtrees combine with `fold`.
type Parts =
  { leaves :: List Leaf
  , links :: List Link
  , registers :: List Register
  }

type Flat =
  { leaves :: List Leaf
  , links :: List Link
  , registers :: List Register
  , boundary :: Frame Port
  }

flatten :: Board -> Either BoardError Flat
flatten board = case resumeBoard board of
  -- a bare piece at the root: its own ports are the boundary, already
  -- addressed `(Nil, side)`, so no aliases are needed
  Right piece -> Right
    { leaves: L.singleton { index: Nil, piece }
    , links: Nil
    , registers: pieceRegisters Nil piece
    , boundary: getPorts piece
    }
  Left boardF -> do
    { leaves, links, registers } <- flattenBoard Nil boardF
    pure { leaves, links, registers, boundary: outerPorts boardF }

flattenBoard :: PieceIndex -> BoardF Board -> Either BoardError Parts
flattenBoard path boardF@(BoardF b) = do
  when (even b.size || b.size < 1) do
    Left (BadBoardSize b.size)
  ownRegisters <- boardRegisters path boardF
  children <- traverseWithIndex child b.pieces
  pure $ fold children <>
    { leaves: Nil
    , links: neighbourLinks <> sideAliases
    , registers: ownRegisters
    }
  where
  at :: Location -> PieceIndex
  at loc = path <> L.singleton loc

  child :: Location -> { rotation :: Rotation, piece :: Board } -> Either BoardError Parts
  child loc { piece: cell } = case resumeBoard cell of
    Right piece -> Right
      { leaves: L.singleton { index: at loc, piece }
      , links: Nil
      , registers: pieceRegisters (at loc) piece
      }
    Left inner -> flattenBoard (at loc) inner

  -- every `Output` at this level matched by an `Input` facing back at it
  neighbourLinks :: List Link
  neighbourLinks = do
    Tuple loc { rotation, piece: cell } <- M.toUnfoldable b.pieces
    Tuple dir port <- Frame.toListWithIndex (cellPorts cell)
    guard (isOutput port)
    let
      absDir = rotateDirection dir rotation
      adjLoc = followDirection loc absDir
    { rotation: adjRotation, piece: adjCell } <- L.fromFoldable (M.lookup adjLoc b.pieces)
    let adjDir = rotateDirection (oppositeDirection absDir) (ginverse adjRotation)
    guard (portMatches port (Frame.index adjDir (cellPorts adjCell)))
    pure (Tuple (Tuple (at loc) dir) (Tuple (at adjLoc) adjDir))

  -- each declared side of this board, to the port just inside it
  sideAliases :: List Link
  sideAliases = do
    Tuple side port <- Frame.toListWithIndex b.ports
    guard (hasPort port)
    let loc = sideLocation b.size side
    { rotation, piece: cell } <- L.fromFoldable (M.lookup loc b.pieces)
    let dir = rotateDirection side (ginverse rotation)
    guard (Frame.index dir (cellPorts cell) == port)
    pure (Tuple (Tuple path side) (Tuple (at loc) dir))

-- | What a cell presents to its neighbours: a leaf's own ports, or a nested
-- | board's declared ones (minus its wormhole sides).
cellPorts :: Board -> Frame Port
cellPorts cell = case resumeBoard cell of
  Right piece -> getPorts piece
  Left boardF -> outerPorts boardF

-- | A board's declared ports as seen from outside: a wormhole side is wired
-- | back into the board itself, so it's `noPort` to everyone else.
outerPorts :: BoardF Board -> Frame Port
outerPorts (BoardF b) = case b.wormhole of
  Nothing -> b.ports
  Just { wormholeIn, wormholeOut } ->
    Frame.set wormholeIn noPort (Frame.set wormholeOut noPort b.ports)

-- | The cell just inside `side` of a `size`-wide board -- see
-- | `Game.Board.Query.getBoardEdges`.
sideLocation :: Int -> CardinalDirection -> Location
sideLocation n = case _ of
  Direction.Up    -> location (n `div` 2) 0
  Direction.Right -> location (n - 1)     (n `div` 2)
  Direction.Down  -> location (n `div` 2) (n - 1)
  Direction.Left  -> location 0           (n `div` 2)

-- | A board's own wormhole, between its two sides. Like any mismatched port
-- | pair, a mouth that isn't an `Output` matching the tail's `Input` just
-- | doesn't propagate (no register) rather than being an error.
boardRegisters :: PieceIndex -> BoardF Board -> Either BoardError (List Register)
boardRegisters path (BoardF b) = case b.wormhole of
  Nothing -> Right Nil
  Just w
    | w.wormholeIn == w.wormholeOut -> Left (WormholeInvalid w)
    | portMatches (Frame.index w.wormholeIn b.ports) (Frame.index w.wormholeOut b.ports) ->
        Right (L.singleton { mouth: Tuple path w.wormholeIn, tail: Tuple path w.wormholeOut })
    | otherwise -> Right Nil

pieceRegisters :: PieceIndex -> Piece -> List Register
pieceRegisters index piece = maybe Nil pure do
  { wormholeIn, wormholeOut } <- getWormhole piece
  Just { mouth: Tuple index wormholeIn, tail: Tuple index wormholeOut }
