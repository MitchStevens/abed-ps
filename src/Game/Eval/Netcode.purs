{-
  Running a `Netlist` (see `Game.Eval.Netlist`).

  The whole board's state is one `Array Signal`, indexed by slot. It's kept
  between ticks: a register's tail slot *is* that wormhole's buffer, so there's
  no separate buffer to thread, and resetting the board is `initialSignals`.

  One tick:

    1. write the harness inputs into their slots
    2. run every gate, in order: read its input slots, `Operation.eval`, write
       its output slots
    3. read the harness outputs
    4. copy every register's mouth into its tail, ready for next tick

  Step 4 reads *every* mouth before writing *any* tail. A tail and another
  wormhole's mouth can be the same net (an inner board's tail wired straight
  to the outer board's mouth); copying one register at a time would let a
  value through both in a single tick.
-}
module Game.Eval.Netcode
  ( boundaryPortInfo
  , evaluate
  , initialSignals
  , portInfo
  , run
  , step
  , tick
  ) where

import Prelude

import Control.Monad.ST (ST)
import Control.Monad.ST as ST
import Data.Array as A
import Data.Array.ST (STArray)
import Data.Array.ST as STA
import Data.Foldable (for_, sequence_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..))
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Traversable (for, traverse)
import Data.Tuple (Tuple(..), fst)
import Game.Eval.Netlist (Netlist)
import Game.Frame (Frame, PortIndex)
import Game.Piece.Operation as Operation
import Game.Port (Port, hasPort)
import Game.PortInfo (PortInfo, noPortInfo)
import Game.Signal (Signal)

-- | Every slot `zero`: the state before the first tick, wormholes empty.
initialSignals :: Netlist -> Array Signal
initialSignals netlist = A.replicate netlist.slotCount zero

-- | One tick, in place, returning the harness outputs.
tick :: forall h. Netlist -> Frame Signal -> STArray h Signal -> ST h (Frame Signal)
tick netlist inputs signals = do
  sequence_ (write <$> netlist.inputSlots <*> inputs)
  for_ netlist.gates \gate -> do
    ins <- traverse read gate.inputs
    sequence_ (write <$> gate.outputs <*> Operation.eval gate.op ins)
  outputs <- traverse read netlist.outputSlots
  captured <- for netlist.registers \{ mouth } -> read mouth
  for_ (A.zip netlist.registers captured) \(Tuple { tail } signal) -> write tail signal
  pure outputs
  where
  read slot = fromMaybe zero <$> STA.peek slot signals
  write slot signal = void (STA.poke slot signal signals)

-- | `tick`, purely: this tick's outputs, and the state to start the next from.
step :: Netlist -> Frame Signal -> Array Signal -> Tuple (Frame Signal) (Array Signal)
step netlist inputs signals = ST.run do
  st <- STA.thaw signals
  outputs <- tick netlist inputs st
  Tuple outputs <$> STA.unsafeFreeze st

-- | A whole test case, one frame per tick, from empty wormholes.
run :: Netlist -> Array (Frame Signal) -> Array (Frame Signal)
run netlist frames = ST.run do
  st <- STA.thaw (initialSignals netlist)
  traverse (\inputs -> tick netlist inputs st) frames

-- | A single tick from empty wormholes -- all a combinational board needs.
evaluate :: Netlist -> Frame Signal -> Frame Signal
evaluate netlist inputs = fst (step netlist inputs (initialSignals netlist))

-- | What `port`, at `idx`, currently carries. It's connected when anything
-- | else shares its net.
portInfo :: Netlist -> Array Signal -> PortIndex -> Port -> PortInfo
portInfo netlist signals idx port
  | not (hasPort port) = noPortInfo
  | otherwise = case M.lookup idx netlist.portSlot of
      Nothing -> { port, connected: false, signal: zero }
      Just slot ->
        { port
        , connected: fromMaybe 0 (A.index netlist.netSize slot) > 1
        , signal: fromMaybe zero (A.index signals slot)
        }

-- | `portInfo` for each of the root's own sides.
boundaryPortInfo :: Netlist -> Array Signal -> Frame PortInfo
boundaryPortInfo netlist signals =
  netlist.boundary # mapWithIndex \side port -> portInfo netlist signals (Tuple Nil side) port
