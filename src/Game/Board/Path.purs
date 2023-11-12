module Game.Board.Path where

import Prelude

import Control.Alt (alt, (<|>))
import Control.Alternative (guard)
import Control.Extend (extend)
import Control.Monad.List.Trans (ListT, lift, nil)
import Control.Monad.List.Trans as ListT
import Control.Monad.Maybe.Trans (MaybeT)
import Control.Monad.State (class MonadState)
import Data.Array (cons, find, head, last, length, snoc, (!!))
import Data.Array as A
import Data.Foldable (fold, null)
import Data.List (List(..), (:))
import Data.List as L
import Data.Maybe (Maybe(..))
import Data.PQueue as PQ
import Data.Set as S
import Data.Traversable (for, sequence, traverse)
import Data.Tuple (Tuple(..), snd)
import Data.Tuple.Nested (Tuple3, tuple3, uncurry3)
import Data.Unfoldable (unfoldr)
import Data.Zipper (Zipper(..))
import Data.Zipper as Z
import Debug (debugger, trace)
import Game.Board (Board(..), buildBoardGraph)
import Game.Board.Query (directPredecessors, directSuccessors)
import Game.GameEvent (BoardEvent(..))
import Game.Location (CardinalDirection, Location(..), Rotation(..), clockwiseRotation, directionTo, followDirection, oppositeDirection)
import Game.Location as Direction
import Game.Piece (APiece(..), name)
import Game.Piece.BasicPiece (idPiece, leftPiece, rightPiece)

type Wire =
  { inputDirection :: CardinalDirection
  , outputDirection :: CardinalDirection
  , location :: Location
  }

wirePiece :: Wire -> Maybe (List BoardEvent)
wirePiece wire = do
  pieceId <- name <$> case clockwiseRotation wire.inputDirection wire.outputDirection of
    Rotation 1 -> Just leftPiece
    Rotation 2 -> Just idPiece
    Rotation 3 -> Just rightPiece
    _ -> Nothing
  pure $
    AddedPiece wire.location pieceId : RotatedPiece wire.location (clockwiseRotation Direction.Left wire.inputDirection) : Nil

triples :: forall a. List a -> List (Tuple3 a a a)
triples = case _ of
  a : b : c : xs -> tuple3 a b c : triples (b : c : xs)
  _ -> Nil

-- board path builds along all the locations
{-
  1. add a head and a tail the list based on adjacent pieces
  2. generate a list of board operations to add the pieces to the board
  3. ensure that every piece can be added to the board
  4. return the list of board events
-}
boardPath :: forall m. MonadState Board m => CardinalDirection -> Array Location -> CardinalDirection -> m (Maybe (List BoardEvent))
boardPath initialDir path terminalDir = do
  let (boardEvents :: Maybe (List BoardEvent)) = wires >>= (map join <<< sequence <<< map wirePiece)
  pure boardEvents
  where
    wires :: Maybe (List Wire)
    wires = do
      initial  <- followDirection <$> head path <*> pure initialDir
      terminal <- followDirection <$> last path <*> pure terminalDir
      let locations =  L.fromFoldable $ [ initial ] <> path <> [ terminal ]
      traverse (uncurry3 pieceBoardEvent) (triples locations)


pieceBoardEvent :: Location -> Location -> Location -> Maybe Wire
pieceBoardEvent l v r = do
  inputDirection <- directionTo v l
  outputDirection <- directionTo v r
  pure $ { inputDirection , outputDirection , location: v }

--getOptimalPredecessor :: forall m. MonadState Board m => Array Location -> m (Maybe Location)
--getOptimalPredecessor path = map join <<< sequence $ do
--    loc  <- path !! 0
--    next <- path !! 1
--    pure $ directPredecessors loc <#> \predecessors -> 
--      find (\l -> directionTo l loc == directionTo loc next) predecessors <|> A.head predecessors <|> rotate
--
--getOptimalSuccessor :: forall m. MonadState Board m => Array Location -> m (Maybe Location)
--getOptimalSuccessor path = map join <<< sequence $ do
--    let n = length path
--    prev <- path !! (n-2)
--    loc  <- path !! (n-1)
--    pure $ directSuccessors loc <#> \successors -> 
--      find (\l -> directionTo prev loc == directionTo loc l) successors <|> A.head successors <|>

