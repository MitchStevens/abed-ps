module Game.Board.Compilation where

import Prelude

import Control.Monad.State (get)
import Data.FoldableWithIndex (foldrWithIndex, forWithIndex_)
import Data.Lens ((.=))
import Data.Lens.At (at)
import Data.Lens.Record (prop)
import Data.List (List)
import Data.List as List
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as Set
import Game.Board.BoardConnections (BoardConnections)
import Game.Board.EvaluableBoard (EvaluableBoard(..))
import Game.Board.RelativeEdge (RelativeEdge(..), relativeEdgeLocation)
import Game.Piece.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (Piece(..), PieceId(..))
import Game.Piece.Signal (Signal(..))
import Type.Proxy (Proxy(..))


--newtype EvaluableBoard = EvaluableBoard
--  { pieces :: Map Location Piece
--
--  -- maps input relEdges to output relEdges
--  --, connections :: Map RelativeEdge RelativeEdge
--  , connections :: BoardConnections
--
--  -- topologically sorted list of locations
--  , evalOrder :: List Location
--
--  , psuedoPieceLocations :: Map CardinalDirection Location
--  }
newtype CompiledBoard = CompiledBoard
  { constants :: Map RelativeEdge Signal
  , evaluableBoard :: EvaluableBoard
  }

--compiledBoardPiece :: CompiledBoard -> Piece
--compiledBoardPiece compiled@(CompiledBoard c) = Piece
--  { name: PieceId "compiled"
--  , eval: \inputs -> evalState (runReaderT (evalWithPortInfo inputs) evaluable) M.empty
--  , complexity: Complexity.space 0.0
--
--  , shouldRipple: false
--  , updateCapacity: \_ _ -> Nothing
--
--  , ports: getPorts evaluable
--  , updatePort: \_ _ -> Nothing
--
--  , isSimplifiable: Nothing
--  }


{-
  remove simplifiable pieces
  remove psuedo pieces
  edge reduce board connections

-}
--compileEvaluable :: EvaluableBoard -> CompiledBoard
--compileEvaluable 
--  where

--
--_constants = prop (Proxy :: Proxy "constants")
--_connections = prop (Proxy :: Proxy "connections")
--_evalOrder = prop (Proxy :: Proxy "evalOrder")
--
--{-
--newtype CompiledBoard = EvaluableBoard
--  { pieces :: Map Location Piece
--  -- maps input relEdges to output relEdges
--  , connections :: Map RelativeEdge RelativeEdge
--  -- topologically sorted list of locations
--  , evalOrder :: List Location
--  , psuedoPieceLocations :: Map CardinalDirection Location
--  }
--
--  Location -> EvaluableBoard  EvalableBoard
---}
--
--compilePiece :: forall m. MonadState CompiledBoard m => Location -> Piece -> m (Maybe Eval)
--compilePiece loc piece = do 
--  case piece.isSimplifiable of 
--    Just (IsConstant constants) -> do
--      _constants <>= constants
--      pure Nothing
--    Just (Connection connections) -> do
--      _connections <>= connections
--      pure Nothing
--    Nothing -> do
--      pure piece.eval
--
--
--
--{-
--  Get all the locations connected to an output
---}
--connectedLocations :: forall m. MonadState CompiledBoard m => m (Set Location)
--connectedLocations = do
--  CompiledBoard compiled <- get
--  pure $ getConnectedSet compiled.connections compiled.outputs S.empty
--  where
--    getParents :: Map RelativeEdge RelativeEdge -> Location -> Set Location
--    getParents connections loc = S.map relativeEdgeLocation $ M.keys $ M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) connections
--
--    getConnectedSet :: Map RelativeEdge RelativeEdge -> Set Location -> Set Location -> Set Location
--    getConnectedSet connections openSet connectedSet = 
--      if S.isEmpty parents
--        then openSet <> connectedSet
--        else getConnectedSet connections parents (openSet <> connectedSet)
--      
--      where parents = M.unions $ S.map (getParents connections) openSet
--
--removeDisconnected
--
--simplifyConnections :: forall m. MonadState CompiledBoard m => m ()
--simplifyConnections = do
--
--
--
--
--
--
--
