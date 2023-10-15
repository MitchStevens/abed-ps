module Game.Board.BoardDeltaStore where

import Data.Lens
import Prelude

import Control.Comonad.Env (local)
import Control.Monad.State (class MonadState, gets, modify_)
import Data.Foldable (foldr, sum)
import Data.Functor.Contravariant (cmap)
import Data.Lens.At (at)
import Data.Lens.Record (prop)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Predicate (Predicate(..))
import Data.Tuple (Tuple(..), fst, snd)
import Game.Board.BoardDelta (BoardDelta(..))
import Game.Location (Location(..), Rotation(..))
import Game.Piece (PieceId(..))
import Type.Proxy (Proxy(..))

type BoardDeltaStore =
  { boardDeltaHistory :: List BoardDelta
  , allDeltas :: Map BoardDelta Int
  }

-- do not export
--_store = prop (Proxy :: _ "boardDeltas")
--_allDeltas = _store <<< prop (Proxy :: _ "allDeltas")
--_history = _store <<< prop (Proxy :: _ "boardDeltaHistory")

empty :: BoardDeltaStore
empty =
  { boardDeltaHistory: Nil
  , allDeltas: M.empty
  }

cons :: BoardDelta -> BoardDeltaStore -> BoardDeltaStore
cons delta store =
  { boardDeltaHistory: Cons delta store.boardDeltaHistory
  , allDeltas: M.insertWith add delta 1 store.allDeltas }
  
uncons :: BoardDeltaStore -> Maybe { head :: BoardDelta, tail :: BoardDeltaStore }
uncons store = do
  { head, tail } <- L.uncons store.boardDeltaHistory
  pure { head, tail: store { boardDeltaHistory = tail }}


-- predicates
pieceAdded :: Predicate BoardDelta
pieceAdded = Predicate $ case _ of
  AddedPiece _ _ -> true
  _ -> false

pieceRemoved :: Predicate BoardDelta
pieceRemoved = Predicate $ case _ of
  RemovedPiece _ _ -> true
  _ -> false

pieceMoved :: Predicate BoardDelta
pieceMoved = Predicate $ case _ of
  MovedPiece _ _ -> true
  _ -> false

pieceMovedTo :: Location -> Predicate BoardDelta
pieceMovedTo loc = Predicate $ case _ of
  MovedPiece _ dst -> loc == dst
  _ -> false


pieceRotated :: Predicate BoardDelta
pieceRotated = Predicate $ case _ of
  RotatedPiece _ _ -> true
  _ -> false

locationAt :: Location -> Predicate BoardDelta
locationAt loc = Predicate $ case _ of
  AddedPiece loc' _ -> loc == loc'
  RemovedPiece loc' _ -> loc == loc'
  MovedPiece _ dst -> loc == dst
  RotatedPiece loc' _ -> loc == loc'

pieceId :: PieceId -> Predicate BoardDelta
pieceId pieceId = Predicate $ case _ of
  AddedPiece _ id -> pieceId == id
  RemovedPiece _ id -> pieceId == id
  MovedPiece _ _-> false
  RotatedPiece _ _ -> false

latest :: Predicate BoardDelta -> Predicate BoardDeltaStore
latest (Predicate p) = Predicate $ \store ->
  maybe false p (L.head store.boardDeltaHistory)

count :: Predicate BoardDelta -> Ordering -> Int -> Predicate BoardDeltaStore
count (Predicate p) ordering n = Predicate $ \store -> 
  compare (sum $ M.filterKeys p store.allDeltas) n == ordering

firstTime :: Predicate BoardDelta -> Predicate BoardDeltaStore
firstTime p = latest p && count p EQ 1

secondTime :: Predicate BoardDelta -> Predicate BoardDeltaStore
secondTime p = latest p && count p EQ 2
