module Game.Board where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.State (class MonadState, evalState, get, gets)
import Data.Array ((..))
import Data.Array as A
import Data.Foldable (foldM)
import Data.Graph (Graph)
import Data.Graph as G
import Data.Group (ginverse)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.List (List(..), any)
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Map.Internal as Map
import Data.Maybe (Maybe(..), fromMaybe, isJust, maybe)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.Set as S
import Data.Traversable (for, sequence, traverse)
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Edge (Edge(..), edge)
import Game.Location (Location(..), location)
import Game.Piece (APiece, Port(..))
import Game.Rotation (Rotation(..))
import Type.Proxy (Proxy(..))


{-
  Edges are references to ports, they contain a location and a direction
  We have two different types of edges to
-}
type AbsoluteEdge = Edge

newtype RelativeEdge = Relative Edge
derive instance Newtype RelativeEdge _
derive instance Eq RelativeEdge
derive instance Ord RelativeEdge
instance Show RelativeEdge where
  show (Relative (Edge { loc, dir })) = "(RelEdge " <> show loc <> " " <> show dir <> ")"

relative :: Location -> CardinalDirection -> RelativeEdge
relative loc dir = Relative (Edge {loc, dir})

relativeEdgeLocation :: RelativeEdge -> Location
relativeEdgeLocation (Relative (Edge {loc, dir})) = loc

relativeEdgeDirection :: RelativeEdge -> CardinalDirection
relativeEdgeDirection (Relative (Edge {loc, dir})) = dir


absolute :: Location -> CardinalDirection -> AbsoluteEdge
absolute = edge 

type PieceInfo =
  { piece :: APiece
  , rotation :: Rotation
  }

_rotation :: Lens' PieceInfo Rotation
_rotation = prop (Proxy :: Proxy "rotation")

newtype Board = Board
  { size :: Int
  , pieces :: Map Location PieceInfo
  , ports :: Map CardinalDirection Port
  }

derive instance Newtype Board _
derive instance Eq Board
instance Show Board where
  show (Board {size, pieces}) = "Board " <> show size <> " " <> show pieces

_size :: Lens' Board Int
_size = _Newtype <<< prop (Proxy :: Proxy "size")

_pieces :: Lens' Board (Map Location PieceInfo)
_pieces = _Newtype <<< prop (Proxy :: Proxy "pieces")

_ports :: Lens' Board (Map CardinalDirection Port)
_ports = _Newtype <<< prop (Proxy :: Proxy "ports")

standardBoard :: Board
standardBoard = Board { size: 3, pieces: M.empty, ports: M.empty }


allOccupiedLocations :: Board -> Set Location
allOccupiedLocations = view $ _pieces <<< to M.keys

-- todo: ensure that this short circuits when the empty loction is found 
firstEmptyLocation :: Board -> Maybe Location
firstEmptyLocation board = do
  let n = view _size board
  let allLocations = do
        j <- 0 .. (n - 1)
        i <- 0 .. (n - 1)
        pure $ location i j
  let occupied = allOccupiedLocations board
  A.find (\loc -> S.member loc occupied) allLocations









--allPortsOnBoard :: forall m. MonadState Board m => m (Map RelativeEdge Port)
--allPortsOnBoard = M.union <$> boardPorts <*> piecePorts
--  where
--    boardPorts = M.catMaybes <$> do
--      board <- get
--      M.fromFoldable <$> for allDirections \dir -> do
--        relEdge  <- toRelativeEdge (portEdges board dir)
--        Tuple relEdge <$> getPortOnEdge relEdge
--
--    piecePorts = do
--      pieceInfos <- use _pieces
--      M.unions <$> for (M.toUnfoldable pieceInfos :: Array _) \(Tuple loc pieceInfo) -> do
--        M.fromFoldable <$> for (M.toUnfoldable (getPorts pieceInfo.piece) :: Array _) \(Tuple dir port) -> do
--          pure (Tuple (relative loc dir) port)





--initialValues :: forall m. MonadState Board m => Map CardinalDirections Signal -> m (Map RelativeEdge Signal)
--initialValues m = do
--  n <- use _size 
--  for allDirections \dir -> do
--    
--    
--    
--    do
--      M.catMaybes <<< M.fromFoldable <$> sequence
--        [ Tuple <$> toRelativeEdge (absolute (location (n`div`2) 0        ) Direction.Up   ) <*> pure (M.lookup Direction.Up    inputs)
--        , Tuple <$> toRelativeEdge (absolute (location (n-1)     (n`div`2)) Direction.Right) <*> pure (M.lookup Direction.Right inputs)
--        , Tuple <$> toRelativeEdge (absolute (location (n`div`2) (n-1)    ) Direction.Down ) <*> pure (M.lookup Direction.Down  inputs)
--        , Tuple <$> toRelativeEdge (absolute (location 0         (n`div`2)) Direction.Left ) <*> pure (M.lookup Direction.Left  inputs)
--        ]



--evalBoardWithPortInfo :: forall m . MonadState Board m 
--  => Map CardinalDirection Signal -> m (Map RelativeEdge PortInfo)
--evalBoardWithPortInfo inputs = do
--  connectionMap <- buildConnectionMap <$> get
--  let connections = S.fromFoldable $ M.toUnfoldable connectionMap >>= \(Tuple relEdge relEdge') -> [ relEdge, relEdge' ]
--  signals <- evalBoardScratch inputs
--  ports <- allPortsOnBoard
--
--  pure $ M.fromFoldable do
--    Tuple relEdge port <- M.toUnfoldable ports :: Array _
--    let signal = fromMaybe (Signal 0) (M.lookup relEdge signals)
--    let connected = S.member relEdge connections
--    pure $ Tuple relEdge { connected, port, signal }