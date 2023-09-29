module Game.Board where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.Error.Class (class MonadError, throwError)
import Control.Monad.Except (Except)
import Control.Monad.State (class MonadState, State, StateT(..), get, gets, modify_)
import Data.Array ((..))
import Data.Array as A
import Data.Array as Array
import Data.Bifunctor (bimap)
import Data.Either (Either(..), isLeft, note)
import Data.FoldableWithIndex (foldrWithIndex)
import Data.Graph (Graph, unfoldGraph)
import Data.Graph as G
import Data.Group (ginverse)
import Data.HeytingAlgebra (ff, tt)
import Data.Int (odd)
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
import Data.Maybe (Maybe(..), fromJust, fromMaybe)
import Data.Monoid as Monoid
import Data.Newtype (class Newtype, unwrap)
import Data.Set as S
import Data.Traversable (all, foldMap, for, traverse)
import Data.Tuple (Tuple(..))
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, Edge(..), Location, Rotation(..), allDirections, edge, edgeDirection, location, matchEdge, rotateDirection, rotation)
import Game.Location as Direction
import Game.Piece (class Piece, APiece(..), Port, eval, getOutputDirs, getPort, isInput, mkPiece, portMatches, ports)
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))

data BoardError
  = LocationOccupied Location
  | LocationNotOccupied Location
  | InvalidBoardInitialisation Int

instance Show BoardError where
  show = case _ of
    LocationOccupied loc -> "Location Occupied: " <> show loc
    LocationNotOccupied loc ->  "Location Not Occupied: " <> show loc
    InvalidBoardInitialisation n -> "Invalid Board Initialisation: " <> show n <> " is not a valid board size"

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
instance Show Board where
  show (Board {size, pieces}) = "Board"

_size :: Lens' Board Int
_size = _Newtype <<< prop (Proxy :: Proxy "size")

_pieces :: Lens' Board (Map Location PieceInfo)
_pieces = _Newtype <<< prop (Proxy :: Proxy "pieces")

_ports :: Getter' Board (Map CardinalDirection Port)
_ports = to portsBoard 

emptyBoard :: Int -> Either BoardError Board
emptyBoard n = 
  if odd n && n >= 1
    then Right $ Board { size: n, pieces: M.empty }
    else Left $ InvalidBoardInitialisation n


standardBoard :: Board
standardBoard = Board { size: 3, pieces: M.empty }

-- todo: ensure that this short circuits when the empty loction is found 
firstEmptyLocation :: Board -> Maybe Location
firstEmptyLocation board = A.head do
  let n = board ^. _size
  j <- 0 .. (n - 1)
  i <- 0 .. (n - 1)
  let loc = location i j
  guard (isLeft $ getPieceInfo board loc) $> loc

-- should return either boarderror
getPieceInfo :: Board -> Location -> Either BoardError PieceInfo
getPieceInfo board loc = note (LocationNotOccupied loc) $ preview (_pieces <<< ix loc) board

-- should retun either boarderror
getPortOnEdge :: Board -> RelativeEdge ->  Maybe Port
getPortOnEdge board (Relative (Edge { loc, dir })) = board ^?
  _pieces <<< ix loc <<< to (\p -> getPort p.piece dir) <<< _Just

-- if location is not accupied, reledge == absEdge
toAbsoluteEdge :: Board -> RelativeEdge -> AbsoluteEdge
toAbsoluteEdge board (Relative (Edge { loc, dir })) = case getPieceInfo board loc of
  Right p -> absolute loc (rotateDirection dir p.rotation)
  Left _ -> absolute loc dir

-- if location is not accupied, reledge == absEdge
toRelativeEdge :: Board -> AbsoluteEdge -> RelativeEdge
toRelativeEdge board (Edge { loc, dir }) = case getPieceInfo board loc of
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
  port <- A.fromFoldable $ getPortOnEdge board (toRelativeEdge board (portEdges board dir))
  pure (Tuple dir port)


{-
  piece add/modify/remove
-}
rotatePieceBy :: Location -> Rotation -> Board -> Either BoardError Board
rotatePieceBy loc rot board = Right $ (_pieces <<< ix loc <<< _rotation <>~ rot) board

{-
-}
addPiece :: forall p. Piece p => Location -> p -> Board -> Either BoardError Board
addPiece loc piece board =
  if has (_pieces <<< ix loc) board
    then Left $ LocationOccupied loc
    else Right $ (_pieces <<< at loc .~ Just { piece: mkPiece piece, rotation: rotation 0}) board

removePiece :: Location -> Board -> Either BoardError Board
removePiece loc board =
  if has (_pieces <<< ix loc) board
    then Right $ (_pieces <<< at loc .~ Nothing) board 
    else Left (LocationNotOccupied loc)

---- Board compilation
--{-
--
---}
matchingRelativeEdge :: Board -> RelativeEdge -> RelativeEdge
matchingRelativeEdge board edge1 = 
  let absEdge = toAbsoluteEdge board edge1
  in toRelativeEdge board (matchEdge absEdge)

buildBoardGraph :: Board -> Graph Location Unit
buildBoardGraph board@(Board b) = G.unfoldGraph (S.toUnfoldable $ M.keys b.pieces :: Array Location) (\_ -> unit) \loc -> do
  p <- toListOf (_pieces <<< ix loc) board
  dir <- List.fromFoldable $ getOutputDirs p.piece  
  pure $ relativeEdgeLocation $ matchingRelativeEdge board (relative loc dir)

-- should no be exported! only creates valid maps when f is increasing
unsafeMapKey :: forall k l a. (k -> l) -> Map k a -> Map l a
unsafeMapKey f = go
  where
    go = case _ of
      Map.Leaf -> Map.Leaf
      Map.Two l k v r -> Map.Two (go l) (f k) v (go r)
      Map.Three l k1 v1 m k2 v2 r -> Map.Three (go l) (f k1) v1 (go m) (f k2) v2 (go r)

toLocalInputs :: Location -> Map RelativeEdge Signal -> Map CardinalDirection Signal
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey relativeEdgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: Location -> Map CardinalDirection Signal -> Map RelativeEdge Signal
toGlobalInputs loc = unsafeMapKey (relative loc)

instance Piece Board where
  name _ = "BOARD"
  eval = evalBoard
  ports = portsBoard


evalLocation :: Board -> Map RelativeEdge Signal -> Location -> Map RelativeEdge Signal
evalLocation board acc loc =
  let
    outputs = M.fromFoldable do
      p <- A.fromFoldable $ getPieceInfo board loc
      Tuple relEdge signal <- M.toUnfoldable $ toGlobalInputs loc $ eval p.piece $ toLocalInputs loc acc
      [ Tuple relEdge signal, Tuple (matchingRelativeEdge board relEdge) signal ]
  in
    M.union acc outputs

evalBoard :: Board -> Map CardinalDirection Signal -> Map CardinalDirection Signal
evalBoard board@(Board b) m = extractOutputs $ L.foldl (evalLocation board) initial (G.topologicalSort boardGraph)
  where
    n = b.size

    boardGraph :: Graph Location Unit
    boardGraph = buildBoardGraph board

    initial :: Map RelativeEdge Signal
    initial = M.catMaybes $ M.fromFoldable $ do
      [ Tuple (toRelativeEdge board (absolute (location (n`div`2) 0        ) Direction.Up   )) (M.lookup Direction.Up    m)
      , Tuple (toRelativeEdge board (absolute (location (n-1)     (n`div`2)) Direction.Right)) (M.lookup Direction.Right m)
      , Tuple (toRelativeEdge board (absolute (location (n`div`2) (n-1)    ) Direction.Down )) (M.lookup Direction.Down  m)
      , Tuple (toRelativeEdge board (absolute (location 0         (n`div`2)) Direction.Left )) (M.lookup Direction.Left  m)
      ]

    extractOutputs :: Map RelativeEdge Signal -> Map CardinalDirection Signal
    extractOutputs signals = M.fromFoldable $ A.catMaybes $ absEdgePorts <#> \absEdge -> do
      let relEdge = toRelativeEdge board absEdge
      port <- getPortOnEdge board relEdge
      guard (not (isInput port))
      Tuple (edgeDirection absEdge) <$> M.lookup relEdge signals
      where
        absEdgePorts =
          [ absolute (location (n`div`2) 0        ) Direction.Up
          , absolute (location (n-1)     (n`div`2)) Direction.Right
          , absolute (location (n`div`2) (n-1)    ) Direction.Down
          , absolute (location 0         (n`div`2)) Direction.Left
          ]

singleBoardPiece :: forall p. Piece p => p -> Board
singleBoardPiece piece = Board
  { size: 1
  , pieces: M.singleton (location 0 0) { piece: mkPiece piece, rotation: rotation 0 }
  }