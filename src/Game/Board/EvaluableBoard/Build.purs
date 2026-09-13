{-
  EVALUABLE BOARD -- BUILD

  A `Board` represents operations on the board in the game: adding pieces,
  rotating pieces, etc. That representation is not good for evaluation, so it is
  first transformed into an `EvaluableBoard`.

  This module defines the `EvaluableBoard` structure and builds one from a
  `Board` (standing a terminal piece up at each board-edge terminal, wiring the
  connection map, and layer-decomposing the pieces). Running it is
  `Game.Board.EvaluableBoard.Evaluate`.
-}
module Game.Board.EvaluableBoard.Build
  ( EvaluableBoard(..)
  , Terminal(..)
  , buildEvaluableBoard
  , layerDecomposition
  , terminalLocations
  , toEvaluableBoard
  , topologicalSort
  )
  where

import Prelude

import Control.Monad.Error.Class (class MonadError, throwError)
import Control.Monad.Except (runExcept)
import Control.Monad.State (evalState, evalStateT, gets)
import Data.Either (Either)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Generic.Rep (class Generic)
import Data.Lens (use, (.=))
import Data.Lens.At (at)
import Data.List (List(..), find)
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set as Set
import Data.Set.NonEmpty (NonEmptySet)
import Data.Set.NonEmpty as NES
import Data.Show.Generic (genericShow)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Game.Board.Edge (RelativeEdge(..), edgeLocation, relative)
import Game.Board.Query (buildConnectionMap, getBoardEdgeTerminalLocation, getBoardPorts)
import Game.Board.TerminalPiece (terminalPiece)
import Game.Board.Types (Board, BoardError(..), _pieces)
import Game.Direction (CardinalDirection, clockwiseRotation)
import Game.Direction as Direction
import Game.Location (Location)
import Game.Piece (Piece)
import Game.Port (Port)


-- | A terminal on the board boundary: the port it carries and the (off-board)
-- | `Location` where its terminal piece is stood up during `buildEvaluableBoard`
-- | so `buildConnectionMap` can wire it to the adjacent interior piece.
newtype Terminal = Terminal
  { port :: Port
  , location :: Location
  }
derive instance Generic Terminal _
derive instance Newtype Terminal _
derive instance Eq Terminal
instance Show Terminal where
  show = genericShow

newtype EvaluableBoard = EvaluableBoard
  { pieces :: Map Location Piece
  -- maps input relEdges to output relEdges
  , connections :: Map RelativeEdge RelativeEdge
  -- layer decomposition of locations: a topologically sorted list of antichains, where each
  -- location depends only on locations in earlier layers
  , evalOrder :: List (NonEmptySet Location)
  --, innerPorts :: Map CardinalDirection Port
  , terminals :: Map CardinalDirection Terminal
  -- locations whose piece is itself a board. The evaluator descends into these
  -- during a tick so wormhole state at any nesting depth is owned by the one
  -- root evaluator, keyed by the instance path (`List Location`) that reaches it.
  -- See `Game.Board.EvaluableBoard.Tick` and docs/wormholes.md section 4.
  , subBoards :: Map Location EvaluableBoard
  }
derive instance Newtype EvaluableBoard _
derive instance Eq EvaluableBoard
instance Show EvaluableBoard where
  show (EvaluableBoard evaluable) = show evaluable

-- | The off-board `Location` of each terminal's terminal piece, keyed by side.
terminalLocations :: EvaluableBoard -> Map CardinalDirection Location
terminalLocations = unwrap >>> _.terminals >>> map (unwrap >>> _.location)


toEvaluableBoard :: Board -> Either BoardError EvaluableBoard
toEvaluableBoard board = runExcept (buildEvaluableBoard (evalState getBoardPorts board) board)

{-
  There are two ways to build an `EvaluableBoard`, either by specifying outer ports or not. If the outer ports are not specified (via the `maybePorts` parameter), outer ports will be created from the pieces adjacent to the outer ports.

  The `m` parameter originally had a `MonadState Board m` constraint. This complemented the functions in `Board.Query` and `Board.Operation`, but given that we dont want to modify the board, it's better to pass it as a value.
-}
buildEvaluableBoard :: forall m. MonadError BoardError m
  => Map CardinalDirection Port -> Board -> m EvaluableBoard
buildEvaluableBoard terminalPorts = evalStateT do
  -- stand a terminal piece up at each terminal so `buildConnectionMap` wires the
  -- terminal to its adjacent interior piece
  forWithIndex_ terminalPorts \dir port -> do
    loc <- getBoardEdgeTerminalLocation dir
    let rotation = clockwiseRotation Direction.Left dir
    _pieces <<< at loc .= Just { piece: terminalPiece port, rotation }
    --addPieceNoUpdate loc (terminalPiece (matchingPort port)) rot
  pieces <- map (_.piece) <$> use _pieces
  connections <- buildConnectionMap

  terminals <- forWithIndex terminalPorts \dir port -> do
    loc <- getBoardEdgeTerminalLocation dir
    pure $ Terminal
      { port, location: loc }

  -- layer-decompose the pieces (need connection map)
  let locations = L.fromFoldable <<< M.keys $ pieces
  evalOrder <- maybe (throwError Cyclic) pure (layerDecomposition locations connections)

  -- a wormhole must join two *different* board sides: its entrance and exit
  -- can't be the same direction
  wormhole <- gets (unwrap >>> _.wormhole)
  case wormhole of
    Just (Tuple wormIn wormOut) | wormIn == wormOut ->
      throwError (WormholeInvalid wormIn wormOut)
    _ -> pure unit

  -- no board-as-piece producer exists yet, so this is always empty for a board
  -- built straight from the model; `Tick` still descends whatever is here.
  pure $ EvaluableBoard { pieces, connections, evalOrder, terminals, subBoards: M.empty }

-- very simple but maybe not effceient, this is fine for small n
-- https://gist.github.com/rinse/8c4266ba7cef050a109f42b082782b59
topologicalSort :: List Location -> Map RelativeEdge RelativeEdge -> Maybe (List Location)
topologicalSort Nil _ = Just Nil
topologicalSort nodes edges = do
  let doesntAcceptOutput loc = M.isEmpty $ M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) edges
  r <- find doesntAcceptOutput nodes -- find that first location that has an input but doesn't accept output from anwhere else

  let nodes' = L.delete r nodes
      edges' = M.filter (\v -> edgeLocation v /= r) edges
  Cons r <$> topologicalSort nodes' edges'

{-
  Like `topologicalSort`, but instead of peeling off one ready location at a time, every
  currently-ready location is grouped into a single layer. Locations within the same layer have
  no dependency on one another (they form an antichain in the connection graph): a location can
  only become ready once every location it depends on has already been placed into an earlier
  layer, so two mutually-dependent locations can never land in the same layer. That means the
  relative order of locations within a layer doesn't matter -- they can be evaluated or rendered
  in parallel, and each layer only depends on layers before it.

  Returns `Nothing` if `nodes`/`edges` form a cyclic graph, same as `topologicalSort`.
-}
layerDecomposition :: List Location -> Map RelativeEdge RelativeEdge -> Maybe (List (NonEmptySet Location))
layerDecomposition Nil _ = Just Nil
layerDecomposition nodes edges = do
  let doesntAcceptOutput loc = M.isEmpty $ M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) edges
  readyLayer <- NES.fromFoldable (L.filter doesntAcceptOutput nodes)

  let ready = NES.toSet readyLayer
      nodes' = L.filter (\loc -> not (Set.member loc ready)) nodes
      edges' = M.filter (\v -> not (Set.member (edgeLocation v) ready)) edges
  Cons readyLayer <$> layerDecomposition nodes' edges'
