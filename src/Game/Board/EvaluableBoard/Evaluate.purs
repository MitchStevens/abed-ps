{-
  EVALUABLE BOARD -- EVALUATE

  Runs an `EvaluableBoard` (built by `Game.Board.EvaluableBoard.Build`):

    1. inject the inputs into the input terminals
    2. `eval` each location in `evalOrder`, layer by layer -- locations within a
       layer have no dependency on one another, so they're evaluated in whatever
       order they fold in
    3. extract the outputs from the output terminals

  Per-edge `PortInfo` is recorded in the `State` along the way, for rendering.
  Boards that don't need the internal port info can evaluate more cheaply -- see
  `CompiledBoard`.
-}
module Game.Board.EvaluableBoard.Evaluate
  ( EvaluableM
  , evalWithPortInfo
  , evalWithPortInfoAt
  , evaluableBoardPiece
  , extractOutputs
  , getInputOnEdge
  , getOuterPort
  , getPort
  , injectInputs
  , runEvaluableM
  , toGlobalInputs
  , toLocalInputs
  )
  where

import Prelude

import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.Reader (class MonadReader, ReaderT, asks, runReaderT)
import Control.Monad.State (class MonadState, State, evalState, gets, modify_, runState)
import Data.Foldable (fold, for_, traverse_)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Lens (use, (.=))
import Data.Lens.At (at)
import Data.Map (Map)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap)
import Data.Traversable (for, traverse)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Game.Board.Edge (RelativeEdge(..), edgeDirection, relative)
import Game.Board.EvaluableBoard.Build (EvaluableBoard, terminalLocations)
import Game.Board.TerminalPiece (getTerminalPiecePort, isTerminalInput, isTerminalPiece)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Location (Location)
import Game.Piece (Piece(..), PieceId(..), mkPieceNoAdapt)
import Game.Piece as Complexity
import Game.Port (Port, PortType(..), getPortType, inputPort, isInput, isOutput, matchingPort, outputPort, portCapacity)
import Game.PortInfo (PortInfo)
import Game.Signal (Signal)

type EvaluableM a = ReaderT EvaluableBoard (State (Map RelativeEdge PortInfo)) a

runEvaluableM :: forall a. EvaluableBoard -> EvaluableM a -> Tuple a (Map RelativeEdge PortInfo)
runEvaluableM evaluable evalM = runState (runReaderT evalM evaluable) M.empty

getOuterPort :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m =>
  CardinalDirection -> m (Maybe Signal)
getOuterPort dir = do
  maybeLoc <- asks (terminalLocations >>> M.lookup dir)
  for maybeLoc \loc ->
    maybe zero (_.signal) <$> gets (M.lookup (relative loc Direction.Right))

{-
  Note: you can only set an outer port if the terminal is an input terminal
-}
setOuterPort :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m =>
  CardinalDirection -> Signal -> m Unit
setOuterPort dir signal = void $ runMaybeT do
  loc <- MaybeT $ asks (terminalLocations >>> M.lookup dir)
  piece <- MaybeT $ asks (unwrap >>> _.pieces >>> M.lookup loc)
  when (isTerminalInput piece) do
    port <- MaybeT $ pure (getTerminalPiecePort piece)
    let relEdge = relative loc Direction.Right
    let portInfo = { connected: false, port, signal }
    modify_ (M.insert relEdge portInfo)

evaluableBoardPiece :: EvaluableBoard -> Piece
evaluableBoardPiece evaluable = mkPieceNoAdapt
  { name: PieceId "evaluable"
  , eval: \m -> evalState (runReaderT (evalWithPortInfo m) evaluable) M.empty
  , ports: getPorts evaluable
  , complexity: Complexity.space 0.0

  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

evalWithPortInfo :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => Map CardinalDirection Signal -> m (Map CardinalDirection Signal)
evalWithPortInfo inputs = do
  evalOrder <- asks (unwrap >>> (_.evalOrder))
  injectInputs inputs
  traverse_ (traverse_ evalWithPortInfoAt) evalOrder
  extractOutputs

injectInputs :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => Map CardinalDirection Signal -> m Unit
injectInputs inputs = do
  locs <- asks terminalLocations
  forWithIndex_ locs \dir _ -> do
    for_ (M.lookup dir inputs) \signal -> do
      setOuterPort dir signal

{-
  -- if the edge is set already, return the input edge signal
  -- if the adjacent edge has a signal, copy the signal from the output to the input, return the signal
  -- else, return signal 0
-}
getInputOnEdge :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => RelativeEdge -> Capacity -> m Signal
getInputOnEdge inRelEdge capacity = do
  connections <- asks (unwrap >>> (_.connections))
  case (M.lookup inRelEdge connections) of
    Just outRelEdge -> do
      maybeSignal <- use (at outRelEdge) >>= traverse \{ port, connected, signal} -> do
        --let signal = getClampedSignal info
        at inRelEdge  .= Just { connected: true, signal, port: inputPort  capacity }
        at outRelEdge .= Just { connected: true, signal, port: outputPort capacity }
        pure signal
      pure $ fromMaybe zero maybeSignal
    Nothing -> do
      signal <- maybe zero (_.signal) <$> use (at inRelEdge)
      at inRelEdge .= Just { connected: false, signal: signal, port: inputPort capacity }
      pure signal

evalWithPortInfoAt :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => Location -> m Unit
evalWithPortInfoAt loc = do
  pieces <- asks (unwrap >>> (_.pieces))
  for_ (M.lookup loc pieces) \(Piece p) -> do
    let inputPorts = M.filter isInput p.ports

    inputs <- M.fromFoldable <$>
      forWithIndex inputPorts \dir port ->
        Tuple dir <$> getInputOnEdge (relative loc dir) (portCapacity port)

    -- a `WormholeOut` port is read by the piece like an input, but its signal is
    -- driven by the wormhole buffer (seeded onto the edge before the layer
    -- sweep by `Game.Board.EvaluableBoard.Tick`), not by a neighbour -- so read
    -- it straight off the edge rather than through `getInputOnEdge`.
    let wormholeOutPorts = M.filter (\port -> getPortType port == WormholeOut) p.ports
    wormholeInputs <- forWithIndex wormholeOutPorts \dir _ ->
      maybe zero _.signal <$> use (at (relative loc dir))

    unless (isTerminalPiece (Piece p)) do
      let outputs = p.eval (M.union inputs wormholeInputs)
      -- `WormholeOut` edges keep whatever the buffer seeded them with; every
      -- other output port the piece drives.
      let outputPorts = M.filter (\port -> isOutput port && getPortType port /= WormholeOut) p.ports
      forWithIndex_ outputPorts \dir port -> do
        --let signal = foldMap (ca (portCapacity port)) (M.lookup dir outputs)
        let signal = fold (M.lookup dir outputs)
        at (relative loc dir) .= Just { connected: false, signal, port }

extractOutputs :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => m (Map CardinalDirection Signal)
extractOutputs = M.catMaybes <$> do
    outputPorts <- M.filter isOutput <$> getPorts
    forWithIndex outputPorts \dir port -> do
      getOuterPort dir

getPorts :: forall m. MonadReader EvaluableBoard m => m (Map CardinalDirection Port)
getPorts = do
  pieces <- asks (unwrap >>> _.pieces)
  locs <- asks terminalLocations

  pure $ M.mapMaybe (\loc -> map matchingPort $ M.lookup loc pieces >>= (\(Piece p) -> M.lookup Direction.Right p.ports)) locs

getPort :: forall m. MonadReader EvaluableBoard m => CardinalDirection ->  m (Maybe Port)
getPort dir = do
  pieces <- asks (unwrap >>> _.pieces)
  locs <- asks terminalLocations
  pure $
    M.lookup dir locs
      >>= \loc -> M.lookup loc pieces
      >>= \(Piece p) -> M.lookup Direction.Right p.ports
      <#> matchingPort


toLocalInputs :: forall a. Location -> Map RelativeEdge a -> Map CardinalDirection a
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey edgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: forall a. Location -> Map CardinalDirection a -> Map RelativeEdge a
toGlobalInputs loc = unsafeMapKey (relative loc)
