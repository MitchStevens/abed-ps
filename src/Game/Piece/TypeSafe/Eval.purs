module Game.Piece.TypeSafe.Eval where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Piece as Piece
import Game.Piece.TypeSafe.Capacity (Capacity)
import Game.Piece.TypeSafe.Direction (class DirectionValue)
import Game.Piece.TypeSafe.PieceSpec (PieceSpec, insert)
import Prim.Row (class Lacks)
import Prim.Row as Row
import Prim.RowList (class RowToList, Cons, Nil, RowList)
import Record (set)
import Record.Unsafe (unsafeGet, unsafeHas)
import Type.Proxy (Proxy(..))
import Unsafe.Coerce (unsafeCoerce)

{-

-}
class ToRecordType :: Row Capacity -> Row Type -> Constraint
class ToRecordType capacities record | capacities -> record

instance
  ( RowToList capacities capacitiesRowList
  , ToRecordTypeRowList capacitiesRowList record
  ) => ToRecordType capacities record


class ToRecordTypeRowList :: RowList Capacity -> Row Type -> Constraint
class ToRecordTypeRowList capacities record | capacities -> record

instance
  ( ToRecordTypeRowList tail rs
  , Row.Cons dir Piece.Signal rs record
  , DirectionValue dir
  ) => ToRecordTypeRowList (Cons dir x tail) record
else instance ToRecordTypeRowList Nil ()

unsafeToMap :: forall r. Record r -> Map Piece.CardinalDirection Piece.Signal
unsafeToMap r =
  M.fromFoldable 
    [ Tuple Piece.Up    (unsafeGetSignal "u")
    , Tuple Piece.Right (unsafeGetSignal "r")
    , Tuple Piece.Down  (unsafeGetSignal "d")
    , Tuple Piece.Left  (unsafeGetSignal "l")
    ]
  where
    unsafeGetSignal :: String -> Piece.Signal
    unsafeGetSignal s = if unsafeHas s r then unsafeGet s r else Piece.Signal 0

unsafeFromMap :: forall r. Map Piece.CardinalDirection Piece.Signal -> Record r
unsafeFromMap m = unsafeCoerce
  { u: getSignal Piece.Up
  , r: getSignal Piece.Right
  , d: getSignal Piece.Down
  , l: getSignal Piece.Left
  }
  where
    getSignal d = fromMaybe (Piece.Signal 0) (M.lookup d m)

type HasEval r = ( eval :: Map Piece.CardinalDirection Piece.Signal -> Map Piece.CardinalDirection Piece.Signal | r)

eval :: forall @i @o input output (r :: Row Type)
  .  ToRecordType i input
  => ToRecordType o output
  => Row.Lacks "eval" r
  => (Record input -> Record output)
  -> PieceSpec i o r (HasEval r)
eval f = insert @"eval" evalFunc
  where
    --evalFunc :: PieceEval
    evalFunc = unsafeFromMap >>> f >>> unsafeToMap