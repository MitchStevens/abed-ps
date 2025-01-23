module Game.Board.Evaluable.Evaluate where

import Prelude

import Control.Monad.Reader (class MonadReader, ReaderT(..), asks, runReaderT)
import Control.Monad.Writer (execWriter, tell)
import Data.Foldable (fold, for_, traverse_)
import Data.FoldableWithIndex (forWithIndex_, traverseWithIndex_)
import Data.Lens (use, (.=))
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.First (First(..))
import Data.Monoid.Disj (Disj(..))
import Data.Set as S
import Data.Traversable (for)
import Game.Board.Edge (InputEdge(..), OutputEdge(..), RelativeEdge, inputEdge, relative)
import Game.Board.Evaluable.Types (EvaluableBoard(..), EvaluableM, execEvaluableM)
import Game.Direction (CardinalDirection, allDirections)
import Game.Location (Location(..))
import Game.Piece (Piece(..), PieceId(..), isSimplifiable, mkPieceNoGlob)
import Game.Piece as Complexity
import Game.Piece as Piece
import Game.Port (Port(..), portCapacity)
import Game.Signal (Signal, canonical)
import Safe.Coerce (coerce)

toPiece :: EvaluableBoard -> Piece
toPiece (EvaluableBoard e) = mkPieceNoGlob
  { name: PieceId "evaluable"
  , eval: \inputs -> execEvaluableM (eval inputs) (EvaluableBoard e)
  , ports: e.ports
  , complexity: Complexity.space 0.0
  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

setInputs :: Map CardinalDirection Signal -> EvaluableM Unit
setInputs inputs = ReaderT \(EvaluableBoard e) -> do
  forWithIndex_ e.inputEdges \dir (InputEdge relEdge) -> do
    rawSignal <- fold <$> use (at relEdge)
    let signal = fromMaybe rawSignal ?a (portCapacity <$> M.lookup dir e.ports)
    ix relEdge .= signal

getOutputs :: EvaluableM (Map CardinalDirection Signal)
getOutputs = ReaderT \(EvaluableBoard e) -> do
  for e.outputEdges \(OutputEdge relEdge) -> do
    fold <$> use (at relEdge)

getInputOnEdge :: InputEdge -> EvaluableM Signal
getInputOnEdge inputEdge = ReaderT \(EvaluableBoard e) -> do
  let (relEdge :: RelativeEdge) = maybe (coerce inputEdge) coerce (M.lookup inputEdge e.connections)
  fold <$> use (at relEdge)

evalAt :: Location -> EvaluableM Unit
evalAt loc = ReaderT \(EvaluableBoard e) -> do
  for_ (M.lookup loc e.pieces) \piece -> do
    inputs <- forWithIndex_ (S.toMap (Piece.getInputDirs piece)) (\dir _ -> getInputOnEdge (inputEdge loc dir))

    --unless (isPseudoPiece piece) do
    let outputs = Piece.truncateOutputs piece (eval piece inputs)
    for_ (Piece.getOutputDirs piece) \dir ->
      ix (relative loc dir) .= fold (M.lookup dir outputs)

eval :: Map CardinalDirection Signal -> EvaluableM (Map CardinalDirection Signal)
eval inputs = do
  setInputs inputs
  asks (coerce >>> _.evalOrder) >>= traverse_ evalAt
  getOutputs

getPortInfo :: EvaluableM (Map RelativeEdge { port :: Port, connected :: Boolean})
getPortInfo = ReaderT \(EvaluableBoard e) -> do
  let portInfo = execWriter do
        forWithIndex_ e.pieces \loc piece ->
          for_ allDirections \dir ->
            for_ (Piece.getPort piece dir) \port ->
              tell (M.singleton (relative loc dir) { port: First (Just port), connected: Disj false })
        forWithIndex_ e.connections \(InputEdge inputEdge) (OutputEdge outputEdge) -> do
          tell (M.singleton inputEdge  { port: First Nothing, connected: Disj true})
          tell (M.singleton outputEdge { port: First Nothing, connected: Disj true})

  pure $ M.mapMaybe (\{ port, connected } -> { port: _, connected: coerce connected} <$> coerce port) portInfo