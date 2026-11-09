{-
  Step 5 of compiling a `Board`: put the passes together.

    flatten   (Game.Eval.Flatten)  nesting erased, everything a `PortIndex`
    nets      (Game.Eval.Nets)     ports sharing a signal share a slot
    gates     (Game.Eval.Gates)    pieces to evaluate, addressed by slot
    orderGates                     ... in dependency order, or `Cyclic`

  A `Netlist` is all slot numbers: running it (`Game.Eval.Netcode`) never
  touches a `Location`, `Port` or `Map`. The maps that remain (`portSlot`) are
  only for asking about a particular port afterwards, e.g. to render it.

  The harness's view of the board is `inputSlots`/`outputSlots`, one slot per
  root side, chosen so `Netcode.tick` needn't check port types: a side that
  isn't a declared `Input` writes its input to `scratchSlot`, and a side that
  isn't a declared `Output` reads `zeroSlot`.
-}
module Game.Eval.Netlist
  ( Netlist
  , SlotRegister
  , compile
  ) where

import Prelude

import Data.Array as A
import Data.Either (Either)
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..), (:))
import Data.Set (Set)
import Data.Set as S
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Board.Types (Board, BoardError)
import Game.Eval.Flatten (flatten)
import Game.Eval.Gates (Gate, gates, orderGates)
import Game.Eval.Nets (nets, scratchSlot, zeroSlot)
import Game.Frame (Frame, PortIndex)
import Game.Port (Port, isInput, isOutput)

-- | A wormhole, by slot: `tail` takes `mouth`'s value between ticks. `key` is
-- | the tail's `PortIndex`: unlike slot numbers it survives recompiling an
-- | edited board, so it's what a wormhole's state is saved under (see
-- | `Netcode.saveState`).
type SlotRegister = { mouth :: Int, tail :: Int, key :: PortIndex }

type Netlist =
  { slotCount :: Int
  , gates :: Array Gate -- dependency order
  , registers :: Array SlotRegister
  , boundary :: Frame Port -- the root's harness-facing ports
  , inputSlots :: Frame Int
  , outputSlots :: Frame Int
  , portSlot :: Map PortIndex Int
  -- every port that meets another port across an edge: a neighbour's, or a
  -- board side. Not the same as sharing a net -- a wire's two ends always
  -- share one, whether or not anything is plugged into either.
  , linked :: Set PortIndex
  }

compile :: Board -> Either BoardError Netlist
compile board = do
  flat <- flatten board
  ns <- nets flat
  ordered <- orderGates (gates flat ns)
  let
    slotOf idx = M.lookup idx ns.portSlot
    sideSlot side = slotOf (Tuple Nil side)
  pure
    { slotCount: ns.slotCount
    , gates: ordered
    , registers: A.fromFoldable flat.registers # A.mapMaybe \{ mouth, tail } ->
        { mouth: _, tail: _, key: tail } <$> slotOf mouth <*> slotOf tail
    , boundary: flat.boundary
    , inputSlots: flat.boundary # mapWithIndex \side port ->
        if isInput port then fromMaybe scratchSlot (sideSlot side) else scratchSlot
    , outputSlots: flat.boundary # mapWithIndex \side port ->
        if isOutput port then fromMaybe zeroSlot (sideSlot side) else zeroSlot
    , portSlot: ns.portSlot
    , linked: S.fromFoldable (flat.links >>= \(Tuple a b) -> a : b : Nil)
    }
