module Game.Piece.TypeSafe.Port where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Game.Piece as Piece
import Game.Piece.Port (Port(..), inputPort, outputPort)
import Game.Piece.TypeSafe.Capacity (class CapacityValue, Capacity, getCapacityValue)
import Game.Piece.TypeSafe.Direction (class DirectionValue, getDirectionValue)
import Game.Piece.TypeSafe.PieceSpec (PieceSpec, insert)
import Prim.Row (class Lacks)
import Prim.RowList (class RowToList, Cons, Nil, RowList)


class ValidPortSpec :: Row Capacity -> Constraint
class ValidPortSpec portSpec where
  ports :: Map Piece.CardinalDirection Piece.Capacity

instance
  ( RowToList portSpec portSpecRowList
  , ValidPortSpecRowList portSpecRowList
  ) => ValidPortSpec portSpec where
    ports = portsRowList @portSpecRowList

class ValidPortSpecRowList :: RowList Capacity -> Constraint
class ValidPortSpecRowList portSpec where
  portsRowList :: Map Piece.CardinalDirection Piece.Capacity

instance
  ( DirectionValue d
  , CapacityValue c
  , ValidPortSpecRowList tail
  ) => ValidPortSpecRowList (Cons d c tail) where
    portsRowList = M.insert (getDirectionValue @d) (getCapacityValue @c) (portsRowList @tail)

instance ValidPortSpecRowList Nil where
    portsRowList = M.empty

type HasPorts r = (ports :: Map Piece.CardinalDirection Piece.Port | r)

specPorts :: forall @i @o r
  .  Lacks "ports" r
  => ValidPortSpec i
  => ValidPortSpec o
  => PieceSpec i o r ( HasPorts r)
specPorts = insert @"ports" $ M.union
    (inputPort  <$> ports @i)
    (outputPort <$> ports @o)