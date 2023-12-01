module Game.Board where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.State (class MonadState, evalState, get, gets)
import Data.Array ((..))
import Data.Array as A
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
import Data.Traversable (for, sequence)
import Data.Tuple (Tuple(..))
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection, allDirections, rotateDirection)
import Game.Direction as Direction
import Game.Edge (Edge(..), edge, matchEdge)
import Game.Location (Location(..), location)
import Game.Piece (class Piece, PieceId(..), Port, eval, getCapacity, getOutputDirs, getPort, getPorts, isInput, portType)
import Game.Piece.APiece (APiece(..))
import Game.Piece.Port as Port
import Game.Rotation (Rotation(..))
import Game.Signal (Signal(..))
import Halogen.Svg.Attributes (m)
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
  }

derive instance Newtype Board _
derive instance Eq Board
instance Show Board where
  show (Board {size, pieces}) = "Board " <> show size <> " " <>
    show pieces

_size :: Lens' Board Int
_size = _Newtype <<< prop (Proxy :: Proxy "size")

_pieces :: Lens' Board (Map Location PieceInfo)
_pieces = _Newtype <<< prop (Proxy :: Proxy "pieces")

standardBoard :: Board
standardBoard = Board { size: 3, pieces: M.empty }


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


-- should retun either boarderror
getPortOnEdge :: forall m. MonadState Board m => RelativeEdge -> m (Maybe Port)
getPortOnEdge (Relative (Edge { loc, dir })) = do
  maybePieceInfo <- use (_pieces <<< at loc)
  pure $ maybePieceInfo >>= (\p -> getPort p.piece dir)

-- if location is not accupied, reledge == absEdge
toAbsoluteEdge :: forall m. MonadState Board m => RelativeEdge -> m AbsoluteEdge
toAbsoluteEdge (Relative (Edge { loc, dir })) = do
  (rot :: Rotation) <- gets (view $ _pieces <<< ix loc <<< _rotation) -- rotation is a monoid
  pure $ absolute loc (rotateDirection dir rot)

-- if location is not accupied, reledge == absEdge
toRelativeEdge :: forall m. MonadState Board m => AbsoluteEdge -> m RelativeEdge
toRelativeEdge (Edge { loc, dir }) = do
  (rot :: Rotation) <- gets (view $ _pieces <<< ix loc <<< _rotation)
  pure $ relative loc (rotateDirection dir (ginverse rot))


portEdges :: Board -> CardinalDirection -> AbsoluteEdge
portEdges (Board b) dir = 
  let n = b.size
  in case dir of
    Direction.Up    -> absolute (location (n`div`2) 0        ) dir 
    Direction.Right -> absolute (location (n-1)     (n`div`2)) dir
    Direction.Down  -> absolute (location (n`div`2) (n-1)    ) dir
    Direction.Left  -> absolute (location 0         (n`div`2)) dir


allPortsOnBoard :: forall m. MonadState Board m => m (Map RelativeEdge Port)
allPortsOnBoard = M.union <$> boardPorts <*> piecePorts
  where
    boardPorts = M.catMaybes <$> do
      board <- get
      M.fromFoldable <$> for allDirections \dir -> do
        relEdge  <- toRelativeEdge (portEdges board dir)
        Tuple relEdge <$> getPortOnEdge relEdge

    piecePorts = do
      pieceInfos <- use _pieces
      M.unions <$> for (M.toUnfoldable pieceInfos :: Array _) \(Tuple loc pieceInfo) -> do
        M.fromFoldable <$> for (M.toUnfoldable (getPorts pieceInfo.piece) :: Array _) \(Tuple dir port) -> do
          pure (Tuple (relative loc dir) port)

-- do not export 
portsBoard :: forall m. MonadState Board m => m (Map CardinalDirection Port)
portsBoard = M.catMaybes <$> do
  board <- get
  M.fromFoldable <$> for allDirections \dir -> do
    relEdge  <- toRelativeEdge (portEdges board dir)
    Tuple dir <$> getPortOnEdge relEdge


{- Board evaluation
      Note that these are non destructive operations and thus don't have the constraint:
        => MonadError BoardError

-}
matchingRelativeEdge :: forall m. MonadState Board m => RelativeEdge -> m RelativeEdge
matchingRelativeEdge edge1 = do
  absEdge <- toAbsoluteEdge edge1
  toRelativeEdge (matchEdge absEdge)

buildConnectionMap :: Board -> Map RelativeEdge RelativeEdge
buildConnectionMap board@(Board {size, pieces}) = M.union edgeConnections internalConnections
  where
    edgeConnections = M.fromFoldable do
      absEdge <- portEdges board <$> allDirections
      let internal = evalState (toRelativeEdge absEdge) board
      let external = evalState (matchingRelativeEdge internal) board
      let maybePort = evalState (getPortOnEdge internal) board
      case portType <$> maybePort of
        Just (Port.Input)  -> [ Tuple internal external ]
        Just (Port.Output) -> [ Tuple external internal ]
        Nothing -> []
    
    internalConnections = M.fromFoldable do
      Tuple loc {piece, rotation} <- M.toUnfoldable pieces
      dir <- A.fromFoldable $ getOutputDirs piece
      let relEdge  = relative loc dir
      let relEdge' = evalState (matchingRelativeEdge relEdge) board
      if isJust (evalState (getPortOnEdge relEdge') board)
        then [ Tuple relEdge relEdge' ]
        else []


--portEdges :: Board -> CardinalDirection -> AbsoluteEdge

buildBoardGraph :: forall m. MonadState Board m => m (Graph Location Unit)
buildBoardGraph = do
  connections <- buildConnectionMap <$> get
  let connectedLocations = M.foldSubmap Nothing Nothing connect connections
  pieces <- use _pieces
  let unconnectedLocations = M.foldSubmap Nothing Nothing (\loc _ -> M.singleton loc (Tuple unit Nil)) pieces
  pure $ G.fromMap (connectedLocations <> unconnectedLocations)
  where
    connect rel rel' = 
      M.fromFoldable
        [ Tuple (relativeEdgeLocation rel) (Tuple unit (L.singleton (relativeEdgeLocation rel')))
        , Tuple (relativeEdgeLocation rel') (Tuple unit Nil)
        ]

-- should no be exported! only creates valid maps when f is increasing
unsafeMapKey :: forall k l a. (k -> l) -> Map k a -> Map l a
unsafeMapKey f = go
  where
    go = case _ of
      Map.Leaf -> Map.Leaf
      Map.Two l k v r -> Map.Two (go l) (f k) v (go r)
      Map.Three l k1 v1 m k2 v2 r -> Map.Three (go l) (f k1) v1 (go m) (f k2) v2 (go r)

toLocalInputs :: forall a. Location -> Map RelativeEdge a -> Map CardinalDirection a
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey relativeEdgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: forall a. Location -> Map CardinalDirection a -> Map RelativeEdge a
toGlobalInputs loc = unsafeMapKey (relative loc)

instance Piece Board where
  name _ = PieceId "board"
  eval board inputs = evalState (evalBoardScratch inputs >>= extractOutputs) board
  getCapacity _ = Nothing
  updateCapacity _ _ = Nothing
  getPorts = evalState portsBoard
  updatePort _ _ _ = Nothing


evalLocation :: forall m. MonadState Board m 
  => Map RelativeEdge Signal -> Location -> m (Map RelativeEdge Signal)
evalLocation acc loc = M.union acc <$> do
    maybePieceInfo <- use (_pieces <<< at loc)
    let outputs = maybe (M.empty) (\p -> toGlobalInputs loc (eval p.piece (toLocalInputs loc acc))) maybePieceInfo

    adjacentInputs <- map M.fromFoldable <$> for (M.toUnfoldable outputs :: Array _) $ \(Tuple relEdge signal) -> do
      matching <- matchingRelativeEdge relEdge
      pure (Tuple matching signal)
    pure $ M.union outputs adjacentInputs

extractBoardPorts :: forall m a. MonadState Board m
  => Map RelativeEdge a -> m (Map CardinalDirection a)
extractBoardPorts m = M.fromFoldable <$> A.catMaybes <$> do
  for allDirections \dir -> do
    board <- get
    relEdge <- toRelativeEdge (portEdges board dir)
    pure $ Tuple dir <$> M.lookup relEdge m

extractInputs :: forall m a. MonadState Board m 
  => Map RelativeEdge a -> m (Map CardinalDirection a)
extractInputs m = do  
  ports <- portsBoard
  let inputFilter dir a = any isInput (M.lookup dir ports)
  M.filterWithKey inputFilter <$> extractBoardPorts m

extractOutputs :: forall m a. MonadState Board m 
  => Map RelativeEdge a -> m (Map CardinalDirection a)
extractOutputs m = do  
  ports <- portsBoard
  let outputFilter dir a = any (not <<< isInput) (M.lookup dir ports)
  M.filterWithKey outputFilter <$> extractBoardPorts m

evalBoardScratch :: forall m . MonadState Board m 
  => Map CardinalDirection Signal -> m (Map RelativeEdge Signal)
evalBoardScratch inputs = do 
  boardGraph <- buildBoardGraph
  let locationsToEvaluate = G.topologicalSort boardGraph
  initialValues <- initial
  signals <- L.foldM evalLocation initialValues locationsToEvaluate
  pure signals

  where
    -- this can very likely be fixed
    initial :: m (Map RelativeEdge Signal)
    initial = do
      n <- use _size 
      M.catMaybes <<< M.fromFoldable <$> sequence
        [ Tuple <$> toRelativeEdge (absolute (location (n`div`2) 0        ) Direction.Up   ) <*> pure (M.lookup Direction.Up    inputs)
        , Tuple <$> toRelativeEdge (absolute (location (n-1)     (n`div`2)) Direction.Right) <*> pure (M.lookup Direction.Right inputs)
        , Tuple <$> toRelativeEdge (absolute (location (n`div`2) (n-1)    ) Direction.Down ) <*> pure (M.lookup Direction.Down  inputs)
        , Tuple <$> toRelativeEdge (absolute (location 0         (n`div`2)) Direction.Left ) <*> pure (M.lookup Direction.Left  inputs)
        ]


evalBoardWithPortInfo :: forall m . MonadState Board m 
  => Map CardinalDirection Signal -> m (Map RelativeEdge PortInfo)
evalBoardWithPortInfo inputs = do
  connectionMap <- buildConnectionMap <$> get
  let connections = S.fromFoldable $ M.toUnfoldable connectionMap >>= \(Tuple relEdge relEdge') -> [ relEdge, relEdge' ]
  signals <- evalBoardScratch inputs
  ports <- allPortsOnBoard

  pure $ M.fromFoldable do
    Tuple relEdge port <- M.toUnfoldable ports :: Array _
    let signal = fromMaybe (Signal 0) (M.lookup relEdge signals)
    let connected = S.member relEdge connections
    pure $ Tuple relEdge { connected, port, signal }