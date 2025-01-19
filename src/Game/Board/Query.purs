module Game.Board.Query where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.Maybe.Trans (MaybeT(..), lift, runMaybeT)
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
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Set as S
import Data.Traversable (for, for_, traverse, traverse_)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Data.Witherable (wither)
import Debug (trace)
import Game.Board.Edge (class Edge, AbsoluteEdge(..), BaseEdge, absolute, adjacentAbsoluteEdge, edgeDirection, edgeLocation, getPortOnEdge)
import Game.Board.PieceInfo (_rotation)
import Game.Board.Types (Board(..), _pieces, _size)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections, oppositeDirection, rotateDirection)
import Game.Direction as Direction
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

newtype RelativeEdge = Relative BaseEdge
derive instance Eq RelativeEdge
derive instance Ord RelativeEdge

relative :: Location -> CardinalDirection -> RelativeEdge
relative loc dir = Relative { loc, dir } 

relativeToAbsolute :: forall m. MonadState Board m => RelativeEdge -> m AbsoluteEdge
relativeToAbsolute (Relative { loc, dir }) = do
    rot <- use (_pieces <<< at loc <<< ?a <<< _rotation)
    pure (absolute loc (rotateDirection dir rot))

absoluteToRelative :: forall m. MonadState Board m => AbsoluteEdge -> m (Maybe RelativeEdge)
absoluteToRelative (Absolute { loc, dir }) = runMaybeT do
    { piece, rotation } <- MaybeT $ use (_pieces <<< at loc)
    pure (relative loc (rotateDirection dir (ginverse rotation)))


instance Edge RelativeEdge RelativeEdge where
  toAbsoluteEdge = relativeToAbsolute >>> lift
      
  fromAbsoluteEdge = absoluteToRelative

  getPortOnEdge (Relative { loc, dir }) = do
    maybePieceInfo <- use (_pieces <<< at loc)
    pure $ maybePieceInfo >>= (\info -> getPort info.piece dir)
  
  adjacentEdge edge = runMaybeT do
    absEdge <- lift <<< relativeToAbsolute
    absoluteToRelative (adjacentAbsoluteEdge absEdge)


toLocalInputs :: forall a. Location -> Map RelativeEdge a -> Map CardinalDirection a
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey edgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: forall a. Location -> Map CardinalDirection a -> Map RelativeEdge a
toGlobalInputs loc = unsafeMapKey (relative loc)


--getBoardRelEdge :: forall m. MonadState Board m => CardinalDirection -> m RelativeEdge
--getBoardRelEdge dir = do
--  loc <- getBoardEdgePseudoLocation dir
--  toRelativeEdge (absolute loc (oppositeDirection dir))

isInsideBoard :: forall m. MonadState Board m => Location -> m Boolean
isInsideBoard (Location {x, y}) = do
  n <- use _size
  pure $ 0 <= x && x < n && 0 <= y && y < n


{-
  boards have 4 port areas that can take input/output. If these ports were pieces, which locations whould they occupy?
-}
--getBoardEdgePseudoLocation :: forall m. MonadState Board m => CardinalDirection -> m Location
--getBoardEdgePseudoLocation dir = do
--  n <- use _size
--  pure $ case dir of
--    Direction.Up    -> location (n`div`2) (-1)
--    Direction.Right -> location (n)       (n`div`2)
--    Direction.Down  -> location (n`div`2) (n)
--    Direction.Left  -> location (-1)      (n`div`2)

getBoardPortEdges :: forall m. MonadState Board m => m (Map CardinalDirection AbsoluteEdge)
getBoardPortEdges = do
    n <- use _size
    M.fromFoldable
      [ Tuple Direction.Up    (absolute (location (n`div`2) (-1))      Direction.Up)
      , Tuple Direction.Right (absolute (location (n)       (n`div`2)) Direction.Right)
      , Tuple Direction.Down  (absolute (location (n`div`2) (n))       Direction.Down)
      , Tuple Direction.Left  (absolute (location (-1)      (n`div`2)) Direction.Left)
      ]

getBoardPorts :: forall m. MonadState Board m => m (Map CardinalDirection Port)
getBoardPorts = do
  boardPorts <- getBoardPortEdges
  M.catMaybes <$> forWithIndex boardPorts \dir absEdge ->
    getPortOnEdge absEdge

--todo: fix this, looks like garbage
{-
  `capacityRipple` runs A* over the game board and updates the capacity on each piece (if capacity can be updated) 
-}
--capacityRipple :: forall m. MonadState Board m => RelativeEdge -> Capacity -> m Unit
--capacityRipple relEdge capacity = capacityRippleAcc capacity { openSet: L.singleton relEdge, closedSet: S.empty }
--
--capacityRippleAcc :: forall m. MonadState Board m
--  => Capacity -> { openSet :: List RelativeEdge, closedSet :: Set Location } -> m Unit
--capacityRippleAcc capacity vars = case vars.openSet of
--  Nil -> pure unit
--  Cons relEdge otherEdges -> do
--    let loc = edgeLocation relEdge
--    let closedSet = S.insert loc vars.closedSet
--    maybePiece <- map (_.piece) <$> use (_pieces <<< at loc)
--    
--    case maybePiece >>= updateCapacity (edgeDirection relEdge) capacity of
--      Just piece -> do                                        -- if the capacity can be changed...
--        connected <- allConnectedRelativeEdges loc
--        _pieces <<< ix loc %= (_ { piece = piece })          -- set the capacity at the location...
--
--        if shouldRipple piece
--          then do
--            let notInClosedSet r = not (S.member (edgeLocation r) vars.closedSet)
--            let openSet = L.fromFoldable (filter notInClosedSet connected) <> otherEdges            -- add the adjacent locations to the open set
--            capacityRippleAcc capacity { openSet, closedSet } -- ripple the capacity
--          else capacityRippleAcc capacity { openSet: otherEdges, closedSet }
--      Nothing ->
--        capacityRippleAcc capacity { openSet: otherEdges, closedSet }
        