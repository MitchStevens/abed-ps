{-
  EVALUABLE BOARD -- TICK

  A board that contains a wormhole piece (a piece with a `WormholeOut` port) is
  *sequential*: on each tick the piece reads a value that its `WormholeIn` side
  produced on the *previous* tick. That one-tick-delayed value is the wormhole
  buffer.

  All wormhole buffers -- at every nesting depth -- are owned here, by the one
  root evaluator, in a single flat map keyed by the *instance path*: the
  `List Location` you follow from the root board, through each intervening
  board-as-piece (`EvaluableBoard.subBoards`), to the piece that owns the
  buffer. A wormhole piece sitting directly in the root board is keyed
  `pure loc`; the same piece inside a sub-board at `L` is keyed `L : pure loc`.
  Nesting just makes the key longer; there is still exactly one owner and one
  `tick`.

  One tick (`stepEvaluableBoard`):

    1. seed each `WormholeOut` edge with its buffered signal (`zero` if none)
    2. run the normal layer sweep (`Evaluate.evalWithPortInfoAt`), descending
       into any `subBoards` location with the instance path extended
    3. read each `WormholeIn` edge back off the board -- that is the value the
       buffer will emit next tick, stored against the *opposite* side (the
       `WormholeOut` direction), matching `Game.Piece.Types.stepPiece`

  `runEvaluableBoardTicks` folds a sequence of input frames through the board,
  replacing the buffer with each tick's captures (`buf := buf'`) between frames.
  See docs/wormholes.md section 4.
-}
module Game.Board.EvaluableBoard.Tick
  ( WormholeBuffer
  , stepEvaluableBoard
  , runEvaluableBoardTicks
  )
  where

import Prelude

import Control.Monad.Reader (asks, runReaderT)
import Control.Monad.State (runState)
import Data.Foldable (fold, foldM, foldl)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Lens (use, (.=))
import Data.Lens.At (at)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Game.Board.Edge (relative)
import Game.Board.EvaluableBoard.Build (EvaluableBoard)
import Game.Board.EvaluableBoard.Evaluate (EvaluableM, evalWithPortInfoAt, extractOutputs, getInputOnEdge, injectInputs)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Location (Location)
import Game.Piece (Piece(..))
import Game.Port (PortType(..), getPortType, isInput, isOutput, portCapacity)
import Game.Signal (Signal)

-- | Every wormhole buffer in a nesting tree, keyed by instance path. The inner
-- | map is keyed by the piece's `WormholeOut` direction (the side that emits the
-- | buffered value), same as `Game.Piece.Types.stepPiece`'s state.
type WormholeBuffer = Map (List Location) (Map CardinalDirection Signal)

-- | Advance a board by one tick: given the buffer emitted this tick, return the
-- | board's outputs and the buffer to emit next tick. A board with no wormhole
-- | piece anywhere ignores the buffer and returns an empty one.
stepEvaluableBoard
  :: EvaluableBoard
  -> WormholeBuffer
  -> Map CardinalDirection Signal
  -> Tuple (Map CardinalDirection Signal) WormholeBuffer
stepEvaluableBoard board buffer inputs = runTick board Nil buffer inputs

-- | Run one tick of `board` at instance path `path`, sharing `buffer`, in its
-- | own fresh `PortInfo` state (nested boards don't share the parent's -- their
-- | local `Location`s would collide -- only the path-keyed buffer threads
-- | through). Returns the board's outputs and every capture at or below it.
runTick
  :: EvaluableBoard
  -> List Location
  -> WormholeBuffer
  -> Map CardinalDirection Signal
  -> Tuple (Map CardinalDirection Signal) WormholeBuffer
runTick board path buffer inputs =
  case runState (runReaderT (tickAt path buffer inputs) board) M.empty of
    Tuple result _ -> result

-- | Fold input frames through the board, one output frame per tick, replacing
-- | the buffer with each tick's captures between frames. The buffer starts
-- | empty, so a `WormholeOut` emits `zero` on frame 0.
runEvaluableBoardTicks
  :: EvaluableBoard
  -> Array (Map CardinalDirection Signal)
  -> Array (Map CardinalDirection Signal)
runEvaluableBoardTicks board frames =
  case foldl step (Tuple [] M.empty) frames of
    Tuple outputs _ -> outputs
  where
  step (Tuple outs buffer) inputs =
    case stepEvaluableBoard board buffer inputs of
      Tuple out captures -> Tuple (outs <> [ out ]) captures

-- | One tick of the board reached by `path`, sharing the whole-tree `buffer`.
-- | Returns this board's outputs and every capture produced at or below it.
tickAt
  :: List Location
  -> WormholeBuffer
  -> Map CardinalDirection Signal
  -> EvaluableM (Tuple (Map CardinalDirection Signal) WormholeBuffer)
tickAt path buffer inputs = do
  injectInputs inputs
  seedWormholeOuts path buffer
  evalOrder <- asks (unwrap >>> _.evalOrder)
  nestedCaptures <- foldM
    (\acc layer -> foldM (\acc' loc -> M.union acc' <$> evalLocation path buffer loc) acc layer)
    M.empty
    evalOrder
  outputs <- extractOutputs
  ownCaptures <- captureWormholeIns path
  pure (Tuple outputs (M.union ownCaptures nestedCaptures))

-- | Evaluate one location. A plain piece goes through the normal sweep and
-- | produces no captures here (`captureWormholeIns` collects those). A
-- | `subBoards` location runs the nested board for this tick with the instance
-- | path extended, wires its outputs onto this board's edges, and hands back the
-- | captures from that whole subtree.
evalLocation
  :: List Location
  -> WormholeBuffer
  -> Location
  -> EvaluableM WormholeBuffer
evalLocation path buffer loc = do
  subBoards <- asks (unwrap >>> _.subBoards)
  case M.lookup loc subBoards of
    Nothing -> do
      evalWithPortInfoAt loc
      pure M.empty
    Just subBoard -> do
      pieces <- asks (unwrap >>> _.pieces)
      case M.lookup loc pieces of
        Nothing -> pure M.empty
        Just (Piece p) -> do
          subInputs <- M.fromFoldable <$>
            forWithIndex (M.filter isInput p.ports) \dir port ->
              Tuple dir <$> getInputOnEdge (relative loc dir) (portCapacity port)
          let Tuple subOutputs subCaptures = runTick subBoard (path <> L.singleton loc) buffer subInputs
          forWithIndex_ (M.filter isOutput p.ports) \dir port -> do
            let signal = fold (M.lookup dir subOutputs)
            at (relative loc dir) .= Just { connected: false, signal, port }
          pure subCaptures

-- | Write each wormhole piece's buffered signal onto its `WormholeOut` edge, so
-- | the sweep reads it like any other edge value. `zero` when the buffer has no
-- | entry (nothing captured yet, or no wormhole here).
seedWormholeOuts :: List Location -> WormholeBuffer -> EvaluableM Unit
seedWormholeOuts path buffer = do
  pieces <- asks (unwrap >>> _.pieces)
  forWithIndex_ pieces \loc (Piece p) ->
    forWithIndex_ (M.filter (\port -> getPortType port == WormholeOut) p.ports) \dir port -> do
      let signal = fold (M.lookup (path <> L.singleton loc) buffer >>= M.lookup dir)
      at (relative loc dir) .= Just { connected: true, signal, port }

-- | After the sweep, read each wormhole piece's `WormholeIn` edge -- the value
-- | that side produced this tick -- and store it against the opposite
-- | (`WormholeOut`) side, keyed by instance path. That is next tick's buffer.
captureWormholeIns :: List Location -> EvaluableM WormholeBuffer
captureWormholeIns path = do
  pieces <- asks (unwrap >>> _.pieces)
  entries <- forWithIndex pieces \loc (Piece p) -> do
    let wormholeOutPorts = M.filter (\port -> getPortType port == WormholeOut) p.ports
    captured <- forWithIndex wormholeOutPorts \outDir _ -> do
      let inDir = oppositeDirection outDir
      case M.lookup inDir p.ports of
        Just inPort | getPortType inPort == WormholeIn -> do
          sig <- maybe zero _.signal <$> use (at (relative loc inDir))
          pure (Just sig)
        _ -> pure Nothing
    pure (Tuple (path <> L.singleton loc) (M.catMaybes captured))
  pure
    $ M.fromFoldable
    $ L.filter (\(Tuple _ m) -> not (M.isEmpty m))
    $ M.values entries
