module Game.Board where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Control.Monad.Except (class MonadTrans, Except, ExceptT, lift, runExcept, runExceptT)
import Control.Monad.State (class MonadState, State, StateT(..), get, gets, modify_, put, runStateT)
import Data.Array ((..))
import Data.Array as A
import Data.Array as Array
import Data.Bifunctor (bimap)
import Data.Either (Either(..), either, fromRight, hush, isLeft, note)
import Data.Foldable (class Foldable, all, find, foldM, for_)
import Data.FoldableWithIndex (foldrWithIndex)
import Data.Graph (Graph, unfoldGraph)
import Data.Graph as G
import Data.Group (ginverse)
import Data.HeytingAlgebra (ff, tt)
import Data.Identity (Identity)
import Data.Int (even, odd)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.List (List)
import Data.List as L
import Data.List as List
import Data.Map (Map, fromFoldableWithIndex)
import Data.Map as M
import Data.Map.Internal as Map
import Data.Maybe (Maybe(..), fromJust, fromMaybe, isJust, isNothing, maybe)
import Data.Monoid as Monoid
import Data.Newtype (class Newtype, unwrap)
import Data.Set (Set)
import Data.Set as S
import Data.Traversable (all, foldMap, for, sequence, traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Debug (spy, trace)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, Edge(..), Location(..), Rotation(..), allDirections, edge, edgeDirection, location, matchEdge, rotateDirection, rotation)
import Game.Location as Direction
import Game.Piece (class Piece, APiece(..), PieceId(..), eval, getOutputDirs, getPort)
import Game.Piece.Port (Port, isInput)
import Halogen.Store.Monad (class MonadStore)
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))

data BoardError
  = LocationOccupied Location
  | LocationNotOccupied Location
  | InvalidBoardInitialisation Int
  | BadBoardSize Int
derive instance Eq BoardError

instance Show BoardError where
  show = case _ of
    LocationOccupied loc -> "Location Occupied: " <> show loc
    LocationNotOccupied loc ->  "Location Not Occupied: " <> show loc
    InvalidBoardInitialisation n -> "Invalid Board Initialisation: " <> show n <> " is not a valid board size"
    BadBoardSize n -> "Boards of size " <>  show n <>" are not valid"

newtype RelativeEdge = Relative Edge
derive instance Newtype RelativeEdge _
derive instance Eq RelativeEdge
derive instance Ord RelativeEdge
instance Show RelativeEdge where
  show (Relative (Edge { loc, dir })) = "RelEdge " <> show loc <> " " <> show dir

relative :: Location -> CardinalDirection -> RelativeEdge
relative loc dir = Relative (edge loc dir)

relativeEdgeLocation :: RelativeEdge -> Location
relativeEdgeLocation (Relative (Edge {loc, dir})) = loc

relativeEdgeDirection :: RelativeEdge -> CardinalDirection
relativeEdgeDirection (Relative (Edge {loc, dir})) = dir

type AbsoluteEdge = Edge

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

_ports :: Getter' Board (Map CardinalDirection Port)
_ports = to portsBoard 

newtype BoardT m a = BoardT (StateT Board (ExceptT BoardError m) a)
derive instance Newtype (BoardT m a) _
derive newtype instance Functor m => Functor (BoardT m)
derive newtype instance Monad m => Apply (BoardT m)
derive newtype instance Monad m => Applicative (BoardT m)
derive newtype instance Monad m => Bind (BoardT m)
derive newtype instance Monad m => Monad (BoardT m)
derive newtype instance Monad m => MonadState Board (BoardT m)
derive newtype instance Monad m => MonadThrow BoardError (BoardT m)
instance MonadTrans BoardT where
  lift m = BoardT (lift $ lift m)

type BoardM a = BoardT Identity a

runBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError (Tuple a Board))
runBoardT boardM b = runExceptT $ runStateT (unwrap boardM) b

evalBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError a)
evalBoardT boardM b = map fst <$> runBoardT boardM b

execBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError Board)
execBoardT boardM b = map snd <$> runBoardT boardM b

runBoardM :: forall a. BoardM a -> Board -> Either BoardError (Tuple a Board)
runBoardM boardM b = unwrap $ runBoardT boardM b

evalBoardM :: forall a. BoardM a -> Board -> Either BoardError a
evalBoardM boardM b = unwrap $ evalBoardT boardM b

execBoardM :: forall a. BoardM a -> Board -> Either BoardError Board
execBoardM boardM b = unwrap $ execBoardT boardM b


emptyBoard :: Int -> Either BoardError Board
emptyBoard n = 
  if odd n && n >= 1
    then Right $ Board { size: n, pieces: M.empty }
    else Left $ InvalidBoardInitialisation n

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

-- should return either boarderror
getPieceInfo :: forall m. Monad m => Location -> BoardT m PieceInfo
getPieceInfo loc =
  gets ((preview (_pieces <<< ix loc))) >>=
    maybe (throwError (LocationNotOccupied loc)) pure

getPiece :: forall m. Monad m => Location -> BoardT m APiece
getPiece loc = (_.piece) <$> getPieceInfo loc

-- should retun either boarderror
getPortOnEdge ::forall m. Monad m => RelativeEdge -> BoardT m (Maybe Port)
getPortOnEdge (Relative (Edge { loc, dir })) = do
  piece <- getPiece loc
  --pure $ spy ("on edge:" <> show relEdge <> " has port: " <> show (getPort piece dir)) $ getPort piece dir
  pure $ getPort piece dir

-- if location is not accupied, reledge == absEdge
toAbsoluteEdge :: forall m. Monad m => RelativeEdge -> BoardT m AbsoluteEdge
toAbsoluteEdge (Relative (Edge { loc, dir })) = do
  board <- get
  pure $ case evalBoardM (getPieceInfo loc) board of
    Left _ -> absolute loc dir
    Right p -> absolute loc (rotateDirection dir p.rotation)

-- if location is not accupied, reledge == absEdge
toRelativeEdge :: forall m. Monad m => AbsoluteEdge -> BoardT m RelativeEdge
toRelativeEdge (Edge { loc, dir }) = do
  board <- get
  pure $ case evalBoardM (getPieceInfo loc) board of
    Right p -> relative loc (rotateDirection dir (ginverse p.rotation))
    Left _ -> relative loc dir

portEdges :: Board -> CardinalDirection -> AbsoluteEdge
portEdges (Board b) dir = 
  let n = b.size
  in case dir of
    Direction.Up    -> absolute (location (n`div`2) 0        ) dir 
    Direction.Right -> absolute (location (n-1)     (n`div`2)) dir
    Direction.Down  -> absolute (location (n`div`2) (n-1)    ) dir
    Direction.Left  -> absolute (location 0         (n`div`2)) dir

-- do not export 
portsBoard :: Board -> Map CardinalDirection Port
portsBoard board = M.fromFoldable $ allDirections >>= \dir -> do
  port <- A.catMaybes $ A.fromFoldable $ flip evalBoardM board $ do
    relEdge <- toRelativeEdge (portEdges board dir)
    getPortOnEdge relEdge
  pure (Tuple dir port)


{-
  piece add/rotate/remove
-}
rotatePieceBy :: forall m. Monad m => Location -> Rotation -> BoardT m Unit
rotatePieceBy loc rot = do
  _ <- getPiece loc
  _pieces <<< ix loc <<< _rotation <>= rot

addPiece :: forall m. Monad m => Location -> APiece -> BoardT m Unit
addPiece loc piece = do
  pieceInfo <- use (_pieces <<< at loc)
  case pieceInfo of
    Nothing -> _pieces <<< at loc .= Just { piece, rotation: rotation 0 }
    Just _ -> throwError (LocationOccupied loc)

removePiece :: forall m. Monad m => Location -> BoardT m APiece
removePiece loc = do
  piece <- getPiece loc
  _pieces <<< at loc .= Nothing
  pure piece

movePiece :: forall m. Monad m => Location -> Location -> BoardT m Unit
movePiece src dst = do
  pieceInfoSrc <- use (_pieces <<< at src)
  pieceInfoDst <- use (_pieces <<< at dst)
  when (isNothing pieceInfoSrc) do
    throwError (LocationNotOccupied src)
  when (isJust pieceInfoDst) do
    throwError (LocationOccupied dst)
  _pieces <<< at src .= Nothing
  _pieces <<< at dst .= pieceInfoSrc


{-
  change size
-}
validBoardSize :: forall m. MonadThrow BoardError m => Int -> m Int
validBoardSize n =
  if even n || n < 3 || n > 9
    then throwError (BadBoardSize n)
    else pure n

decreaseSize :: forall m. Monad m => BoardT m Unit
decreaseSize = do
  Board {size: n, pieces} <- get
  newSize <- validBoardSize (n-2)
  let insideSquare (Location {x, y}) = all (between 1 n) [x, y]
  let firstPieceOusideSquare = find (not <<< insideSquare) (M.keys pieces) 
  case firstPieceOusideSquare of
    Just loc -> throwError (LocationOccupied loc)
    Nothing -> put $ Board
      { size: newSize
      , pieces: unsafeMapKey (\(Location {x, y}) -> location (x-1) (y-1)) pieces }


increaseSize :: forall m. Monad m => BoardT m Unit
increaseSize = do
  Board { size: n, pieces } <- get
  newSize <- validBoardSize (n+2)
  put $ Board
    { size: newSize
    , pieces: unsafeMapKey (\(Location {x, y}) -> location (x+1) (y+1)) pieces }

---- Board compilation
--{-
--
---}
matchingRelativeEdge :: forall m. Monad m => RelativeEdge -> BoardT m RelativeEdge
matchingRelativeEdge edge1 = do
  absEdge <- toAbsoluteEdge edge1
  toRelativeEdge (matchEdge absEdge)

buildBoardGraph :: Board -> Graph Location Unit
buildBoardGraph board@(Board b) = G.unfoldGraph (S.toUnfoldable $ M.keys b.pieces :: Array Location) (\_ -> unit) \loc -> do
  p <- toListOf (_pieces <<< ix loc) board
  dir <- List.fromFoldable $ getOutputDirs p.piece
  relEdge <- List.fromFoldable $ evalBoardM (matchingRelativeEdge (relative loc dir)) board
  pure $ relativeEdgeLocation relEdge

-- should no be exported! only creates valid maps when f is increasing
unsafeMapKey :: forall k l a. (k -> l) -> Map k a -> Map l a
unsafeMapKey f = go
  where
    go = case _ of
      Map.Leaf -> Map.Leaf
      Map.Two l k v r -> Map.Two (go l) (f k) v (go r)
      Map.Three l k1 v1 m k2 v2 r -> Map.Three (go l) (f k1) v1 (go m) (f k2) v2 (go r)

getConnectedPorts :: forall m. Monad m => Location -> BoardT m (Array RelativeEdge)
getConnectedPorts loc = do
  connectedPorts <- for allDirections $ \dir -> do
    let relEdge = relative loc dir
    relEdge' <- matchingRelativeEdge relEdge
    b <- isJust <$> getPortOnEdge relEdge'
    pure $ if b then [ relEdge, relEdge' ] else []
  pure (join connectedPorts)

toLocalInputs :: Location -> Map RelativeEdge Signal -> Map CardinalDirection Signal
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey relativeEdgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: Location -> Map CardinalDirection Signal -> Map RelativeEdge Signal
toGlobalInputs loc = unsafeMapKey (relative loc)

instance Piece Board where
  name _ = PieceId "board"
  eval board inputs = either (\s -> unsafeCrashWith ("couldnt eval: " <> show s)) identity $
    flip evalBoardM board (evalBoardScratch inputs >>= extractOutputs)
  ports = portsBoard


-- boardEvaluation
evalLocation :: forall m. Monad m => Map RelativeEdge Signal -> Location -> BoardT m (Map RelativeEdge Signal)
evalLocation acc loc = M.union acc <$> do
    p <- getPieceInfo loc 
    let outputs = toGlobalInputs loc (eval p.piece (toLocalInputs loc acc))
    adjacentInputs <- map M.fromFoldable <$> for (M.toUnfoldable outputs :: Array _) $ \(Tuple relEdge signal) -> do
      matching <- matchingRelativeEdge relEdge
      pure (Tuple matching signal)
    pure $ M.union outputs adjacentInputs

-- this should not be this difficult!!
extractOutputs :: forall m. Monad m => Map RelativeEdge Signal -> BoardT m (Map CardinalDirection Signal)
extractOutputs signals = M.fromFoldable <$> A.catMaybes <$> do
  ports <- absEdgePorts
  for ports \(absEdge :: AbsoluteEdge) -> do
    relEdge <- toRelativeEdge absEdge
    (maybePort :: Maybe Port) <- map (fromRight Nothing) $ evalBoardT (getPortOnEdge relEdge) =<< get
    pure $ maybePort >>= \port ->
      if not (isInput port) 
        then Tuple (edgeDirection absEdge) <$> (M.lookup relEdge signals) 
        else Nothing
  where
    absEdgePorts = do
      n <- use _size
      pure $
        [ absolute (location (n`div`2) 0        ) Direction.Up
        , absolute (location (n-1)     (n`div`2)) Direction.Right
        , absolute (location (n`div`2) (n-1)    ) Direction.Down
        , absolute (location 0         (n`div`2)) Direction.Left
        ]

evalBoardScratch :: forall m. Monad m => Map CardinalDirection Signal -> BoardT m (Map RelativeEdge Signal)
evalBoardScratch m = do 
  boardGraph <- buildBoardGraph <$> get
  n <- use _size 
  let locationsToEvaluate = G.topologicalSort boardGraph
  initialValues <- initial n
  L.foldM evalLocation initialValues locationsToEvaluate

  where
    initial :: Int -> BoardT m (Map RelativeEdge Signal)
    initial n = M.catMaybes <<< M.fromFoldable <$> sequence
      [ Tuple <$> toRelativeEdge (absolute (location (n`div`2) 0        ) Direction.Up   ) <*> pure (M.lookup Direction.Up    m)
      , Tuple <$> toRelativeEdge (absolute (location (n-1)     (n`div`2)) Direction.Right) <*> pure (M.lookup Direction.Right m)
      , Tuple <$> toRelativeEdge (absolute (location (n`div`2) (n-1)    ) Direction.Down ) <*> pure (M.lookup Direction.Down  m)
      , Tuple <$> toRelativeEdge (absolute (location 0         (n`div`2)) Direction.Left ) <*> pure (M.lookup Direction.Left  m)
      ]

--singleBoardPiece :: forall p. Piece p => p -> Board
--singleBoardPiece piece = Board
--  { size: 1
--  , pieces: M.singleton (location 0 0) { piece: mkPiece piece, rotation: rotation 0 }
--  }