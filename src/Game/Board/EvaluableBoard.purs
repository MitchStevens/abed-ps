{-
  EVALUABLE BOARD

  A `Board` represents operations on the board in the game: adding pieces, rotating pieces, etc. However this representation is not good for evaluation. To evaluate a board, it is first transformed into an `EvaluableBoard`, which *can* be evaluated and has a `Piece` instance.

  An `EvaluatableBoard` also generates information about the states of ports which is used in rendering. Generating extra information has an overhead cost, for the evaluation of board that don't need to provide internal port information, use `CompiledBoard` for better performance.
-}

module Game.Board.EvaluableBoard where

import Data.Lens
import Prelude

import Control.Monad.Error.Class (class MonadError, throwError)
import Control.Monad.State (class MonadState, State, evalState, evalStateT)
import Data.Either (Either, note)
import Data.FoldableWithIndex (forWithIndex_)
import Data.HeytingAlgebra (ff)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.List (List(..), find, fold, foldMap)
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Traversable (for, for_, traverse, traverse_)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Debug (debugger, trace)
import Game.Board (Board(..), RelativeEdge(..), absolute, relative, relativeEdgeLocation)
import Game.Board as Board
import Game.Board.Operation (BoardError(..))
import Game.Board.PortInfo (PortInfo, getClampedSignal)
import Game.Board.PseudoPiece (isPseudoPiece, psuedoPiece)
import Game.Board.Query (adjacentRelativeEdge, buildConnectionMap, getBoardEdgePseudoLocation, getPortOnEdge, toRelativeEdge)
import Game.Direction (CardinalDirection, allDirections, clockwiseRotation, oppositeDirection)
import Game.Direction as Direction
import Game.Location (Location(..), followDirection)
import Game.Piece (class Piece, APiece, Capacity, PieceId(..), Port(..), clampSignal, eval, getPorts, inputPort, isInput, isOutput, matchingPort, name, outputPort, portCapacity, portType, shouldRipple)
import Game.Piece as Port
import Game.Signal (Signal(..))
import Halogen.Svg.Attributes (m)

newtype EvaluableBoard = EvaluableBoard
  { pieces :: Map Location APiece
  -- maps input relEdges to output relEdges
  , connections :: Map RelativeEdge RelativeEdge
  -- topologically sorted list of locations
  , evalOrder :: List Location
  , ports :: Map CardinalDirection Port
  , portLocations :: Map CardinalDirection RelativeEdge
  }
derive instance Newtype EvaluableBoard _
derive instance Eq EvaluableBoard
instance Show EvaluableBoard where
  show (EvaluableBoard evaluable) = show evaluable

toEvaluableBoard :: Board -> Either BoardError EvaluableBoard
toEvaluableBoard board = evalStateT (buildEvaluableBoard Nothing) board

buildEvaluableBoard :: forall m. MonadState Board m => MonadError BoardError m
  => Maybe (Map CardinalDirection Port) -> m EvaluableBoard
buildEvaluableBoard maybePorts = do

  ports <-
    case maybePorts of
      Nothing ->
        M.catMaybes <<< M.fromFoldable <$>
          for allDirections \dir -> do
            loc <- getBoardEdgePseudoLocation dir
            relEdge <- toRelativeEdge (absolute loc (oppositeDirection dir)) >>= adjacentRelativeEdge
            maybePort <- getPortOnEdge relEdge
            pure (Tuple dir maybePort)
      Just p -> pure p

  portLocations <- M.fromFoldable <$>
    for (M.toUnfoldable ports :: List _) \(Tuple dir port) -> do
      loc <- getBoardEdgePseudoLocation dir
      pure (Tuple dir (relative loc Direction.Right))

  {- 
    add psuedo pieces to board when building connection map
  -}

  --for_ (M.toUnfoldable ports :: List _) \(Tuple dir port) -> do
  forWithIndex_ ports \dir port -> do
    loc <- getBoardEdgePseudoLocation dir
    let rotation = clockwiseRotation Direction.Left dir
    Board._pieces <<< at loc .= Just { piece: psuedoPiece (matchingPort port), rotation }
  connections <- buildConnectionMap

  pieces <- map (_.piece) <$> use Board._pieces
  locations <- L.fromFoldable <<< M.keys <$> use Board._pieces
  evalOrder <- maybe (throwError Cyclic) pure (topologicalSort locations connections)

  pure $ EvaluableBoard { pieces, connections, evalOrder, ports, portLocations }

-- very simple but maybe not effceient, this is fine for small n
-- https://gist.github.com/rinse/8c4266ba7cef050a109f42b082782b59
topologicalSort :: List Location -> Map RelativeEdge RelativeEdge -> Maybe (List Location)
topologicalSort Nil _ = Just Nil
topologicalSort nodes edges = do
  let doesntAcceptOutput loc = M.isEmpty $ M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) edges
  r <- find doesntAcceptOutput nodes -- find that first location that has an input but doesn't accept output from anwhere else
  
  let nodes' = L.delete r nodes
      edges' = M.filterWithKey (\k v -> relativeEdgeLocation v /= r) edges
  Cons r <$> topologicalSort nodes' edges'


instance Piece EvaluableBoard where
  name _ = PieceId "evaluable"
  -- finish this
  eval evaluable inputs = flip evalState M.empty do
    injectInputs evaluable inputs
    evalWithPortInfo evaluable inputs
  shouldRipple _ = false
  getCapacity _ = Nothing
  updateCapacity _ _ _ = Nothing
  getPorts (EvaluableBoard evaluable) = evaluable.ports
  -- todo: do this later maybe? do i actually ned this?
  updatePort _ _ _ = Nothing


evalWithPortInfo :: forall m. MonadState (Map RelativeEdge PortInfo) m 
  => EvaluableBoard -> Map CardinalDirection Signal -> m (Map CardinalDirection Signal)
evalWithPortInfo board@(EvaluableBoard evaluable) inputs = do
  injectInputs board inputs
  traverse_ (evalWithPortInfoAt board) evaluable.evalOrder
  extractOutputs board

injectInputs :: forall m. MonadState (Map RelativeEdge PortInfo) m
  => EvaluableBoard -> Map CardinalDirection Signal -> m Unit
injectInputs (EvaluableBoard evaluable) inputs = do
  forWithIndex_ evaluable.ports \dir port -> do
    when (isInput port) do
      for_ (M.lookup dir evaluable.portLocations) \relEdge -> do
        let signal = foldMap (clampSignal (portCapacity port)) (M.lookup dir inputs)
        at relEdge .= Just { port: matchingPort port, connected: false, signal }

getInputOnEdge :: forall m. MonadState (Map RelativeEdge PortInfo) m
  => EvaluableBoard -> RelativeEdge -> Capacity -> m Signal
getInputOnEdge (EvaluableBoard evaluable) inRelEdge capacity = do
  case (M.lookup inRelEdge evaluable.connections) of
    Just outRelEdge -> do
      maybeSignal <- use (at outRelEdge) >>= traverse \info -> do
        let signal = getClampedSignal info
        at inRelEdge  .= Just { connected: true, signal: signal, port: inputPort  capacity }
        at outRelEdge .= Just { connected: true, signal: signal, port: outputPort capacity }
        pure signal
      pure $ fromMaybe (Signal 0) maybeSignal
    Nothing -> do
      at inRelEdge .= Just { connected: false, signal: Signal 0, port: inputPort capacity }
      pure (Signal 0)

evalWithPortInfoAt :: forall m. MonadState (Map RelativeEdge PortInfo) m
  => EvaluableBoard -> Location -> m Unit
evalWithPortInfoAt board@(EvaluableBoard evaluable) loc = do
  for_ (M.lookup loc evaluable.pieces) \piece -> do
    let ports = getPorts piece
    let inputPorts = M.filter isInput ports

    inputs <- M.fromFoldable <$>
      forWithIndex inputPorts \dir port ->
        Tuple dir <$> getInputOnEdge board (relative loc dir) (portCapacity port)
        
    -- don't evaluate psuedo pieces
    unless (isPseudoPiece piece) do
      --trace (show (name piece) <> ": " <> show loc <> " --> " <> show inputs) \_ -> pure unit
      let outputs = eval piece inputs
      let outputPorts  = M.filter isOutput ports
      forWithIndex_ outputPorts \dir port -> do
        let signal = foldMap (clampSignal (portCapacity port)) (M.lookup dir outputs)
        at (relative loc dir) .= Just { connected: false, signal, port }

extractOutputs :: forall m. MonadState (Map RelativeEdge PortInfo) m
  => EvaluableBoard -> m (Map CardinalDirection Signal)
extractOutputs (EvaluableBoard evaluable) = M.fromFoldable <$> do
    let outputPorts = M.filter isOutput evaluable.ports
    forWithIndex outputPorts \dir port -> do
      maybeSignal <- join <$> for (M.lookup dir evaluable.portLocations) \relEdge -> do
        map (_.signal) <$> use (at relEdge)
      pure $ Tuple dir (fromMaybe (Signal 0) maybeSignal)

















