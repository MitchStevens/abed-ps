{-
  EVALUABLE BOARD

  A `Board` represents operations on the board in the game: adding pieces, rotating pieces, etc. However this representation is not good for evaluation. To evaluate a board, it is first transformed into an `EvaluableBoard`, which *can* be evaluated and has a `Piece` instance.

  An `EvaluatableBoard` also generates information about the states of ports which is used in rendering. Generating extra information has an overhead cost, for the evaluation of board that don't need to provide internal port information, use `CompiledBoard` for better performance.
-}

module Game.Board.Evaluable
  ( EvaluableBoard(..)
  , EvaluableM
  , buildEvaluableBoard
  , evalWithPortInfo
  , evalWithPortInfoAt
  , evaluableBoardPiece
  , extractOutputs
  , getInputOnEdge
  , getOuterPort
  , getPort
  , getPortInfo
  , injectInputs
  , runEvaluableM
  , toEvaluableBoard
  , toGlobalInputs
  , toLocalInputs
  , topologicalSort
  )
  where

import Prelude

import Control.Monad.Error.Class (class MonadError, throwError)
import Control.Monad.Except (runExcept)
import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.Reader (class MonadReader, ReaderT(..), ask, asks, runReaderT)
import Control.Monad.State (class MonadState, State, evalState, evalStateT, gets, modify_, runState)
import Control.Monad.Writer (execWriter, runWriter, tell)
import Data.Either (Either)
import Data.FoldableWithIndex (forWithIndex_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens (use, (.=))
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.List (List(..), find, fold)
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.First (First(..))
import Data.Monoid.Disj (Disj(..))
import Data.Newtype (class Newtype, unwrap)
import Data.Set as S
import Data.Traversable (for, for_, traverse, traverse_)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Game.Board.Edge (InputEdge(..), OutputEdge(..), RelativeEdge(..), edgeDirection, edgeLocation, inputEdge, relative)
import Game.Board.PseudoPiece (getPsuedoPiecePort, isPseudoInput, isPseudoPiece, psuedoPiece)
import Game.Board.Query (buildConnectionMap, getBoardEdgePseudoLocation, getBoardPorts)
import Game.Board.Types (Board, BoardError(..), _pieces)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections, clockwiseRotation)
import Game.Direction as Direction
import Game.Location (Location)
import Game.Piece (Piece(..), PieceId(..), eval, getInputDirs, getOutputDirs, mkPieceNoGlob, truncateOutputs)
import Game.Piece as Complexity
import Game.Piece as Piece
import Game.Port (Port, inputPort, isInput, isOutput, matchingPort, outputPort, portCapacity)
import Game.PortInfo (PortInfo)
import Game.Signal (Signal)
import Safe.Coerce (coerce)

newtype EvaluableBoard = EvaluableBoard
  { pieces :: Map Location Piece
  -- maps input relEdges to output relEdges
  , connections :: Map InputEdge OutputEdge
  -- topologically sorted list of locations
  , evalOrder :: List Location
  , ports :: Map CardinalDirection Port
  , inputs :: Map CardinalDirection InputEdge
  , outputs :: Map CardinalDirection OutputEdge
  }
derive instance Newtype EvaluableBoard _
derive instance Eq EvaluableBoard
instance Show EvaluableBoard where
  show (EvaluableBoard evaluable) = show evaluable

type EvaluableM a = ReaderT EvaluableBoard (State (Map RelativeEdge PortInfo)) a

runEvaluableM  :: forall a. EvaluableBoard -> EvaluableM a -> Tuple a (Map RelativeEdge PortInfo)
runEvaluableM evaluable evalM = runState (runReaderT evalM evaluable) M.empty

setInputs :: MonadReader EvaluableBoard m 
  => MonadState (Map RelativeEdge Signal) m
  => Map CardinalDirection Signal -> m Unit
setInput inputs = ReaderT \(Evaluable e) -> do
  forWithIndex_ e.inputs \dir (InputEdge relEdge) ->
    let outputs = truncateOutputs piece (eval piece inputs)
    for_ (getOutputDirs piece) \dir ->
      ix (relative loc dir) .= fold (M.lookup dir outputs)


getOuterPort :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m =>
  CardinalDirection -> m (Maybe Signal)
getOuterPort dir = do
  maybeLoc <- asks (unwrap >>> (_.psuedoPieceLocations) >>> M.lookup dir)
  for maybeLoc \loc ->
    maybe zero (_.signal) <$> gets (M.lookup (relative loc Direction.Right))

{-
  Note: you can only set an outer port if the pseudopiece is an input psuedopiece
-}
setOuterPort :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m =>
  CardinalDirection -> Signal -> m Unit
setOuterPort dir signal = void $ runMaybeT do
  loc <- MaybeT $ asks (unwrap >>> _.psuedoPieceLocations >>> M.lookup dir)
  piece <- MaybeT $ asks (unwrap >>> _.pieces >>> M.lookup loc)
  when (isPseudoInput piece) do
    port <- MaybeT $ pure (getPsuedoPiecePort piece)
    let relEdge = relative loc Direction.Right
    let portInfo = { connected: false, port, signal }
    modify_ (M.insert relEdge portInfo)


toEvaluableBoard :: Board -> Either BoardError EvaluableBoard
toEvaluableBoard board = runExcept (buildEvaluableBoard (evalState getBoardPorts board) board)

{-
  There are two ways to build an `EvaluableBoard`, either by specifying outer ports or not. If the outer ports are not specified (via the `maybePorts` parameter), outer ports will be created from the pieces adjacent to the outer ports.

  The `m` parameter originally had a `MonadState Board m` constraint. This complemented the functions in `Board.Query` and `Board.Operation`, but given that we dont want to modify the board, it's better to pass it as a value.
-}
buildEvaluableBoard :: forall m. MonadError BoardError m
  => Map CardinalDirection Port -> Board -> m EvaluableBoard
buildEvaluableBoard psuedoPiecePorts = evalStateT do
  -- add `psuedopiece`s to board
  forWithIndex_ psuedoPiecePorts \dir port -> do
    loc <- getBoardEdgePseudoLocation dir
    let rotation = clockwiseRotation Direction.Left dir
    _pieces <<< at loc .= Just { piece: psuedoPiece port, rotation }
    --addPieceNoUpdate loc (psuedoPiece (matchingPort port)) rot
  pieces <- map (_.piece) <$> use _pieces
  connections <- buildConnectionMap

  -- psuedoPieceLocations :: Map CardinalDirection Location
  psuedoPieceLocations <- forWithIndex psuedoPiecePorts \dir _ -> getBoardEdgePseudoLocation dir

  -- toposort the pieces (need connection map)
  let locations = L.fromFoldable <<< M.keys $ pieces
  evalOrder <- maybe (throwError Cyclic) pure (topologicalSort locations connections)

  pure $ EvaluableBoard { pieces, connections, evalOrder, psuedoPieceLocations }

-- very simple but maybe not effceient, this is fine for small n
-- https://gist.github.com/rinse/8c4266ba7cef050a109f42b082782b59
topologicalSort :: List Location -> Map InputEdge OutputEdge -> Maybe (List Location)
topologicalSort Nil _ = Just Nil
topologicalSort nodes edges = do
  let doesntAcceptOutput loc = M.isEmpty $ M.submap (Just (inputEdge loc Direction.Up)) (Just (inputEdge loc Direction.Left)) edges
  r <- find doesntAcceptOutput nodes -- find that first location that has an input but doesn't accept output from anwhere else
  
  let nodes' = L.delete r nodes
      edges' = M.filter (\v -> edgeLocation v /= r) edges
  Cons r <$> topologicalSort nodes' edges'

evaluableBoardPiece :: EvaluableBoard -> Piece
evaluableBoardPiece evaluable = mkPieceNoGlob
  { name: PieceId "evaluable"
  , eval: \m -> evalState (runReaderT (evalWithPortInfo m) evaluable) M.empty
  , ports: getPorts evaluable
  , complexity: Complexity.space 0.0

  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

getInputOnEdge2 :: forall m. MonadReader EvaluableBoard m 
  => MonadState (Map RelativeEdge Signal) m
  => InputEdge -> m Signal
getInputOnEdge2 inputEdge = do
  EvaluableBoard e <- ask
  let (relEdge :: RelativeEdge) = maybe (coerce inputEdge) coerce (M.lookup inputEdge e.connections)
  fromMaybe zero <$> use (at relEdge)

evalAt :: forall m. MonadReader EvaluableBoard m 
  => MonadState (Map RelativeEdge Signal) m
  => Location -> Piece -> m Unit
evalAt loc piece = do
  EvaluableBoard e <- ask
  
  inputs <- forWithIndex (S.toMap (getInputDirs piece)) (\dir _ -> getInputOnEdge2 (inputEdge loc dir))


  unless (isPseudoPiece piece) do
    let outputs = truncateOutputs piece (eval piece inputs)
    for_ (getOutputDirs piece) \dir ->
      ix (relative loc dir) .= fold (M.lookup dir outputs)


{-
  Once the `EvaluableBoard` is build from a `Board`, we do the following to evaluate it:
    1. Inject the inputs into the psuedo inputs
    2. `eval` each location in the list `evalOrder`
    3. Extract the outputs from the psuedo outputs

-}
evalWithPortInfo :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m 
  => Map CardinalDirection Signal -> m (Map CardinalDirection Signal)
evalWithPortInfo inputs = do
  evalOrder <- asks (unwrap >>> (_.evalOrder))
  injectInputs inputs
  traverse_ evalWithPortInfoAt evalOrder
  extractOutputs

injectInputs :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => Map CardinalDirection Signal -> m Unit
injectInputs inputs = do
  psuedoPieceLocations <- asks (unwrap >>> (_.psuedoPieceLocations))
  forWithIndex_ psuedoPieceLocations \dir loc -> do
    for_ (M.lookup dir inputs) \signal -> do
      setOuterPort dir signal

{-
  -- if the edge is set already, return the input edge signal
  -- if the adjacent edge has a signal, copy the signal from the output to the input, return the signal
  -- else, return signal 0
-}
getInputOnEdge :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => InputEdge -> Capacity -> m Signal
getInputOnEdge inputEdge capacity = do
  connections <- asks (unwrap >>> (_.connections))
  case (M.lookup inputEdge connections) of
    Just outputEdge -> do
      maybeSignal <- use (at (coerce outputEdge)) >>= traverse \{ port, connected, signal} -> do
        --let signal = getClampedSignal info
        at (coerce inputEdge)  .= Just { connected: true, signal, port: inputPort  capacity }
        at (coerce outputEdge) .= Just { connected: true, signal, port: outputPort capacity }
        pure signal
      pure $ fromMaybe zero maybeSignal
    Nothing -> do
      signal <- maybe zero (_.signal) <$> use (at (coerce inputEdge))
      at (coerce inputEdge) .= Just { connected: false, signal: signal, port: inputPort capacity }
      pure signal

evalWithPortInfoAt :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => Location -> m Unit
evalWithPortInfoAt loc = do
  pieces <- asks (unwrap >>> (_.pieces))
  for_ (M.lookup loc pieces) \(Piece p) -> do
    let inputPorts = M.filter isInput p.ports

    inputs <- M.fromFoldable <$>
      forWithIndex inputPorts \dir port ->
        Tuple dir <$> getInputOnEdge (inputEdge loc dir) (portCapacity port)
        
    unless (isPseudoPiece (Piece p)) do
      let outputs = p.eval inputs
      let outputPorts = M.filter isOutput p.ports
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

--extractOuterPortInfo :: forall m. MonadState (Map RelativeEdge PortInfo) m
--  => EvaluableBoard -> m (Map CardinalDirection PortInfo)
--extractOuterPortInfo (EvaluableBoard evaluable) = 
--  forWithIndex (evaluable.portLocations) \dir relEdge -> do
--    maybePortInfo <- use (at relEdge)
--    pure $ fromMaybe defaultPortInfo maybePortInfo
--  where
--    defaultPortInfo =
--      { connected: false
--      , port: outputPort EightBit
--      , signal: Signal 0
--      }

getPortInfo :: forall m. MonadReader EvaluableBoard m 
  => m (Map RelativeEdge { port :: Port, connected :: Boolean})
getPortInfo = do
  EvaluableBoard e <- ask
  let portInfo = execWriter do
        forWithIndex_ e.pieces \loc piece ->
          for_ allDirections \dir ->
            for_ (Piece.getPort piece dir) \port ->
              tell (M.singleton (relative loc dir) { port: First (Just port), connected: Disj false })
        forWithIndex_ e.connections \(InputEdge inputEdge) (OutputEdge outputEdge) -> do
          tell (M.singleton inputEdge  { port: First Nothing, connected: Disj true})
          tell (M.singleton outputEdge { port: First Nothing, connected: Disj true})

  pure $ M.mapMaybe (\{ port, connected } -> { port: _, connected: coerce connected} <$> coerce port) portInfo

getPorts :: forall m. MonadReader EvaluableBoard m => m (Map CardinalDirection Port)
getPorts = do
  pieces <- asks (unwrap >>> _.pieces)
  psuedoPieceLocations <- asks (unwrap >>> _.psuedoPieceLocations)
  
  pure $ M.mapMaybe (\loc -> map matchingPort $ M.lookup loc pieces >>= (\(Piece p) -> M.lookup Direction.Right p.ports)) psuedoPieceLocations

getPort :: forall m. MonadReader EvaluableBoard m => CardinalDirection ->  m (Maybe Port)
getPort dir = do
  pieces <- asks (unwrap >>> _.pieces)
  psuedoPieceLocations <- asks (unwrap >>> _.psuedoPieceLocations)
  pure $
    M.lookup dir psuedoPieceLocations
      >>= \loc -> M.lookup loc pieces
      >>= \(Piece p) -> M.lookup Direction.Right p.ports
      <#> matchingPort
    

toLocalInputs :: forall a. Location -> Map RelativeEdge a -> Map CardinalDirection a
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey edgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: forall a. Location -> Map CardinalDirection a -> Map RelativeEdge a
toGlobalInputs loc = unsafeMapKey (relative loc)

