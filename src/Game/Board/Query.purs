module Game.Board.Query where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.State (class MonadState, gets)
import Control.Monad.Writer (WriterT, execWriterT, tell)
import Data.Array as A
import Data.Filterable (filter)
import Data.Group (ginverse)
import Data.Lens (use, view, (.=))
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Set as S
import Data.Traversable (for, for_, traverse_)
import Data.Tuple (Tuple(..))
import Data.Witherable (wither)
import Debug (trace)
import Game.Board.PieceInfo (_rotation)
import Game.Board.RelativeEdge (AbsoluteEdge, RelativeEdge(..), absolute, relative, relativeEdgeDirection, relativeEdgeLocation)
import Game.Board.Types (Board(..), _pieces, _size)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections, oppositeDirection, rotateDirection)
import Game.Direction as Direction
import Game.Edge (Edge(..), matchEdge)
import Game.Location (Location(..), location)
import Game.Piece (getPort, shouldRipple, updateCapacity)
import Game.Port (Port(..), portMatches, portType)
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
toAbsoluteEdge :: forall m. MonadState Board m => RelativeEdge -> m AbsoluteEdge
toAbsoluteEdge (Relative (Edge { loc, dir })) = do
  rot <- gets (view (_pieces <<< ix loc <<< _rotation)) -- rotation is a monoid
  pure $ absolute loc (rotateDirection dir rot)

-- if location is not accupied, reledge == absEdge
toRelativeEdge :: forall m. MonadState Board m => AbsoluteEdge -> m RelativeEdge
toRelativeEdge (Edge { loc, dir }) = do
  rot <- gets (view $ _pieces <<< ix loc <<< _rotation)
  pure $ relative loc (rotateDirection dir (ginverse rot))

{-
  All `RelativeEdge`s have an adjacent `RelativeEdge`.
-}
adjacentRelativeEdge :: forall m. MonadState Board m => RelativeEdge -> m RelativeEdge
adjacentRelativeEdge relEdge = do
  absEdge <- toAbsoluteEdge relEdge
  toRelativeEdge (matchEdge absEdge)
{-
  A `RelativeEdge` has a matching relative edge the 'RelativeEdge` if:
    - the relEdge has a port
    - the adjacent relEdge has a port
    - the two ports match (eg. input port & output port)
-}
connectedRelativeEdge :: forall m. MonadState Board m => RelativeEdge -> m (Maybe RelativeEdge)
connectedRelativeEdge relEdge = do
  port <- getPortOnEdge relEdge
  adjRelEdge <- adjacentRelativeEdge relEdge
  adjPort <- getPortOnEdge adjRelEdge
  if (portMatches <$> port <*> adjPort) == Just true
    then pure (Just adjRelEdge)
    else pure Nothing

allConnectedRelativeEdges :: forall m. MonadState Board m => Location -> m (Array RelativeEdge)
allConnectedRelativeEdges loc =
  wither connectedRelativeEdge (relative loc <$> allDirections)

-- returns both board ports and piece ports
getPortOnEdge :: forall m. MonadState Board m => RelativeEdge -> m (Maybe Port)
getPortOnEdge (Relative (Edge { loc, dir })) = do
  maybePieceInfo <- use (_pieces <<< at loc)
  pure $ maybePieceInfo >>= (\info -> getPort info.piece dir)

--getBoardRelEdge :: forall m. MonadState Board m => CardinalDirection -> m RelativeEdge
--getBoardRelEdge dir = do
--  loc <- getBoardEdgePseudoLocation dir
--  toRelativeEdge (absolute loc (oppositeDirection dir))

isInsideBoard :: forall m. MonadState Board m => Location -> m Boolean
isInsideBoard (Location {x, y}) = do
  n <- use _size
  pure $ 0 <= x && x < n && 0 <= y && y < n

--connectedTo :: forall m. MonadState Board m => Location -> m (Array Location)
--connectedTo loc = A.catMaybes <$> for allDirections \dir -> do
--  adjRelEdge <- toRelativeEdge (absolute loc dir) >>= matchingRelativeEdge
--  pure $ Just $ relativeEdgeLocation adjRelEdge

--directSuccessors :: forall m. MonadState Board m => Location -> m (Array Location)
--directSuccessors loc = A.catMaybes <$> for allDirections \dir -> do
--  relEdge <- toRelativeEdge (absolute loc dir) >>= matchingRelativeEdge
--  maybePort <- getPortOnEdge relEdge
--  pure $ maybePort >>= \p -> guard (not (isInput p)) $> relativeEdgeLocation relEdge
--
--directPredecessors :: forall m. MonadState Board m => Location -> m (Array Location)
--directPredecessors loc = A.catMaybes <$> for allDirections \dir -> do
--  relEdge <- toRelativeEdge (absolute loc dir) >>= matchingRelativeEdge
--  maybePort <- getPortOnEdge relEdge
--  pure $ maybePort >>= \p -> guard (isInput p) $> relativeEdgeLocation relEdge




{-
  boards have 4 port areas that can take input/output. If these ports were pieces, which locations whould they occupy?
-}
getBoardEdgePseudoLocation :: forall m. MonadState Board m => CardinalDirection -> m Location
getBoardEdgePseudoLocation dir = do
  n <- use _size
  pure $ case dir of
    Direction.Up    -> location (n`div`2) (-1)
    Direction.Right -> location (n)       (n`div`2)
    Direction.Down  -> location (n`div`2) (n)
    Direction.Left  -> location (-1)      (n`div`2)




getBoardPortEdge :: forall m. MonadState Board m => CardinalDirection -> m RelativeEdge
getBoardPortEdge dir = do
  loc <- getBoardEdgePseudoLocation dir
  pure $ relative loc Direction.Right

getBoardPorts :: forall m. MonadState Board m => m (Map CardinalDirection Port)
getBoardPorts =
  M.catMaybes <<< M.fromFoldable <$>
    for allDirections \dir -> do
      loc <- getBoardEdgePseudoLocation dir
      relEdge <- toRelativeEdge (absolute loc (oppositeDirection dir)) >>= adjacentRelativeEdge
      maybePort <- getPortOnEdge relEdge
      pure (Tuple dir maybePort)

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
  for_ allDirections \dir -> do
    let relEdge = relative loc dir
    connectedRelativeEdge relEdge >>= traverse_ \adjRelEdge -> do
      port <- getPortOnEdge relEdge
      case map portType port of
        Just Port.Input ->
            tell (L.singleton (Tuple relEdge adjRelEdge))
        Just Port.Output ->
            tell (L.singleton (Tuple adjRelEdge relEdge))
        Nothing -> pure unit

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
    let loc = relativeEdgeLocation relEdge
    let closedSet = S.insert loc vars.closedSet
    maybePiece <- map (_.piece) <$> use (_pieces <<< at loc)
    
    case maybePiece >>= updateCapacity (relativeEdgeDirection relEdge) capacity of
      Just piece -> do                                        -- if the capacity can be changed...
        connected <- allConnectedRelativeEdges loc
        _pieces <<< ix loc %= (_ { piece = piece })          -- set the capacity at the location...

        if shouldRipple piece
          then do
            let notInClosedSet r = not (S.member (relativeEdgeLocation r) vars.closedSet)
            let openSet = L.fromFoldable (filter notInClosedSet connected) <> otherEdges            -- add the adjacent locations to the open set
            capacityRippleAcc capacity { openSet, closedSet } -- ripple the capacity
          else capacityRippleAcc capacity { openSet: otherEdges, closedSet }
      Nothing ->
        capacityRippleAcc capacity { openSet: otherEdges, closedSet }
        