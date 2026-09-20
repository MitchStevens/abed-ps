module Game.Board.Query where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.Maybe.Trans (runMaybeT)
import Control.Monad.State (class MonadState, gets)
import Control.Monad.Writer (WriterT, execWriterT, tell)
import Data.Array as A
import Data.Either (Either(..))
import Data.Filterable (compact, filter)
import Data.Group (ginverse)
import Data.Lens (use, view, (.=))
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Set (Set)
import Data.Set as S
import Data.Traversable (for, for_, traverse_)
import Data.TraversableWithIndex (forWithIndex, traverseWithIndex)
import Data.Tuple (Tuple(..))
import Data.Witherable (wither)
import Debug (trace)
import Game.Board.Edge (RelativeEdge(..), absolute, adjacent, connected, edgeDirection, edgeLocation, getPortOnEdge, relative)
import Game.Board.Types (Board, _pieces, _size, pureBoard, resumeBoard)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections, oppositeDirection, rotateDirection)
import Game.Direction as Direction
import Game.Location (Location(..), location)
import Game.Piece (getPort, shouldRipple, updateCapacity)
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Port (Port(..), getPortType, noPort, portMatches)
import Game.Port as Port
import Game.Rotation (Rotation(..))

{- 
  EDGE QUERIES:

  Every piece has a number of ports, and we need to ask questions about these ports:
    - what is this port connected to?
    - what is the capacity of this port?
  
  We use a datatype called `AbsoluteEdge` to specify a particular port location on the board. An `AbsoluteEdge` is a `Location` and a `Direction`.  This is the way to reference ports from the perspective of the board.

  However, consider the perspective of a piece. If a piece has no rotation, it's `Left` input port is taking input from the `Left` port on the board. But when the piece is rotated clockwise by 90deg, the piece takes input from the absolute direction `Up`.

         U                         U      
    ┏━━━━━━━━━┓               ┏━━━━━━━━━┓  
    ┃    U    ┃               ┃    L    ┃  
   L┃ L     R ┃R     -->     L┃ D     U ┃R 
    ┃    D    ┃    rotate     ┃    R    ┃  
    ┗━━━━━━━━━┛    piece      ┗━━━━━━━━━┛  
         D         90 deg          D      

  Before the inputs are provided to the piece for eval, we need to translate between `AbsoluteEdge` and `RelativeEdge`. We do this with `toAbsoluteEdge` and `toRelativeEdge`

-}

allConnectedRelativeEdges :: forall m. MonadState Board m => Location -> m (Array RelativeEdge)
allConnectedRelativeEdges loc =
  wither (runMaybeT <<< connected) (relative loc <$> allDirections)

isInsideBoard :: forall m. MonadState Board m => Location -> m Boolean
isInsideBoard (Location {x, y}) = do
  n <- use _size
  pure $ 0 <= x && x < n && 0 <= y && y < n

{-
  boards have 4 port areas that can take input/output. If these ports were pieces, which locations whould they occupy?
-}
getBoardEdgeTerminalLocation :: forall m. MonadState Board m => CardinalDirection -> m Location
getBoardEdgeTerminalLocation dir = do
  n <- use _size
  pure $ case dir of
    Direction.Up    -> location (n`div`2) (-1)
    Direction.Right -> location (n)       (n`div`2)
    Direction.Down  -> location (n`div`2) (n)
    Direction.Left  -> location (-1)      (n`div`2)

--
-- | The location just inside each side of the board. Every side has one, so
-- | unlike a piece's ports this is total.
getBoardEdges :: forall m. MonadState Board m => m (Frame Location)
getBoardEdges = do
  n <- use _size
  pure $ Frame.tabulate case _ of
    Direction.Up    -> location (n`div`2) 0
    Direction.Right -> location (n-1)       (n`div`2)
    Direction.Down  -> location (n`div`2) (n-1)
    Direction.Left  -> location 0      (n`div`2)

getBoardPortEdge :: forall m. MonadState Board m => CardinalDirection -> m RelativeEdge
getBoardPortEdge dir = do
  loc <- getBoardEdgeTerminalLocation dir
  pure $ relative loc Direction.Right

getBoardPorts :: forall m. MonadState Board m => m (Frame Port)
getBoardPorts = do
  boardEdges <- getBoardEdges
  forWithIndex boardEdges \dir loc ->
    fromMaybe noPort <$> runMaybeT (getPortOnEdge (absolute loc dir))

{-
  Create a bidirectional mapping from inputs to ouptuts ports
-}
buildConnectionMap :: forall m. MonadState Board m => m (Map RelativeEdge RelativeEdge)
buildConnectionMap = do
  pieceInfos <- use _pieces
  map M.fromFoldable <$> execWriterT $ traverse_ buildConnectionMapAt (L.fromFoldable (M.keys pieceInfos))

buildConnectionMapAt :: forall m. MonadState Board m
  => Location -> WriterT (List (Tuple RelativeEdge RelativeEdge)) m Unit
buildConnectionMapAt loc = 
  for_ allDirections \dir -> runMaybeT do
    let relEdge = relative loc dir
    adjRelEdge <- connected relEdge 
    port <- getPortOnEdge relEdge
    case getPortType port of
      Port.Input ->
          tell (L.singleton (Tuple relEdge adjRelEdge))
      Port.Output ->
          tell (L.singleton (Tuple adjRelEdge relEdge))
      -- wormhole edges are a cut in the dependency graph: they never contribute
      -- a connection, so `layerDecomposition` / the cyclic check ignore them
      Port.WormholeIn -> pure unit
      Port.WormholeOut -> pure unit
      Port.NoPort -> pure unit

--todo: fix this, looks like garbage
{-
  `capacityRipple` runs A* over the game board and updates the capacity on each piece (if capacity can be updated) 
-}
capacityRipple :: forall m. MonadState Board m => RelativeEdge -> Capacity -> m Unit
capacityRipple relEdge capacity = capacityRippleAcc capacity { openSet: L.singleton relEdge, closedSet: S.empty }

capacityRippleAcc :: forall m. MonadState Board m
  => Capacity -> { openSet :: List RelativeEdge, closedSet :: Set Location } -> m Unit
capacityRippleAcc capacity vars = case vars.openSet of
  Nil -> pure unit
  Cons relEdge otherEdges -> do
    let loc = edgeLocation relEdge
    let closedSet = S.insert loc vars.closedSet
    maybeCell <- map (_.piece) <$> use (_pieces <<< at loc)
    -- capacity ripple only understands leaf pieces -- a nested board doesn't
    -- ripple through yet, so it's treated the same as an empty cell here.
    let maybePiece = maybeCell >>= \cell -> case resumeBoard cell of
          Right p -> Just p
          Left _ -> Nothing

    case maybePiece >>= updateCapacity (edgeDirection relEdge) capacity of
      Just piece -> do                                        -- if the capacity can be changed...
        connected <- allConnectedRelativeEdges loc
        _pieces <<< ix loc %= (_ { piece = pureBoard piece })     -- set the capacity at the location...

        if shouldRipple piece
          then do
            let notInClosedSet r = not (S.member (edgeLocation r) vars.closedSet)
            let openSet = L.fromFoldable (filter notInClosedSet connected) <> otherEdges            -- add the adjacent locations to the open set
            capacityRippleAcc capacity { openSet, closedSet } -- ripple the capacity
          else capacityRippleAcc capacity { openSet: otherEdges, closedSet }
      Nothing ->
        capacityRippleAcc capacity { openSet: otherEdges, closedSet }
        