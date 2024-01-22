module Guide.Condition where

import Prelude

import Data.Foldable (any, elem)
import Data.Maybe (isJust, isNothing)
import Data.Nullable (Nullable, toMaybe)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Tuple (Tuple)
import Data.Typelevel.Num (class Nat, toInt, toInt')
import Effect (Effect)
import Effect.Class.Console (log)
import Effect.Exception (throw)
import Game.Level.Completion (CompletionStatus)
import Game.Location (Location(..), location)
import Game.Piece (PieceId(..))
import Game.Rotation (rotation)
import Guide.Elements (rotationAt, pieceAt)
import Halogen.HTML (object)
import Prim.Row (class Cons)
import Prim.RowList (class RowToList, Nil, RowList)
import Type.Proxy (Proxy(..))
import Type.RowList (class ListToRow)
import Web.DOM (Element)

data Condition
foreign import data Negate :: Condition -> Condition
foreign import data BoardIsEmptyCondition :: Condition
foreign import data PieceAtCondition :: Type -> Type -> Symbol -> Condition
foreign import data AnyPieceAtCondition :: Type -> Type -> Condition
foreign import data CompletionStatusEqualsCondition :: Symbol -> Condition
foreign import data RotationEqualsCondition :: Type -> Type -> Type -> Condition

type BoardIsEmpty r = ("" :: BoardIsEmptyCondition | r)
type PieceAt x y pieceId r = ("" :: PieceAtCondition x y pieceId | r)
type AnyPieceAt x y r = ("" :: AnyPieceAtCondition x y | r)
type NoPieceAt x y r = ("" :: Negate (AnyPieceAtCondition x y) | r)
type CompletionStatusEquals completionStatus r = ("" :: CompletionStatusEqualsCondition completionStatus | r)
type RotationEquals x y rot r = ("" :: RotationEqualsCondition x y rot | r)

class Verify :: forall k. k -> Constraint
class Verify condition where
  name :: String
  assert :: Effect Boolean

instance ListToRow Nil row  => Verify row where
  name = "Empty row: always true"
  assert = pure true
else
instance
  ( Verify c
  , Verify rest
  , Cons "" c rest list) => Verify row where
  name = name @c <> " and " <> name @rest
  assert = (&&) <$> assert @c <*> assert @rest
else
instance Verify c => Verify (Negate c) where
  name = "not (" <> name @c <> ")"
  assert = not <$> assert @c
else
instance Verify BoardIsEmptyCondition where
  name = "Board is empty"
  assert = pure false
else
instance (Nat x, Nat y, IsSymbol pieceId) => Verify (PieceAtCondition x y pieceId) where
  name = reflectSymbol (Proxy :: Proxy pieceId) <> " piece at " <> show (reflectLocation @x @y)
  assert = do
    let loc = location (toInt' (Proxy :: Proxy x)) (toInt' (Proxy :: Proxy y))
    let pieceId = PieceId $ reflectSymbol (Proxy :: Proxy pieceId)
    any (eq pieceId) <<< toMaybe <$> pieceAt loc
else
instance (Nat x, Nat y, Nat rot) => Verify (RotationEqualsCondition x y rot) where
  name = "Rotation equals " <> show (toInt' (Proxy :: Proxy rot))
  assert = do
    let loc = location (toInt' (Proxy :: Proxy x)) (toInt' (Proxy :: Proxy y))
    let rot = rotation (toInt' (Proxy :: Proxy rot))
    any (eq rot) <<< map rotation <<< toMaybe <$> rotationAt loc


verifyCondition :: forall @c. Verify c => Effect Boolean
verifyCondition = do
  b <- assert @c
  if b
    then log (name @c) *> pure true
    else throw (name @c)



--instance
--  ( Verify row1
--  , Verify row2
--  , Union row1 row2 row3
--  , Nub row3 row
--  ) => Verify row
--  where
--  conditionName = "multiple conditions"
--  verifyCondition = (&&) <$> verifyCondition @row1 <*> verifyCondition @row2

reflectLocation :: forall @x @y. Nat x => Nat y => Location
reflectLocation = location (toInt' (Proxy :: Proxy x)) (toInt' (Proxy :: Proxy y))