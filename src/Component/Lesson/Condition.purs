module Component.Lesson.Condition where

import Prelude

import Data.Nullable (Nullable)
import Data.Symbol (reflectSymbol)
import Data.Typelevel.Num (class Nat, toInt, toInt')
import Effect (Effect)
import Game.Piece (PieceId(..))
import Prim.Row (class Cons, class Nub, class Union, Cons)
import Type.Proxy (Proxy(..))

data Condition
foreign import data BoardIsEmptyCondition :: Condition
foreign import data PieceAtCondition :: Type -> Type -> Symbol -> Condition
foreign import data AnyPieceAtCondition :: Type -> Type -> Condition
foreign import data NoPieceAtCOndition :: Type -> Type -> Condition


type BoardIsEmpty = ("" :: BoardIsEmptyCondition)
type PieceAt = ("" :: BoardIsEmptyCondition)


class Verify :: forall k. k -> Constraint
class Verify c where
  conditionName :: String
  verifyCondition :: Effect Boolean


instance Verify BoardIsEmptyCondition where
  conditionName = "Board is empty"
  verifyCondition = pure false
else
instance (Nat x, Nat y) => Verify (PieceAtCondition x y pieceId) where
  conditionName = reflectSymbol (Proxy :: Proxy pieceId) <> " piece at " <> (reflectLocation @x @y)
  verifyCondition = pure false
else
instance
  ( Verify row1
  , Verify row2
  , Union row1 row2 row3
  , Nub row3 row
  ) => Verify row
  where
  conditionName = "multiple conditions"
  verifyCondition = (&&) <$> verifyCondition @row1 <*> verifyCondition @row2

reflectLocation :: forall x y. Nat x => Nat y => String
reflectLocation = "(" <> show (toInt' (Proxy :: Proxy x)) <> "," <> show (toInt' (Proxy :: Proxy y)) <> ")"


foreign import boardIsEmpty :: Effect Boolean
foreign import atLocation :: Int -> Int -> Effect (Nullable PieceId)
