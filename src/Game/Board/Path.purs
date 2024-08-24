module Game.Board.Path
  where

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
import Effect.Aff (Aff, error)
import Game.Board.Operation (addPieceNoUpdate, removePieceNoUpdate, updatePortsAround)
import Game.Board.PathSegment (PathSegment(..), PathSegmentError, combineSegmentWithExtant, singlePath)
import Game.Board.PieceInfo (PieceInfo)
import Game.Board.Types (Board(..), BoardError, _pieces)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Edge (Edge(..), edgeDirection, edgeLocation)
import Game.Location (Location(..), directionTo, followDirection)
import Game.Piece (Piece(..), chickenPiece, cornerCutPiece, crossPiece, idPiece, leftPiece, rightPiece)
import Partial.Unsafe (unsafeCrashWith)

data PathError
  = ObstructedByAnotherPiece Location
  | LocationsAreNotAdjacent Location Location
  | PathIsEmpty
  | WireInputEqualsOutput CardinalDirection CardinalDirection
  | PathSegmentError PathSegmentError
derive instance Generic PathError _
derive instance Eq PathError
-- TODO: improve error messages
instance Show PathError where
  show = genericShow

{-
  A Path consists of:
    - an initial `Direction`
    - an initial `Location`
    - a list of next `Directions`
    - a terminal `Direction`



-}
type Path =
  { initial :: CardinalDirection
  , start :: Location
  , segments :: Array CardinalDirection
  , terminal :: CardinalDirection
  }

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
  => CardinalDirection -> Array Location -> CardinalDirection -> m Boolean
addPath initialDir locations terminalDir =
  case toPath initialDir locations terminalDir of
    Left _ -> pure false
    Right path -> do
      board <- get
      catchError (addPathToBoard path) (\_ -> put board *> pure false)

{-

-}
addPathToBoard :: forall m
  .  MonadState Board m 
  => MonadError BoardError m
  => Path -> m Boolean 
addPathToBoard path = do
  case partitionPath path of
    Left _ -> pure false
    Right pathSegments -> do
      and <$> forWithIndex pathSegments \loc segment -> do
        extant <- use (_pieces <<< at loc)
        case combineSegmentWithExtant segment extant of
          Left _ -> pure false
          Right { piece, rotation } -> do
            catchError (void $ removePieceNoUpdate loc) (\_ -> pure unit)
            addPieceNoUpdate loc piece rotation
            pure true