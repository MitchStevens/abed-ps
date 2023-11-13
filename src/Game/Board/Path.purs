module Game.Board.Path where

import Prelude

import Control.Alt (alt, (<|>))
import Control.Alternative (guard)
import Control.Extend (extend)
import Control.Monad.Error.Class (class MonadError, liftEither, throwError)
import Control.Monad.List.Trans (ListT, lift, nil)
import Control.Monad.List.Trans as ListT
import Control.Monad.Maybe.Trans (MaybeT)
import Control.Monad.State (class MonadState, StateT, evalState, evalStateT)
import Data.Array (cons, find, head, last, length, snoc, (!!))
import Data.Array as A
import Data.Either (Either(..), either, hush, note)
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
import Effect.Aff (Aff, error)
import Game.Board (Board(..), buildBoardGraph)
import Game.Board.Query (directPredecessors, directSuccessors)
import Game.GameEvent (BoardEvent(..))
import Game.Location (CardinalDirection, Location(..), Rotation(..), clockwiseRotation, directionTo, followDirection, oppositeDirection)
import Game.Location as Direction
import Game.Piece (APiece(..), name)
import Game.Piece.BasicPiece (idPiece, leftPiece, rightPiece)

data PathError
  = ObstructedByAnotherPiece Location
  | LocationsAreNotAdjacent Location Location
  | PathIsEmpty
  | WireInputEqualsOutput CardinalDirection CardinalDirection
derive instance Eq PathError
instance Show PathError where
  show = case _ of
    ObstructedByAnotherPiece loc -> "obstructed by piece at " <> show loc
    LocationsAreNotAdjacent l1 l2 -> "locations " <> show l1 <> " and " <> show l2 <> " are not adjacent"
    PathIsEmpty -> "path is empty"
    WireInputEqualsOutput inputDirection outputDirection -> "expected that " <> show inputDirection <> " and " <> show outputDirection <> " are not equal"


type Wire =
  { inputDirection :: CardinalDirection
  , outputDirection :: CardinalDirection
  , location :: Location
  }

type PathT a = StateT Board (Either PathError) a

runPathT :: forall a. PathT a -> Board -> Maybe a
runPathT pathT board = hush $ evalStateT pathT board

wirePiece :: forall m. MonadError PathError m => Wire -> m (List BoardEvent)
wirePiece wire = liftEither do
  pieceId <- case clockwiseRotation wire.inputDirection wire.outputDirection of
    Rotation 1 -> pure (name leftPiece)
    Rotation 2 -> pure (name idPiece)
    Rotation 3 -> pure (name rightPiece)
    _ -> Left (WireInputEqualsOutput wire.inputDirection wire.outputDirection)

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
boardPath :: forall m. MonadError PathError m => MonadState Board m
  => CardinalDirection -> Array Location -> CardinalDirection -> m (List BoardEvent)
boardPath initialDir path terminalDir = do
  h <- liftEither $ note PathIsEmpty (head path)
  l <- liftEither $ note PathIsEmpty (last path)
  let initial  = followDirection h initialDir
  let terminal = followDirection l terminalDir
  let locations =  L.fromFoldable $ [ initial ] <> path <> [ terminal ]
  wires <-traverse (uncurry3 pieceBoardEvent) (triples locations)

  boardEvents :: (List BoardEvent) <- map join <<< traverse wirePiece $ wires 
  pure boardEvents

pieceBoardEvent :: forall m. MonadError PathError m => Location -> Location -> Location -> m Wire
pieceBoardEvent l v r = liftEither do
  inputDirection  <- note (LocationsAreNotAdjacent v l) (directionTo v l)
  outputDirection <- note (LocationsAreNotAdjacent v r) (directionTo v r)
  when (inputDirection == outputDirection)
    (Left $ WireInputEqualsOutput inputDirection outputDirection)
  pure $ { inputDirection, outputDirection, location: v }