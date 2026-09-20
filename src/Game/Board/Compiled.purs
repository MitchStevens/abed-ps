-- `PieceIndex`/`PortIndex` live in `Game.Frame` (which `Game.FrameM` needs, and
-- can't import this module without a cycle); re-exported so existing importers
-- of them from here are unaffected.
module Game.Board.Compiled (module Game.Board.Compiled, module Game.Frame) where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Free (Free, resume, wrap)
import Data.Bifunctor (bimap, lmap)
import Data.Either (Either(..))
import Data.Foldable (foldMap, foldl)
import Data.FoldableWithIndex (foldlWithIndex)
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, fromMaybe', maybe)
import Data.Set.NonEmpty as NES
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..), fst, snd)
import Data.Group (ginverse)
import Game.Board.Edge (RelativeEdge(..), edgeDirection, edgeLocation, relative)
import Game.Board.LayerDecomp (LayerDecomp(..), layerDecomposition, layers)
import Game.Board.Types (Board(Board), BoardError(Cyclic), BoardF(BoardF), WormholeF)
import Game.Direction (CardinalDirection, allDirections, oppositeDirection, rotateDirection)
import Game.Frame (PieceIndex, PortIndex)
import Game.Frame as Frame
import Game.Location (Location, followDirection)
import Game.Piece (Piece(..), eval, getPorts, getWormhole, truncateInputs)
import Game.Port (Port, PortType(..), getPortType, hasPort, isInput, isOutput, isWritable, noPort, portMatches)
import Game.PortInfo (PortInfo, noPortInfo)
import Game.Rotation (Rotation, rotation)
import Game.Signal (Signal)
import Partial.Unsafe (unsafeCrashWith)


data CompiledF a = Compiled
  { pieces :: Map Location a
  , ports :: Frame.Frame Port
  -- every genuinely unmatched, edge-facing port anywhere at this level,
  -- keyed by the absolute (grid) side it faces and resolved down to
  -- whichever interior piece it belongs to -- see
  -- `compileNode.allBoundaryEdges`. A missing direction just means no
  -- piece happens to expose a boundary port on that side.
  , boundaryEdges :: Map CardinalDirection RelativeEdge
  -- `Nothing` when this level's own connection graph is cyclic -- see
  -- `Game.Board.LayerDecomp.layerDecomposition`. No longer resolved (and
  -- crashed on) here; `combine` is what turns this into a real
  -- `BoardError` for the whole `compile` call.
  , layerDecomposition :: Maybe (List (List Location))
  , frames :: Map Location (Map CardinalDirection RelativeEdge)
  -- the board's own wormhole declaration, already resolved down to a
  -- concrete `RelativeEdge` at each end -- `wormholeIn` the mouth,
  -- `wormholeOut` the tail, same convention as `Game.Board.Types.Wormhole`
  -- -- see `compileNode.boardWormhole`.
  , wormhole :: Maybe (WormholeF RelativeEdge)
  }

instance Functor CompiledF where
  map f (Compiled c) = Compiled (c { pieces = map f c.pieces })

-- | One board level: `b`'s children are already compiled (each a
-- | `Free CompiledF Piece`, from an earlier, deeper call to `compileNode`
-- | via `mapFree`), so this only has to work out *this* level's own
-- | connectivity -- grid-adjacency matching within `b.pieces`, plus
-- | resolving `b.wormhole` (if any) down to real addresses.
compileNode :: BoardF (Free CompiledF Piece) -> CompiledF (Free CompiledF Piece)
compileNode (BoardF b) = Compiled
  { pieces: map (_.piece) b.pieces
  , ports: b.ports
  , boundaryEdges: allBoundaryEdges
  , layerDecomposition: map (map NES.toUnfoldable) (layerDecomposition locations connections)
  , frames: M.fromFoldable frameEntries
  , wormhole: boardWormhole
  }
  where
  locations :: List Location
  locations = L.fromFoldable (M.keys b.pieces)

  -- a leaf piece's own ports, or (it's already compiled, one level down)
  -- a nested board's declared boundary ports -- either way, what this
  -- cell presents to its neighbors.
  portsOf :: Free CompiledF Piece -> Frame.Frame Port
  portsOf cell = case resume cell of
    Right (Piece p) -> p.ports
    Left (Compiled c) -> c.ports

  -- a piece's own ports, in its own canonical/unrotated frame -- what
  -- `eval`/`frames`/`ports` all key by, same as before.
  portAt :: Location -> Frame.Frame Port
  portAt loc = maybe (pure noPort) (portsOf <<< _.piece) (M.lookup loc b.pieces)

  rotationAt :: Location -> Rotation
  rotationAt loc = maybe (rotation 0) _.rotation (M.lookup loc b.pieces)

  -- `loc`'s own ports, keyed by the *absolute* (grid) direction they
  -- actually face once its own placed `Rotation` is applied -- same
  -- canonical-to-absolute conversion `Game.Board.Edge.toAbsoluteEdge` does,
  -- just inlined here since `compileNode` works off a raw `BoardF` rather
  -- than the `MonadState Board` machinery that class uses.
  absolutePortAt :: Location -> Frame.Frame Port
  absolutePortAt loc = Frame.tabulate \absDir -> Frame.index (toLocalDir loc absDir) (portAt loc)

  -- the inverse of `absolutePortAt`'s direction conversion -- an absolute
  -- (grid) direction at `loc`, back down to `loc`'s own canonical direction.
  toLocalDir :: Location -> CardinalDirection -> CardinalDirection
  toLocalDir loc absDir = rotateDirection absDir (ginverse (rotationAt loc))

  -- the interior neighbor for one of `loc`'s own (canonical) ports, if this
  -- board has a piece there with a compatible port facing back -- resolved
  -- via each side's *absolute* direction, since that's the only frame grid
  -- adjacency (`followDirection`) makes sense in; the result is handed back
  -- addressed by the neighbor's own canonical direction, same convention as
  -- every other `RelativeEdge` here.
  matchAt :: Location -> CardinalDirection -> Maybe (Tuple RelativeEdge Port)
  matchAt loc localDir = do
    port <- Frame.lookupWhere hasPort localDir (portAt loc)
    let
      absDir = rotateDirection localDir (rotationAt loc)
      adjLoc = followDirection loc absDir
    guard (M.member adjLoc b.pieces)
    let adjAbsDir = oppositeDirection absDir
    adjPort <- Frame.lookupWhere hasPort adjAbsDir (absolutePortAt adjLoc)
    guard (portMatches port adjPort)
    pure (Tuple (relative adjLoc (toLocalDir adjLoc adjAbsDir)) adjPort)

  connectionAt :: Location -> CardinalDirection -> Maybe (Tuple RelativeEdge RelativeEdge)
  connectionAt loc dir = do
    port <- Frame.lookupWhere hasPort dir (portAt loc)
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

  connections :: Map RelativeEdge RelativeEdge
  connections = M.fromFoldable $ L.mapMaybe (\(Tuple loc dir) -> connectionAt loc dir) allLocDirs

  -- every genuinely unmatched, board-edge-facing port anywhere at this
  -- level, keyed by the *absolute* (grid) side it faces -- structural, not
  -- gated by `b.ports` at all: a piece can expose a boundary port on a
  -- side the board hasn't declared (or has declared differently), and this
  -- still has to find it, since it's what evaluation/rendering actually
  -- reads and writes at that side. Assumes at most one such piece per
  -- side, same as the old `EvaluableBoard.terminals` -- see
  -- `CompiledBoard.boundaryPorts`.
  allBoundaryEdges :: Map CardinalDirection RelativeEdge
  allBoundaryEdges = M.fromFoldable do
    loc <- locations
    Tuple absDir _ <- L.filter (hasPort <<< snd) (Frame.toListWithIndex (absolutePortAt loc))
    guard (not (M.member (followDirection loc absDir) b.pieces))
    pure (Tuple absDir (relative loc (toLocalDir loc absDir)))

  -- `allBoundaryEdges`, one side at a time -- only `boardWormhole` needs
  -- this shape (looking up its own two declared directions specifically).
  boundaryEdge :: CardinalDirection -> Maybe RelativeEdge
  boundaryEdge dir = M.lookup dir allBoundaryEdges

  -- the mouth (output side) buffers a value the tail (input side) reads
  -- back one tick later -- resolved the same reader -> writer way as
  -- `connectionAt`, just across this board's own boundary instead of
  -- between two interior pieces. `wormholeIn` always names the mouth and
  -- `wormholeOut` always names the tail -- same convention as
  -- `Game.Piece.Types.getWormhole` (`wormholeOut` reads back what was
  -- written to `wormholeIn` one tick earlier).
  boardWormhole :: Maybe (WormholeF RelativeEdge)
  boardWormhole = do
    { wormholeIn, wormholeOut } <- b.wormhole
    mouthEdge <- boundaryEdge wormholeIn
    tailEdge <- boundaryEdge wormholeOut
    pure { wormholeIn: mouthEdge, wormholeOut: tailEdge }

  -- where a port's signal comes from (input-typed, including `WormholeIn`
  -- -- see `evaluate`, which reads `WormholeOut` straight off its own edge
  -- instead, seeded by the tick buffer, so it's never resolved here): the
  -- wormhole tail is special-cased to read from the mouth; anything else
  -- with a grid neighbor reads from it; anything else at all -- a true
  -- boundary port, or any output -- is left pointing at its own edge, for
  -- whoever embeds this board to resolve further.
  frameAt :: Location -> CardinalDirection -> Port -> RelativeEdge
  frameAt loc dir port = case boardWormhole of
    Just { wormholeOut: tailEdge, wormholeIn: mouthEdge } | edgeLocation tailEdge == loc && edgeDirection tailEdge == dir -> mouthEdge
    _ | isInput port -> maybe (relative loc dir) fst (matchAt loc dir)
    _ -> relative loc dir

  frameEntries :: List (Tuple Location (Map CardinalDirection RelativeEdge))
  frameEntries = locations <#> \loc -> Tuple loc (mapWithIndex (frameAt loc) (Frame.toMapBy hasPort (portAt loc)))


newtype CompiledBoard = CompiledBoard
  { pieces :: Map PieceIndex Piece
  , ports :: Frame.Frame Port
  -- | This board's own declared boundary ports, each resolved down to the
  -- | `PortIndex` of whichever interior piece actually reads/writes it --
  -- | the `CompiledBoard` equivalent of the old `EvaluableBoard.terminals`.
  -- | Whoever embeds/drives this board (a live UI, a test) uses this to
  -- | seed an external input's `PortIndex` in the `Map PortIndex Signal`
  -- | passed to `evaluate`, or to read an external output back out of the
  -- | result -- see `injectBoundaryInputs`/`extractBoundaryOutputs`.
  , boundaryPorts :: Map CardinalDirection PortIndex
  , layerDecomposition :: List (List PieceIndex)
  , frames :: Map PieceIndex (Map CardinalDirection PortIndex)
  , wormholes :: List (Tuple PortIndex PortIndex)
  }

derive instance Eq CompiledBoard
instance Show CompiledBoard where
  show (CompiledBoard c) = "(CompiledBoard " <> show c <> ")"

-- | Rewrite a `CompiledBoard`'s own addressing to sit one level deeper, at
-- | `loc`, inside a parent board -- once `combine` has flattened a nested
-- | board on its own terms, this is how the parent folds that result into
-- | its own, globally-addressed one.
appendLocation :: Location -> CompiledBoard -> CompiledBoard
appendLocation loc (CompiledBoard c) = CompiledBoard
  { pieces: unsafeMapKey (Cons loc) c.pieces
  , ports: pure noPort -- a child's own boundary ports are already spent resolving *this* level's connections in `compileNode`; nothing above ever needs them again, see `combine`
  , boundaryPorts: M.empty -- same reasoning as `ports` -- only ever meaningful at the level that declared it
  , layerDecomposition: (map <<< map) (Cons loc) c.layerDecomposition
  -- the outer map is keyed the same way `pieces` is, so rekeying it is the
  -- same trick -- the *values* are `PortIndex`es needing the same
  -- treatment as `wormholes` below, via the same `prefixPortIndex`.
  , frames: map (map prefixPortIndex) (unsafeMapKey (Cons loc) c.frames)
  -- `Cons loc` only ever grows a `PieceIndex` at the front, so it's
  -- monotonic on `PortIndex`'s (derived, lexicographic-on-the-`PieceIndex`)
  -- `Ord` too -- safe to rekey with directly via `unsafeMapKey`, same as
  -- `pieces`/`frames` above. The values are just as much `PortIndex`es as
  -- the keys, but there's no ordering invariant to preserve there, so a
  -- plain `map` is all that's needed. `PortIndex` is a `Tuple PieceIndex
  -- CardinalDirection`, so `lmap` is what threads `Cons loc` through
  -- just the `PieceIndex` half.
  --
  -- `wormholes` isn't looked up by key at all -- see `CompiledBoard` --
  -- it's just a list of pairs, so both sides of each pair get the same
  -- treatment as any other `PortIndex`, via `bimap`.
  , wormholes: map (bimap prefixPortIndex prefixPortIndex) c.wormholes
  }
  where
  prefixPortIndex :: PortIndex -> PortIndex
  prefixPortIndex = lmap (Cons loc)

-- | A leaf piece's own `WormholeIn`/`WormholeOut` ports (if it has one of
-- | each -- see `Game.Piece.Types.getWormhole`), addressed as a single
-- | tail -> mouth `PortIndex` pair at `idx`. Shared by `leafBoard` (`idx` a
-- | real `Location` path) and `compilePiece` (`idx = Nil`, the bare-root
-- | case) -- same convention as `compileNode.boardWormhole` and
-- | `combine.ownWormhole` above: `wormholeOut` is the tail, `wormholeIn`
-- | the mouth.
wormholePairs :: PieceIndex -> Piece -> List (Tuple PortIndex PortIndex)
wormholePairs idx piece = maybe Nil pairFor (getWormhole piece)
  where
  pairFor w = L.singleton (Tuple (Tuple idx w.wormholeOut) (Tuple idx w.wormholeIn))

-- | A single leaf piece, addressed by the one `Location` it sits at.
leafBoard :: Location -> Piece -> CompiledBoard
leafBoard loc piece = CompiledBoard
  { pieces: M.singleton (L.singleton loc) piece
  , ports: pure noPort -- irrelevant for a leaf, see `appendLocation`
  , boundaryPorts: M.empty -- irrelevant for a leaf, see `appendLocation`
  , layerDecomposition: L.singleton (L.singleton (L.singleton loc))
  , frames: M.empty -- filled in one level up, by the parent's own `combine` (via `ownFrames`) -- a bare leaf has nothing to say about itself
  , wormholes: wormholePairs (L.singleton loc) piece
  }

mapFree :: forall f g a. Functor f => (f (Free g a) -> g (Free g a)) -> Free f a -> Free g a
mapFree f = go
  where
  go free = case resume free of
    Right a -> pure a
    Left fa -> wrap (f (map go fa))

compilePiece :: Piece -> CompiledBoard
compilePiece piece@(Piece p) = CompiledBoard
  { pieces: M.singleton idx piece
  , ports: p.ports
  , boundaryPorts: mapWithIndex (\dir _ -> Tuple idx dir) presentPorts
  , layerDecomposition: Cons (Cons idx Nil) Nil
  , frames: M.singleton idx (mapWithIndex (\dir _ -> (Tuple idx dir)) presentPorts)
  , wormholes: wormholePairs idx piece
  }
  where
    -- a bare piece isn't nested under any `Location` at all -- see
    -- `PieceIndex` -- so its index is the empty path.
    idx :: PieceIndex
    idx = Nil

    -- `boundaryPorts`/`frames` are still sparse maps: only the sides that
    -- actually have a port.
    presentPorts :: Map CardinalDirection Port
    presentPorts = Frame.toMapBy hasPort p.ports

-- | Flatten a `Board`'s nesting into one globally-addressed `CompiledBoard`:
-- | `compileNode` first resolves each level's own local connectivity,
-- | bottom-up (via `mapFree`); `combine` then walks back down, folding
-- | every nested board's own `CompiledBoard` into its parent's. `Left Cyclic`
-- | if any level's own connection graph (`compileNode`'s
-- | `layerDecomposition`) turned out to be cyclic -- a board this can happen
-- | to is easy to reach through ordinary play (two outputs wired into each
-- | other), so this has to be a real error rather than a crash.
compile :: Board -> Either BoardError CompiledBoard
compile (Board board) = go (mapFree compileNode board)
  where
  go :: Free CompiledF Piece -> Either BoardError CompiledBoard
  go free = case resume free of
    Left compiledF -> combine compiledF
    Right piece -> Right (compilePiece piece)

  combine :: CompiledF (Free CompiledF Piece) -> Either BoardError CompiledBoard
  combine (Compiled c) = do
    theseLayers <- maybe (Left Cyclic) Right c.layerDecomposition
    -- keys are disjoint by construction (each child's own keys were just
    -- prefixed with its distinct `Location` in `childBoards`), so the
    -- left/right bias of these unions never actually matters.
    childBoards <- forWithIndex c.pieces childBoard
    let
      childLayers :: Location -> LayerDecomp PieceIndex
      childLayers loc = case M.lookup loc childBoards of
        Just (CompiledBoard cb) -> LayerDecomp cb.layerDecomposition
        Nothing -> unsafeCrashWith "compile: location missing from its own board"
    pure $ CompiledBoard
      { pieces: M.unions (childBoards <#> \(CompiledBoard cb) -> cb.pieces)
      , ports: c.ports
      , boundaryPorts: ownBoundaryPorts
      , frames: M.union ownFrames (M.unions (childBoards <#> \(CompiledBoard cb) -> cb.frames))
      , wormholes: ownWormhole <> foldMap (\(CompiledBoard cb) -> cb.wormholes) childBoards
      , layerDecomposition: layers (LayerDecomp theseLayers >>= childLayers)
      }
    where
    childBoard :: Location -> Free CompiledF Piece -> Either BoardError CompiledBoard
    childBoard loc cell = case resume cell of
      Right piece -> Right (leafBoard loc piece)
      Left compiledF -> appendLocation loc <$> combine compiledF

    -- resolve one local edge (at this level) to a global `PortIndex` --
    -- only possible when it lands on a leaf; a nested board's own boundary
    -- doesn't (yet) expose which internal piece backs it, so those are
    -- left unresolved rather than guessed at.
    resolvePortIndex :: RelativeEdge -> Maybe PortIndex
    resolvePortIndex edge = do
      cell <- M.lookup (edgeLocation edge) c.pieces
      case resume cell of
        Right _ -> Just (Tuple (L.singleton (edgeLocation edge)) (edgeDirection edge))
        Left _ -> Nothing

    -- this level's own declared boundary, resolved to global `PortIndex`es
    -- -- see `CompiledBoard.boundaryPorts`. Same leaf-only caveat as
    -- `resolvePortIndex`: a board whose own boundary edge happens to land on
    -- a nested board (rather than a leaf) isn't resolved here.
    ownBoundaryPorts :: Map CardinalDirection PortIndex
    ownBoundaryPorts = M.mapMaybe resolvePortIndex c.boundaryEdges

    -- every leaf's own frame, resolved to global addresses. A nested
    -- board's `c.frames` entry describes *its* boundary as a whole rather
    -- than any one internal piece, so it's skipped here (its own pieces'
    -- frames, once it can compute them, will fold in from `childBoards`
    -- like everything else).
    ownFrames :: Map PieceIndex (Map CardinalDirection PortIndex)
    ownFrames = M.fromFoldable $ L.mapMaybe leafFrame (M.toUnfoldable c.frames)
      where
      leafFrame :: Tuple Location (Map CardinalDirection RelativeEdge) -> Maybe (Tuple PieceIndex (Map CardinalDirection PortIndex))
      leafFrame (Tuple loc localFrame) = do
        cell <- M.lookup loc c.pieces
        case resume cell of
          Right _ -> Just (Tuple (L.singleton loc) (M.mapMaybe resolvePortIndex localFrame))
          Left _ -> Nothing

    -- this level's own wormhole (if any), as a single tail -> mouth entry.
    -- Unlike `ownFrames`, a wormhole can't land on a nested board: a
    -- wormhole never reaches outside the piece/board that declares it, so
    -- `boundaryEdge` finding a nested board there would mean this board's
    -- own wormhole declaration is invalid, not that resolution needs to go
    -- deeper -- that's a bug, not a gap, so it's asserted rather than
    -- silently dropped.
    ownWormhole :: List (Tuple PortIndex PortIndex)
    ownWormhole = case c.wormhole of
      Nothing -> Nil
      Just { wormholeIn: mouthEdge, wormholeOut: tailEdge } -> L.singleton (Tuple (resolveOrCrash tailEdge) (resolveOrCrash mouthEdge))
      where
      resolveOrCrash edge = fromMaybe' (\_ -> unsafeCrashWith "compile: a wormhole's tail/mouth can't be a nested board") (resolvePortIndex edge)

-- | Advance every port's signal by one tick: seed each wormhole's tail with
-- | whatever was written to its mouth last tick, then evaluate every piece
-- | once, in `layerDecomposition` order, threading the running state through
-- | so each piece sees its neighbors' freshly-produced signals.
evaluate :: CompiledBoard -> Map PortIndex Signal -> Map PortIndex Signal
evaluate (CompiledBoard c) prevState = foldl evaluateAt seeded (L.concat c.layerDecomposition)
  where
  -- a wormhole's tail reads back whatever was written to its mouth last
  -- tick -- `zero` the very first time, before anything's been buffered.
  -- See docs/wormholes.md section 3.1.
  seeded :: Map PortIndex Signal
  seeded = foldl transmitWormhole prevState c.wormholes

  transmitWormhole :: Map PortIndex Signal -> Tuple PortIndex PortIndex -> Map PortIndex Signal
  transmitWormhole state (Tuple tailIdx mouthIdx) =
    M.insert tailIdx (fromMaybe zero (M.lookup mouthIdx state)) state

  -- evaluate the piece at `idx`: its `frame` says, for each of its own
  -- directions, which `PortIndex` to read the incoming signal from (an
  -- input's neighbor, a wormhole tail's seeded value, or its own edge) --
  -- and, symmetrically, which `PortIndex` each of the piece's own outputs
  -- (in whatever directions `eval` returns) should be written back to.
  evaluateAt :: Map PortIndex Signal -> PieceIndex -> Map PortIndex Signal
  evaluateAt state idx = fromMaybe' (\_ -> unsafeCrashWith "evaluate: a layerDecomposition location is missing its own piece/frame") do
    piece <- M.lookup idx c.pieces
    frame <- M.lookup idx c.frames
    let
      -- `frame` covers every one of the piece's ports, not just its
      -- readable ones, so a stale signal sitting under one of its own
      -- *output* `PortIndex`es (from a previous tick) would otherwise leak
      -- into `eval`'s input frame -- `truncateInputs` keeps only what the
      -- piece is actually meant to read.
      inputs = truncateInputs piece (Frame.fromMap zero (M.mapMaybe (\portIdx -> M.lookup portIdx state) frame))
      outputs = eval piece inputs
      -- `outputs` is a total `Frame`, so unlike a map it can't say which
      -- sides `eval` actually produced -- write back only the piece's own
      -- writable sides, or a misbehaving `eval` (or just the `zero` on an
      -- input side) would clobber whatever that input's `PortIndex` points
      -- at: its neighbour's output.
      writeOutput dir st port
        | isWritable port = maybe st (\portIdx -> M.insert portIdx (Frame.index dir outputs) st) (M.lookup dir frame)
        | otherwise = st
    pure (foldlWithIndex writeOutput state (getPorts piece))

-- | A port's current rendering info, resolved the same way `evaluate` itself
-- | reads a port's value: `idx`/`dir`'s own `frame` entry says which
-- | `PortIndex` actually carries the live signal (an input's matched
-- | neighbor, a wormhole tail's mouth, or its own edge for a genuine
-- | boundary) -- an output always frames to itself (`compileNode.frameAt`),
-- | so the same lookup doubles as the identity for outputs, no special
-- | casing needed. `connected` piggybacks on the same self-reference check,
-- | which is exactly right for inputs but under-reports a matched output
-- | (it still frames to itself either way) -- a known, currently-harmless
-- | approximation shared by every caller of this function.
portInfoAt :: CompiledBoard -> Map PortIndex Signal -> PortIndex -> Port -> PortInfo
portInfoAt (CompiledBoard c) state idx@(Tuple pieceIdx dir) port
  | not (hasPort port) = noPortInfo
  | otherwise =
      { port
      , connected: source /= idx
      , signal: fromMaybe zero (M.lookup source state)
      }
  where
  frame = fromMaybe M.empty (M.lookup pieceIdx c.frames)
  source = fromMaybe idx (M.lookup dir frame)

-- | Seed the board's own external inputs into a `Map PortIndex Signal`
-- | before calling `evaluate` -- routes each of the board's declared
-- | *input* sides to the interior `PortIndex` that actually reads it, via
-- | `boundaryPorts`. `inputs` is total, so it can't say which sides it means
-- | to drive; only a declared `Input` is written, or an output side's
-- | (or a wormhole mouth's) slot would be zeroed before `evaluate` reads it.
injectBoundaryInputs :: CompiledBoard -> Frame.Frame Signal -> Map PortIndex Signal -> Map PortIndex Signal
injectBoundaryInputs (CompiledBoard c) inputs state =
  foldlWithIndex inject state c.ports
  where
  inject dir st port
    | isInput port = maybe st (\idx -> M.insert idx (Frame.index dir inputs) st) (M.lookup dir c.boundaryPorts)
    | otherwise = st

-- | Read the board's own external outputs back out of an `evaluate` result:
-- | `zero` on every side that isn't a declared `Output`.
-- | Enumerates `ports` (the board's *declared* directions), not
-- | `boundaryPorts` directly -- `boundaryPorts` is structural and can be
-- | wider (any genuinely exposed edge, declared or not), and this feeds
-- | puzzle-completion comparisons that need to see exactly the declared
-- | shape, not every stray wire a player has dragged to some other edge.
-- | An input side is left `zero` too, since its slot just holds the value
-- | `injectBoundaryInputs` put there and this feeds a comparison against the
-- | goal piece's own `eval`, which only has outputs.
extractBoundaryOutputs :: CompiledBoard -> Map PortIndex Signal -> Frame.Frame Signal
extractBoundaryOutputs (CompiledBoard c) state = Frame.tabulate \dir ->
  if isOutput (Frame.index dir c.ports)
    then fromMaybe zero (M.lookup dir c.boundaryPorts >>= \idx -> M.lookup idx state)
    else zero

-- | The board's own external ports' current rendering info -- for drawing
-- | the board's own edge, the same way `portInfoAt` drives one piece's.
boundaryPortInfo :: CompiledBoard -> Map PortIndex Signal -> Frame.Frame PortInfo
boundaryPortInfo compiled@(CompiledBoard c) state =
  mapWithIndex toInfo c.ports
  where
  toInfo dir port
    | not (hasPort port) = noPortInfo
    | otherwise = case M.lookup dir c.boundaryPorts of
        Just idx -> portInfoAt compiled state idx port
        Nothing -> { port, connected: false, signal: zero }
