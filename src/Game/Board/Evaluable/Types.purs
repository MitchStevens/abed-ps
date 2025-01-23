module Game.Board.Evaluable.Types where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Control.Monad.Except (runExcept)
import Control.Monad.Maybe.Trans (runMaybeT)
import Control.Monad.Reader (ReaderT(..), runReaderT)
import Control.Monad.State (class MonadState, State, evalState, evalStateT, execState, runState, runStateT)
import Control.Monad.Writer (WriterT(..), execWriterT, tell)
import Data.Compactable (compact)
import Data.Either (Either)
import Data.Foldable (for_, traverse_)
import Data.Lens (use)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..), fst, snd)
import Game.Board.Edge (InputEdge(..), OutputEdge(..), RelativeEdge(..), absolute, adjacent, connected, edgeLocation, getPortOnEdge, inputEdge, relative)
import Game.Board.Query (getBoardEdges)
import Game.Board.Types (Board(..), BoardError, _pieces)
import Game.Board.Types (BoardError(..), _pieces)
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.Location (Location(..))
import Game.Piece (Piece(..))
import Game.Port (Port(..), matchingPort, portType)
import Game.Port as Port
import Game.Signal (Signal)


newtype EvaluableBoard = EvaluableBoard
  { pieces :: Map Location Piece
  -- maps input relEdges to output relEdges
  , connections :: Map InputEdge OutputEdge
  -- topologically sorted list of locations
  , evalOrder :: List Location
  , ports :: Map CardinalDirection Port
  , inputEdges :: Map CardinalDirection InputEdge
  , outputEdges :: Map CardinalDirection OutputEdge
  }
derive instance Newtype EvaluableBoard _
derive instance Eq EvaluableBoard
instance Show EvaluableBoard where
  show (EvaluableBoard evaluable) = show evaluable

type EvaluableM a = ReaderT EvaluableBoard (State (Map RelativeEdge Signal)) a

runEvaluableM :: forall a. EvaluableM a -> EvaluableBoard -> Tuple a (Map RelativeEdge Signal)
runEvaluableM evalM evaluableBoard = runState (runReaderT evalM evaluableBoard) M.empty

execEvaluableM :: forall a. EvaluableM a -> EvaluableBoard -> Map RelativeEdge Signal
execEvaluableM evalM evaluableBoard = snd (runEvaluableM evalM evaluableBoard)

evalEvaluableM :: forall a. EvaluableM a -> EvaluableBoard -> a
evalEvaluableM evalM evaluableBoard = fst (runEvaluableM evalM evaluableBoard)

{-
  There are two ways to build an `EvaluableBoard`, either by specifying outer ports or not. If the outer ports are not specified (via the `maybePorts` parameter), outer ports will be created from the pieces adjacent to the outer ports.

  The `m` parameter originally had a `MonadState Board m` constraint. This complemented the functions in `Board.Query` and `Board.Operation`, but given that we dont want to modify the board, it's better to pass it as a value.
-}
mkEvaluableBoard :: forall m
  .  MonadError BoardError m
  => Map CardinalDirection Port -> Board -> m EvaluableBoard
mkEvaluableBoard ports = evalStateT do
  pieces <- getPieces
  connections <- getConnections
  evalOrder <- getEvalOrder connections
  inputEdges <- getInputEdges
  outputEdges <- getOutputEdges
  pure $ EvaluableBoard { pieces, connections, evalOrder, ports, inputEdges, outputEdges }

getPieces :: forall m. MonadState Board m => m (Map Location Piece)
getPieces = map _.piece <$> use _pieces

getConnections :: forall m. MonadState Board m => m (Map InputEdge OutputEdge)
getConnections = do
  pieceInfos <- use _pieces
  map M.fromFoldable <$> execWriterT $ traverse_ getConnectionsAt (L.fromFoldable (M.keys pieceInfos))

getConnectionsAt :: forall m. MonadState Board m
  => Location -> WriterT (List (Tuple InputEdge OutputEdge)) m Unit
getConnectionsAt loc = 
  for_ allDirections \dir -> runMaybeT do
    let relEdge = relative loc dir
    port <- getPortOnEdge relEdge
    case portType port of
      Port.Input -> do
          let inputEdge = InputEdge relEdge
          outputEdge <- OutputEdge <$> connected relEdge 
          tell (L.singleton (Tuple inputEdge outputEdge))
      Port.Output -> do
          inputEdge <- InputEdge <$> connected relEdge 
          let outputEdge = OutputEdge relEdge
          tell (L.singleton (Tuple inputEdge outputEdge))

getEvalOrder :: forall m
  .  MonadThrow BoardError m
  => MonadState Board m
  => Map InputEdge OutputEdge
  -> m (List Location)
getEvalOrder connections = do
  --(locations :: List Location) <- L.fromFoldable <<< M.keys <$> 
  pieces <- use _pieces
  let locations = L.fromFoldable $ M.keys pieces
  maybe (throwError Cyclic) pure (topologicalSort locations connections)


-- very simple but maybe not effceient, this is fine for small n
-- https://gist.github.com/rinse/8c4266ba7cef050a109f42b082782b59
topologicalSort :: List Location -> Map InputEdge OutputEdge -> Maybe (List Location)
topologicalSort Nil _ = Just Nil
topologicalSort nodes edges = do
  let doesntAcceptOutput loc = M.isEmpty $ M.submap (Just (inputEdge loc Direction.Up)) (Just (inputEdge loc Direction.Left)) edges
  r <- L.find doesntAcceptOutput nodes -- find that first location that has an input but doesn't accept output from anwhere else
  
  let nodes' = L.delete r nodes
      edges' = M.filter (\v -> edgeLocation v /= r) edges
  Cons r <$> topologicalSort nodes' edges'


getPorts :: forall m. MonadState Board m => m (Map CardinalDirection Port)
getPorts = do
  boardEdges <- getBoardEdges
  compact <$> forWithIndex boardEdges \dir loc -> runMaybeT do
    port <- getPortOnEdge (absolute loc dir)
    pure (matchingPort port)

getInputEdges :: forall m. MonadState Board m => m (Map CardinalDirection InputEdge)
getInputEdges = do
  boardEdges <- getBoardEdges
  compact <$> forWithIndex boardEdges \dir loc -> runMaybeT do
    adjacent (absolute loc dir)


getOutputEdges :: forall m. MonadState Board m => m (Map CardinalDirection OutputEdge)
getOutputEdges = do
  boardEdges <- getBoardEdges
  compact <$> forWithIndex boardEdges \dir loc -> runMaybeT do
    adjacent (absolute loc dir)

