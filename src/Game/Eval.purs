-- | Compiling and running a `Board`: `compile` it once into a `Netlist`, then
-- | `step` it a tick at a time (or `run` a whole test case). See
-- | `Game.Eval.Netlist` for the compiler passes, `Game.Eval.Netcode` for the
-- | runtime.
module Game.Eval
  ( module Game.Eval.Netlist
  , module Game.Eval.Netcode
  , module Game.Frame
  ) where

import Game.Eval.Netcode (boundaryPortInfo, evaluate, initialSignals, portInfo, restoreState, run, saveState, step, tick)
import Game.Eval.Netlist (Netlist, SlotRegister, compile)
import Game.Frame (PieceIndex, PortIndex)
