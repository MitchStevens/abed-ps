module Game.Extra.Types where

import Prelude

import Control.Alternative (guard)
import Control.Comonad.Cofree (Cofree)
import Control.Monad.Free (Free, resume, wrap)
import Data.Array as A
import Data.Either (Either(..))
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..))
import Data.List as L
import Data.List.NonEmpty (NonEmptyList)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set.NonEmpty as NES
import Data.Tuple (Tuple(..), fst)
import Game.Board (RelativeEdge(..), edgeDirection, edgeLocation, layerDecomposition, relative)
import Game.Direction (CardinalDirection, allDirections, oppositeDirection)
import Game.Location (Location, followDirection)
import Game.Piece (Piece(..))
import Game.Port (Port, PortType(..), getPortType, portCapacity)
import Game.Rotation (Rotation)
import Game.Signal (Signal)
import Partial.Unsafe (unsafeCrashWith)

type Wormhole = { wormholeIn :: CardinalDirection, wormholeOut :: CardinalDirection }

newtype BoardF a = Board
  { size :: Int
  , ports :: Map CardinalDirection Port
  , pieces :: Map Location { rotation :: Rotation, piece :: a }
  , wormhole :: Maybe Wormhole
  }

instance Functor BoardF where
  -- todo

data CompiledF a = Compiled
  { pieces :: Map Location a
  , ports :: Map CardinalDirection Port
  , layerDecomposition :: List (List Location)
  , frames :: Map Location (Map CardinalDirection RelativeEdge)
  , wormhole :: Maybe Wormhole
  }

instance Functor CompiledF where
  map f (Compiled c) = Compiled (c { pieces = map f c.pieces })

type PieceIndex = List Location

type PortIndex = Tuple PieceIndex CardinalDirection

type CompiledEvaluable =
  { piece :: Map PieceIndex Piece
  , ports :: Map CardinalDirection Port
  , layerDecomposition :: List (List PieceIndex)
  , frames :: Map PieceIndex (Map CardinalDirection PortIndex)
  , wormholes :: List Wormhole
  }

-- | One board level: `b`'s children are already compiled (each a
-- | `Free CompiledF Piece`, from an earlier, deeper call to `compileNode`
-- | via `mapFree`), so this only has to work out *this* level's own
-- | connectivity -- grid-adjacency matching within `b.pieces`, plus
-- | resolving `b.wormhole` (if any) down to real addresses.
compileNode :: BoardF (Free CompiledF Piece) -> CompiledF (Free CompiledF Piece)
compileNode (Board b) = Compiled
  { pieces: map (_.piece) b.pieces
  , ports: b.ports
  , layerDecomposition: layers
  , frames: M.fromFoldable frameEntries
  , wormhole: b.wormhole
  }
  where
  locations :: List Location
  locations = L.fromFoldable (M.keys b.pieces)

  -- a leaf piece's own ports, or (it's already compiled, one level down)
  -- a nested board's declared boundary ports -- either way, what this
  -- cell presents to its neighbors.
  portsOf :: Free CompiledF Piece -> Map CardinalDirection Port
  portsOf cell = case resume cell of
    Right (Piece p) -> p.ports
    Left (Compiled c) -> c.ports

  portAt :: Location -> Map CardinalDirection Port
  portAt loc = maybe M.empty (portsOf <<< _.piece) (M.lookup loc b.pieces)

  neighborEdge :: RelativeEdge -> RelativeEdge
  neighborEdge edge = relative (followDirection (edgeLocation edge) (edgeDirection edge)) (oppositeDirection (edgeDirection edge))

  -- the interior neighbor for one port, if this board has a piece there
  -- with a compatible port
  matchAt :: Location -> CardinalDirection -> Maybe (Tuple RelativeEdge Port)
  matchAt loc dir = do
    port <- M.lookup dir (portAt loc)
    let
      adjEdge = neighborEdge (relative loc dir)
      adjLoc = edgeLocation adjEdge
    guard (M.member adjLoc b.pieces)
    adjPort <- M.lookup (edgeDirection adjEdge) (portAt adjLoc)
    guard (portsMatch port adjPort)
    pure (Tuple adjEdge adjPort)

  connectionAt :: Location -> CardinalDirection -> Maybe (Tuple RelativeEdge RelativeEdge)
  connectionAt loc dir = do
    port <- M.lookup dir (portAt loc)
    Tuple adjEdge _ <- matchAt loc dir
    case getPortType port of
      Input -> pure (Tuple (relative loc dir) adjEdge)
      Output -> pure (Tuple adjEdge (relative loc dir))
      _ -> Nothing

  allLocDirs :: List (Tuple Location CardinalDirection)
  allLocDirs = do
    loc <- locations
    dir <- L.fromFoldable allDirections
    pure (Tuple loc dir)

  -- this board's own declared boundary port in `dir`, resolved down to
  -- whichever interior piece actually sits at the true grid edge there.
  -- Assumes one such piece per direction, same as `EvaluableBoard.terminals`.
  boundaryEdge :: CardinalDirection -> Maybe RelativeEdge
  boundaryEdge dir = case L.filter isEdgeHere locations of
    Cons loc _ -> Just (relative loc dir)
    Nil -> Nothing
    where
    isEdgeHere loc = not (M.member (followDirection loc dir) b.pieces) && M.member dir (portAt loc)

  -- the mouth (output side) buffers a value the tail (input side) reads
  -- back one tick later -- resolved the same reader -> writer way as
  -- `wormholeInAt`, just across this board's own boundary instead of
  -- within one piece.
  boardWormhole :: Maybe (Tuple RelativeEdge RelativeEdge)
  boardWormhole = do
    Tuple mouthDir tailDir <- b.wormhole
    mouthEdge <- boundaryEdge mouthDir
    tailEdge <- boundaryEdge tailDir
    pure (Tuple tailEdge mouthEdge)

  frameAt :: Location -> CardinalDirection -> Port -> RelativeEdge
  frameAt loc dir port = case boardWormhole of
    Just (Tuple tailEdge mouthEdge) | edgeLocation tailEdge == loc && edgeDirection tailEdge == dir -> mouthEdge
    _ -> case getPortType port of
      Input -> maybe (relative loc dir) fst (matchAt loc dir)
      WormholeOut -> maybe (relative loc dir) (relative loc) (wormholeInAt loc)
      _ -> relative loc dir

  frameEntries :: List (Tuple Location (Map CardinalDirection RelativeEdge))
  frameEntries = locations <#> \loc -> Tuple loc (mapWithIndex (frameAt loc) (portAt loc))

  layers :: List (List Location)
  layers = case layerDecomposition locations connections of
    Just ls -> map NES.toUnfoldable ls
    Nothing -> unsafeCrashWith "compileNode: connection graph is cyclic"


-- | What can sit in a single board `Location`: a leaf is a real `Piece`
-- | (`Pure`), a branch is a nested `BoardF` (`Free`) occupying that same
-- | slot. Nesting never surfaces past `compile` -- see `compileNode`.
type Cell = Free BoardF Piece

-- | The root is always a real board. Forcing it open a level (rather than
-- | reusing `Cell`, which would let the whole thing be a bare `Pure Piece`
-- | with no enclosing board at all) is what makes `PieceIndex` honestly
-- | non-empty: every piece is reached by descending through at least one
-- | `Location`.
type Evaluable = BoardF Cell

-- | The path of locations from the root down to a leaf piece. Never empty,
-- | per `Evaluable` above.
type PieceIndex = NonEmptyList Location

-- | One port of one piece, addressed globally.
type PortIndex = Tuple PieceIndex CardinalDirection

type CompiledEvaluable =
  { pieces :: Map PieceIndex Piece
  , layerDecomposition :: List (List PieceIndex)
  , frames :: Cofree (Map Location) (Map CardinalDirection PortIndex)
  , connections :: Map PortIndex PortIndex
  , wormholes :: Map PortIndex PortIndex
  }

type EvalState = Map PortIndex Signal

mapFree :: forall f g a. Functor f => (f (Free g a) -> g (Free g a)) -> Free f a -> Free g a
mapFree f = go
  where
  go free = case resume free of
    Right a -> pure a
    Left fa -> wrap (f (map go fa))
