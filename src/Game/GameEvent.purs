module Game.GameEvent where

import Prelude

import Data.Foldable (find, foldMap, sum)
import Data.Generic.Rep (class Generic)
import Data.List (List(..), head)
import Data.Log.Level as LogLevel
import Data.Log.Message (Message)
import Data.Log.Tag (tag)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Predicate (Predicate(..))
import Data.Show.Generic (genericShow, genericShow')
import Data.Tuple (Tuple(..))
import Game.Board (PieceInfo)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece.Types (Piece(..), PieceId(..))
import Game.Rotation (Rotation(..))

data GameEvent
  = GameStarted
  | BoardEvent BoardEvent
  | SidebarEvent SidebarEvent
derive instance Generic GameEvent _
derive instance Eq GameEvent
derive instance Ord GameEvent
instance Show GameEvent where
  show = genericShow

-- for use with logging
data BoardEvent
  = AddPieceEvent Location Piece
  | RemovePieceEvent Location PieceInfo
  | MovePieceEvent Location Location
  | RotatePieceEvent Location Rotation
  | AddPathEvent CardinalDirection (Array Location) CardinalDirection
  | IncrementSizeEvent
  | DecrementSizeEvent
  | ClearEvent
derive instance Generic BoardEvent _
derive instance Eq BoardEvent
derive instance Ord BoardEvent
-- TODO: make a better instance
instance Show BoardEvent where
  show = genericShow

{-
  if the board changed, it probably changed in a specific location.
  Nothing -> unknown how many locations were modified, redraw the whole board
  Just l -> redraw l and pieces adjacent to l
-}
--boardEventLocationsChanged :: BoardEvent -> Maybe (Array Location)
--boardEventLocationsChanged = case _ of
--  AddedPiece loc _     -> Just [loc]
--  RemovedPiece loc _   -> Just [loc]
--  MovedPiece src dst   -> Just [src, dst]
--  RotatedPiece loc _   -> Just [loc]
--  UndoBoardEvent       -> Nothing
--  IncrementSize        -> Nothing
--  DecrementSize        -> Nothing

data SidebarEvent
  = BoardSizeIncrementClicked
  | BoardSizeDecrementClicked
derive instance Generic SidebarEvent _
derive instance Eq SidebarEvent
derive instance Ord SidebarEvent
instance Show SidebarEvent where
  show = genericShow


-- pPre
--boardEvent :: Predicate GameEvent
--boardEvent = Predicate $ case _ of
--  BoardEvent _ -> true
--  _ -> false
--
--pieceAdded :: Predicate GameEvent
--pieceAdded = Predicate $ case _ of
--  BoardEvent (AddedPiece _ _) -> true
--  _ -> false
--
--pieceRemoved :: Predicate GameEvent
--pieceRemoved = Predicate $ case _ of
--  BoardEvent (RemovedPiece _ _) -> true
--  _ -> false
--
--pieceMoved :: Predicate GameEvent
--pieceMoved = Predicate $ case _ of
--  BoardEvent (MovedPiece _ _) -> true
--  _ -> false
--
--pieceMovedTo :: Location -> Predicate GameEvent
--pieceMovedTo loc = Predicate $ case _ of
--  BoardEvent (MovedPiece _ dst) -> loc == dst
--  _ -> false
--
--pieceRotated :: Predicate GameEvent
--pieceRotated = Predicate $ case _ of
--  BoardEvent (RotatedPiece _ _) -> true
--  _ -> false
--
--locationAt :: Location -> Predicate GameEvent
--locationAt loc = Predicate $ case _ of
--  BoardEvent (AddedPiece loc' _) -> loc == loc'
--  BoardEvent (RemovedPiece loc' _) -> loc == loc'
--  BoardEvent (MovedPiece _ dst) -> loc == dst
--  BoardEvent (RotatedPiece loc' _) -> loc == loc'
--  _ -> false
--
--pieceId :: PieceId -> Predicate GameEvent
--pieceId pieceId = Predicate $ case _ of
--  BoardEvent (AddedPiece _ id) -> pieceId == id
--  BoardEvent (RemovedPiece _ id) -> pieceId == id
--  _ -> false
--
--latest :: Predicate GameEvent -> Predicate GameEventStore
--latest (Predicate p) = Predicate $ \store ->
--  maybe false p (head store.gameEventHistory)
--
---- todo: write this with a foldr, may be able to use short circuiting
--count :: (Int -> Int -> Boolean) -> Int -> Predicate GameEvent -> Predicate GameEventStore
--count cmp n (Predicate p)= Predicate $ \store -> 
--  cmp (sum (M.filterKeys p store.allGameEvents)) n
--
--firstTime :: Predicate GameEvent -> Predicate GameEventStore
--firstTime = latest && count eq 1
--
--secondTime :: Predicate GameEvent -> Predicate GameEventStore
--secondTime = latest && count eq 2