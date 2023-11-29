module Game.Board.CompiledBoard where

import Prelude

import Control.Monad.Reader (class MonadAsk, ask, asks)
import Control.Monad.State (StateT, evalState, modify_)
import Data.Foldable (for_, traverse_)
import Data.Graph as G
import Data.HeytingAlgebra (ff)
import Data.Lens (AGetter, Getter, Getter', to, use, (.=))
import Data.Lens as Data.Lens.Getter
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.List (List)
import Data.Map (Map)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Game.Board (Board(..), RelativeEdge(..), relative)
import Game.Board as Board
import Game.Board.PseudoPiece (psuedoPiece)
import Game.Board.Query (buildBoardGraph, buildConnectionMap, getBoardEdgePseudoLocation)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Direction as Direction
import Game.Expression (Signal(..))
import Game.Location (Location(..), followDirection)
import Game.Piece (APiece, Capacity, Port(..), PortInfo, getPorts, inputPort, isInput, isOutput, matchingPort, portType, sourcePiece)
import Game.Piece as Port
import Game.Rotation (clockwiseRotation)
import Halogen.HTML (i)

newtype CompiledBoard = CompiledBoard
  { pieces :: Map Location APiece
  -- maps input relEdges to output relEdges
  , connections :: Map RelativeEdge RelativeEdge
  -- topologically sorted list of locations
  , evalOrder :: List Location
  , ports :: Map CardinalDirection Port
  , portLocations :: Map CardinalDirection RelativeEdge
  }

derive instance Newtype CompiledBoard _

type EvalM a = StateT (Map RelativeEdge PortInfo) (Function CompiledBoard) a

compile :: Board -> CompiledBoard
compile board = (\mb -> evalState mb board) do
  pieces <- map (_.piece) <$> use Board._pieces
  evalOrder <- G.topologicalSort <$> buildBoardGraph
  ports <- use Board._ports
  portLocations <- M.fromFoldable <$>
    for (M.toUnfoldable ports :: List _) \(Tuple dir port) -> do
      loc <- getBoardEdgePseudoLocation dir
      let relEdge = case portType port of
            Port.Input  -> relative loc (oppositeDirection dir)
            Port.Output -> relative (followDirection loc (oppositeDirection dir)) dir
      pure (Tuple dir relEdge)

  -- add psuedo pieces to board when building connection map
  boardPorts <- use Board._ports
  for_ (M.toUnfoldable boardPorts :: List _) \(Tuple dir port) -> do
    loc <- getBoardEdgePseudoLocation dir
    let rotation = clockwiseRotation Direction.Left dir
    Board._pieces <<< at loc .= Just { piece: psuedoPiece port, rotation }
  connections <- buildConnectionMap

  pure $ CompiledBoard { pieces, connections, evalOrder, ports, portLocations }


view :: forall s t a b m. MonadAsk s m => AGetter s t a b -> m a
view = asks <<< Data.Lens.Getter.view

_connections :: Getter' CompiledBoard (Map RelativeEdge RelativeEdge)
_connections = to (unwrap >>> (_.connections))

_pieces :: Getter' CompiledBoard (Map Location APiece)
_pieces = to (unwrap >>> (_.pieces))

_evalOrder :: Getter' CompiledBoard (List Location)
_evalOrder = to (unwrap >>> (_.evalOrder))

_ports :: Getter' CompiledBoard (Map CardinalDirection Port)
_ports = to (unwrap >>> (_.ports))


copyOutputToInput :: RelativeEdge -> EvalM Unit
copyOutputToInput relEdge = do
  view (_connections <<< at relEdge) >>= case _ of
    Just outRelEdge -> pure




{-
  if an connected output exists:
  
  else
  ensure that this `RelEdge` is actually an input!
-}
getInput :: RelativeEdge -> Capacity -> EvalM Signal
getInput inputRelEdge capacity = do
  pure (Signal 0)
--  maybeOutputRelEdge <- view (_connections <<< at inputRelEdge)
--   >>= traverse_ \outputRelEdge -> do
--    maybeOutputInfo <- use (at outputRelEdge)
--    case maybeOutputInfo of
--      Just info -> do
--        at inputRelEdge  .= Just { connected: true, signal: info.signal, port: inputPort capacity }
--        ix outputRelEdge .= info { connected = true }
--        pure info.signal
--      Nothing -> do
--        at inputRelEdge  .= Just { connected: false, signal: Signal 0, port: inputPort capacity }
--        pure (Signal 0)


evalAt :: Location -> EvalM Unit
evalAt loc = do
  view (_pieces <<< at loc) >>= traverse_ \info -> do
    let ports = getPorts info.piece
    let inputPorts  = M.filter isInput  ports
    let outputPorts = M.filter isOutput ports

    inputs <- M.fromFoldable <$>
      for inputPorts \(Tuple dir port) -> do
        Tuple dir <$> getInput (relative loc dir)
    let outputs = eval info.piece inputs
    for_ (M.toUnfoldable outputPorts :: List _) \(Tuple dir port) -> do
      let signal = fromMaybe ff (M.lookup dir outputs)
      at (relative loc dir) .= Just { connected: false, signal, port }



eval :: Map CardinalDirection Signal -> EvalM Unit
eval inputs = do
  injectInputs inputs
  view _evalOrder >>= traverse_ evalAt
  

injectInputs :: Map CardinalDirection Signal -> EvalM Unit
injectInputs inputs = do
  CompiledBoard b <- ask
  for_ (M.toUnfoldable inputs :: List _) \(Tuple dir signal) -> do
    for_ (M.lookup dir b.ports) \port ->
      for_ (M.lookup dir b.portLocations) \relEdge ->
        at relEdge .= Just { connected: false, signal, port}