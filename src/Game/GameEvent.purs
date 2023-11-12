module Game.GameEvent where

import Prelude

import Data.Foldable (find, foldMap, sum)
import Data.List (List(..), head)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Predicate (Predicate(..))
import Data.Tuple (Tuple(..))
import Game.Location (Location(..), Rotation(..))
import Game.Piece (PieceId(..))
import Halogen.Store.Select (Selector(..))

data GameEvent
  = BoardEvent BoardEvent
  | SidebarEvent SidebarEvent
derive instance Eq GameEvent
derive instance Ord GameEvent

type GameEventStore =
  { gameEventHistory :: List GameEvent -- todo: cap this list to a finite length maybe
  , allGameEvents :: Map GameEvent Int
  }

empty :: GameEventStore
empty = { gameEventHistory: Nil, allGameEvents: M.empty }

cons :: GameEvent -> GameEventStore -> GameEventStore
cons gameEvent store =
  { gameEventHistory: Cons gameEvent store.gameEventHistory
  , allGameEvents: M.insertWith add gameEvent 1 store.allGameEvents
  }

data BoardEvent
  = AddedPiece Location PieceId
  | RemovedPiece Location PieceId
  | MovedPiece Location Location
  | RotatedPiece Location Rotation
  | UndoBoardEvent
  | IncrementSize
  | DecrementSize
  | Multiple (List BoardEvent)
derive instance Eq BoardEvent
derive instance Ord BoardEvent

instance Show BoardEvent where
  show = case _ of
    AddedPiece loc pieceId -> "Added " <> show loc <> " at " <> show pieceId
    RemovedPiece loc pieceId -> "Removed " <> show loc <> " at " <> show pieceId
    MovedPiece src dst -> "Moved piece from " <> show src <> " to " <> show dst
    RotatedPiece loc rot -> "Rotated by " <> show rot <> " at " <> show loc
    UndoBoardEvent -> "Undo last boardEvent"
    IncrementSize -> "Incremented board size"
    DecrementSize -> "Decremented board size"
    Multiple boardEvents -> "Multiple boardEvents: " <> show boardEvents

{-
  if the board changed, it probably changed in a specific location.
  Nothing -> unknown how many locations were modified, redraw the whole board
  Just l -> redraw l and pieces adjacent to l
-}
boardEventLocationsChanged :: BoardEvent -> Maybe (Array Location)
boardEventLocationsChanged = case _ of
  AddedPiece loc _     -> Just [loc]
  RemovedPiece loc _   -> Just [loc]
  MovedPiece src dst   -> Just [src, dst]
  RotatedPiece loc _   -> Just [loc]
  UndoBoardEvent       -> Nothing
  IncrementSize        -> Nothing
  DecrementSize        -> Nothing
  Multiple boardEvents -> foldMap boardEventLocationsChanged boardEvents

data SidebarEvent
  = BoardSizeIncrementClicked
  | BoardSizeDecrementClicked
derive instance Eq SidebarEvent
derive instance Ord SidebarEvent


-- pPre
boardEvent :: Predicate GameEvent
boardEvent = Predicate $ case _ of
  BoardEvent _ -> true
  _ -> false

pieceAdded :: Predicate GameEvent
pieceAdded = Predicate $ case _ of
  BoardEvent (AddedPiece _ _) -> true
  _ -> false

pieceRemoved :: Predicate GameEvent
pieceRemoved = Predicate $ case _ of
  BoardEvent (RemovedPiece _ _) -> true
  _ -> false

pieceMoved :: Predicate GameEvent
pieceMoved = Predicate $ case _ of
  BoardEvent (MovedPiece _ _) -> true
  _ -> false

pieceMovedTo :: Location -> Predicate GameEvent
pieceMovedTo loc = Predicate $ case _ of
  BoardEvent (MovedPiece _ dst) -> loc == dst
  _ -> false

pieceRotated :: Predicate GameEvent
pieceRotated = Predicate $ case _ of
  BoardEvent (RotatedPiece _ _) -> true
  _ -> false

locationAt :: Location -> Predicate GameEvent
locationAt loc = Predicate $ case _ of
  BoardEvent (AddedPiece loc' _) -> loc == loc'
  BoardEvent (RemovedPiece loc' _) -> loc == loc'
  BoardEvent (MovedPiece _ dst) -> loc == dst
  BoardEvent (RotatedPiece loc' _) -> loc == loc'
  _ -> false

pieceId :: PieceId -> Predicate GameEvent
pieceId pieceId = Predicate $ case _ of
  BoardEvent (AddedPiece _ id) -> pieceId == id
  BoardEvent (RemovedPiece _ id) -> pieceId == id
  _ -> false

latest :: Predicate GameEvent -> Predicate GameEventStore
latest (Predicate p) = Predicate $ \store ->
  maybe false p (head store.gameEventHistory)

-- todo: write this with a foldr, may be able to use short circuiting
count :: (Int -> Int -> Boolean) -> Int -> Predicate GameEvent -> Predicate GameEventStore
count cmp n (Predicate p)= Predicate $ \store -> 
  cmp (sum (M.filterKeys p store.allGameEvents)) n

firstTime :: Predicate GameEvent -> Predicate GameEventStore
firstTime = latest && count eq 1

secondTime :: Predicate GameEvent -> Predicate GameEventStore
secondTime = latest && count eq 2