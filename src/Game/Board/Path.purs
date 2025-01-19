module Game.Board.Path where

import Prelude

import Control.Alt (class Alt, alt, (<|>))
import Control.Alternative (guard)
import Control.Extend (extend)
import Control.Monad.Error.Class (class MonadError, catchError, liftEither, throwError, try)
import Control.Monad.Except (ExceptT(..), lift, runExcept, runExceptT, withExceptT)
import Control.Monad.List.Trans (ListT, lift, nil)
import Control.Monad.List.Trans as ListT
import Control.Monad.Maybe.Trans (MaybeT)
import Control.Monad.State (class MonadState, StateT, evalState, evalStateT, execStateT, get, gets, put)
import Control.Monad.Writer (class MonadWriter)
import Data.Array (cons, find, foldr, head, last, length, snoc, (!!))
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), blush, either, hush, isRight, note)
import Data.Foldable (and, fold, foldMap, for_, null, traverse_)
import Data.FoldableWithIndex (forWithIndex_, traverseWithIndex_)
import Data.Generic.Rep (class Generic)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), isNothing, maybe)
import Data.PQueue as PQ
import Data.Set (Set)
import Data.Set as S
import Data.Show.Generic (genericShow)
import Data.Traversable (for, sequence, traverse)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..), snd)
import Data.Tuple.Nested (Tuple3, tuple3, uncurry3, (/\))
import Data.Unfoldable (unfoldr)
import Data.Zipper (Zipper(..))
import Data.Zipper as Z
import Debug (trace)
import Debug as Debug
import Effect.Aff (Aff, error)
import Game.Board.Operation (addPieceNoUpdate, globRelEdge, removePieceNoUpdate)
import Game.Board.PathSegment (PathSegment(..), PathSegmentError, combineSegmentWithExtant, singlePath)
import Game.Board.PieceInfo (PieceInfo)
import Game.Board.Query (adjacentRelativeEdge, toRelativeEdge)
import Game.Board.Types (Board(..), BoardError(..), _pieces)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Location (Location(..), directionTo, followDirection)
import Game.Piece (Piece(..), chickenPiece, cornerCutPiece, crossPiece, idPiece, leftPiece, rightPiece)
import Game.Port as PortType
import Partial.Unsafe (unsafeCrashWith)

data PathError
  = LocationsAreNotAdjacent Location Location
  | PathIsEmpty
  | WireInputEqualsOutput CardinalDirection CardinalDirection
  | PathSegmentError PathSegmentError
derive instance Generic PathError _
derive instance Eq PathError
-- TODO: improve error messages
instance Show PathError where
  show = genericShow


type Path =
  { initial :: CardinalDirection
  , start :: Location
  , segments :: Array CardinalDirection
  , terminal :: CardinalDirection
  }

end :: Path -> Location
end path = A.foldl followDirection path.start path.segments

toPath :: CardinalDirection -> Array Location -> CardinalDirection -> Either PathError Path
toPath initial locations terminal = do
  {head: start, tail} <- note PathIsEmpty (A.uncons locations)
  segments <- A.zipWithA directionTo' locations tail
  pure { initial, start, segments, terminal }
  where
    directionTo' curr prev = 
      note (LocationsAreNotAdjacent curr prev) (directionTo curr prev)

partitionPath :: Path ->  Either PathError (Map Location PathSegment)
partitionPath { initial, start, segments, terminal } =
  case A.uncons segments of
    Nothing -> lmap PathSegmentError $ M.singleton start <$> singlePath initial terminal
    Just {head, tail} -> do
      segment <- lmap PathSegmentError $ singlePath initial head
      let path' =
            { initial: oppositeDirection head
            , start: followDirection start head
            , segments: tail
            , terminal: terminal }
      M.insert start segment <$> partitionPath path'

addPath :: forall m
  .  MonadState Board m
  => MonadError BoardError m
  => CardinalDirection -> Array Location -> CardinalDirection -> m Path
addPath initialDir locations terminalDir = do
  path <- liftBoardError (toPath initialDir locations terminalDir)
  addPathToBoard path
  updateEndPoints path
  pure path

updateEndPoints :: forall m
  .  MonadState Board m
  => Path -> m Unit
updateEndPoints path = do
  headAdj <- toRelativeEdge (absolute path.start path.initial) >>= adjacentRelativeEdge
  globRelEdge headAdj (Just PortType.Input)
  --do tail later

{-

-}
addPathToBoard :: forall m
  .  MonadState Board m 
  => MonadError BoardError m
  => Path -> m Unit 
addPathToBoard path = do
  pathSegments <- liftBoardError (partitionPath path)
  forWithIndex_ pathSegments \loc segment -> do
    extant <- use (_pieces <<< at loc)
    { piece, rotation } <- liftBoardError (lmap PathSegmentError (combineSegmentWithExtant segment extant))
    catchError (void $ removePieceNoUpdate loc) (\_ -> pure unit)
    addPieceNoUpdate loc piece rotation
  
liftBoardError :: forall m a. MonadError BoardError m => Either PathError a -> m a
liftBoardError = liftEither <<< lmap (Other <<< show)