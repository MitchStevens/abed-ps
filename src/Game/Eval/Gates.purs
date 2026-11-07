{-
  Steps 3 and 4 of compiling a `Board` to a netlist: turn every piece that
  still needs evaluating into a `Gate`, then put the gates in an order where
  each one runs after everything it reads from.

  A gate addresses the signal array directly, by slot. Truncation (see
  `Game.Piece.Types.truncateInputs`/`truncateOutputs`) is decided here, once,
  by which slot each side points at, rather than on every tick:

    - an `Input` side reads its port's net; every other side reads `zeroSlot`.
    - an `Output` side writes its port's net; every other side writes
      `scratchSlot`.

  So evaluating a gate is just `outputs <- Operation.eval op inputs`, with no
  checks. Wire pieces are already merged into their nets (`Game.Eval.Nets`),
  so they never become gates.

  Gate `g` depends on gate `h` when `g` reads a net `h` writes. A register's
  tail is written between ticks, not by a gate, so a wormhole adds no
  dependency -- that's what makes it a cut in the graph. Anything left over
  once no gate is ready is on a cycle: `Cyclic`.
-}
module Game.Eval.Gates
  ( Gate
  , gates
  , orderGates
  ) where

import Prelude

import Control.Alternative (guard)
import Data.Array as A
import Data.Either (Either(..))
import Data.Foldable (foldl)
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Board.Types (BoardError(..))
import Game.Eval.Flatten (Flat)
import Game.Eval.Nets (Nets, scratchSlot, wireConnections, zeroSlot)
import Game.Frame (Frame, PieceIndex)
import Game.Piece (Piece(..), getPorts)
import Game.Piece.Operation (PieceOperation)
import Game.Port (isInput, isOutput)

type Gate =
  { index :: PieceIndex -- the piece this came from, for debugging and rendering
  , op :: PieceOperation
  , inputs :: Frame Int
  , outputs :: Frame Int
  }

-- | One gate per non-wire leaf, in leaf order.
gates :: Flat -> Nets -> Array Gate
gates flat ns = A.fromFoldable do
  { index, piece } <- flat.leaves
  guard (wireConnections piece == Nothing)
  let
    Piece p = piece
    slotAt dir = M.lookup (Tuple index dir) ns.portSlot
  pure
    { index
    , op: p.op
    , inputs: getPorts piece # mapWithIndex \dir port ->
        if isInput port then fromMaybe zeroSlot (slotAt dir) else zeroSlot
    , outputs: getPorts piece # mapWithIndex \dir port ->
        if isOutput port then fromMaybe scratchSlot (slotAt dir) else scratchSlot
    }

-- | `gates` in dependency order (Kahn's algorithm): every gate after all the
-- | gates whose outputs it reads. Ties go to the earlier gate, so the order is
-- | deterministic. `Cyclic` if some gates depend, however indirectly, on
-- | themselves.
orderGates :: Array Gate -> Either BoardError (Array Gate)
orderGates gs = go ready0 indegree0 Nil
  where
  ids :: Array Int
  ids = A.mapWithIndex const gs

  -- the gate that writes each net
  writerOf :: Map Int Int
  writerOf = M.fromFoldable do
    Tuple i g <- L.fromFoldable (A.mapWithIndex Tuple gs)
    slot <- L.fromFoldable g.outputs
    guard (slot /= scratchSlot)
    pure (Tuple slot i)

  dependencies :: Int -> S.Set Int
  dependencies i = case A.index gs i of
    Nothing -> S.empty
    Just g -> S.fromFoldable (L.mapMaybe (\slot -> M.lookup slot writerOf) (L.fromFoldable g.inputs))

  -- each gate, to the gates that read something it writes
  dependents :: Map Int (List Int)
  dependents = M.fromFoldableWith (flip (<>)) do
    i <- L.fromFoldable ids
    h <- L.fromFoldable (dependencies i)
    pure (Tuple h (L.singleton i))

  indegree0 :: Map Int Int
  indegree0 = M.fromFoldable (ids <#> \i -> Tuple i (S.size (dependencies i)))

  ready0 :: List Int
  ready0 = L.fromFoldable (A.filter (\i -> M.lookup i indegree0 == Just 0) ids)

  go :: List Int -> Map Int Int -> List Int -> Either BoardError (Array Gate)
  go Nil _ done
    | L.length done == A.length gs = Right (A.mapMaybe (A.index gs) (A.reverse (A.fromFoldable done)))
    | otherwise = Left Cyclic
  go (i : rest) indegree done =
    case foldl release (Tuple indegree Nil) (fromMaybe Nil (M.lookup i dependents)) of
      Tuple indegree' newlyReady -> go (L.sort (rest <> newlyReady)) indegree' (i : done)

  -- `j` has one fewer dependency left to run; collect it once it has none
  release :: Tuple (Map Int Int) (List Int) -> Int -> Tuple (Map Int Int) (List Int)
  release (Tuple deg acc) j =
    let d = fromMaybe 0 (M.lookup j deg) - 1
    in Tuple (M.insert j d deg) (if d == 0 then j : acc else acc)
