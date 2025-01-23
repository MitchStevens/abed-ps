module Game.Board.Query where

import Data.Lens
import Prelude

import Control.Alternative (guard)
import Control.Monad.Maybe.Trans (runMaybeT)
import Control.Monad.State (class MonadState, gets)
import Control.Monad.Writer (WriterT, execWriterT, tell)
import Data.Array as A
import Data.Filterable (compact, filter)
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
import Data.TraversableWithIndex (forWithIndex, traverseWithIndex)
import Data.Tuple (Tuple(..))
import Data.Witherable (wither)
import Debug (trace)
import Game.Board.Edge (InputEdge(..), OutputEdge(..), RelativeEdge(..), absolute, adjacent, connected, edgeDirection, edgeLocation, getPortOnEdge, outputEdge, relative)
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
import Safe.Coerce (coerce)

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
getBoardEdgePseudoLocation :: forall m. MonadState Board m => CardinalDirection -> m Location
getBoardEdgePseudoLocation dir = do
  n <- use _size
  pure $ case dir of
    Direction.Up    -> location (n`div`2) (-1)
    Direction.Right -> location (n)       (n`div`2)
    Direction.Down  -> location (n`div`2) (n)
    Direction.Left  -> location (-1)      (n`div`2)

--
getBoardEdges :: forall m. MonadState Board m => m (Map CardinalDirection Location)
getBoardEdges = do
  n <- use _size
  pure $ M.fromFoldable
    [ Tuple (Direction.Up)    (location (n`div`2) 0)
    , Tuple (Direction.Right) (location (n-1)       (n`div`2))
    , Tuple (Direction.Down)  (location (n`div`2) (n-1))
    , Tuple (Direction.Left)  (location 0         (n`div`2))
    ]

getBoardPortEdge :: forall m. MonadState Board m => CardinalDirection -> m RelativeEdge
getBoardPortEdge dir = do
  loc <- getBoardEdgePseudoLocation dir
  pure $ relative loc Direction.Right

getBoardPorts :: forall m. MonadState Board m => m (Map CardinalDirection Port)
getBoardPorts =
  map compact do
     boardEdges <- getBoardEdges
     forWithIndex boardEdges \dir loc -> runMaybeT $ getPortOnEdge (absolute loc dir)

{-
  Create a bidirectional mapping from inputs to ouptuts ports
-}
buildConnectionMap :: forall m. MonadState Board m => m (Map InputEdge OutputEdge)
buildConnectionMap = do
  pieceInfos <- use _pieces
  map M.fromFoldable <$> execWriterT $ traverse_ buildConnectionMapAt (L.fromFoldable (M.keys pieceInfos))

buildConnectionMapAt :: forall m. MonadState Board m
  => Location -> WriterT (List (Tuple InputEdge OutputEdge)) m Unit
buildConnectionMapAt loc = 
  for_ allDirections \dir -> runMaybeT do
    let relEdge = relative loc dir
    port <- getPortOnEdge relEdge
    case portType port of
      Port.Input -> do
          let inputEdge = InputEdge relEdge
          outputEdge <- OutputEdge <$> connected relEdge 
          tell (L.singleton (Tuple inputEdge outputEdge))
      Port.Output -> do
          inputEdge <- InputEdge <$> connected relEdge 
          let outputEdge = OutputEdge relEdge
          tell (L.singleton (Tuple inputEdge outputEdge))

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
    maybePiece <- map (_.piece) <$> use (_pieces <<< at loc)
    
    case maybePiece >>= updateCapacity (edgeDirection relEdge) capacity of
      Just piece -> do                                        -- if the capacity can be changed...
        connected <- allConnectedRelativeEdges loc
        _pieces <<< ix loc %= (_ { piece = piece })          -- set the capacity at the location...

        if shouldRipple piece
          then do
            let notInClosedSet r = not (S.member (edgeLocation r) vars.closedSet)
            let openSet = L.fromFoldable (filter notInClosedSet connected) <> otherEdges            -- add the adjacent locations to the open set
            capacityRippleAcc capacity { openSet, closedSet } -- ripple the capacity
          else capacityRippleAcc capacity { openSet: otherEdges, closedSet }
      Nothing ->
        capacityRippleAcc capacity { openSet: otherEdges, closedSet }
        