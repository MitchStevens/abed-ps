module Guide.Condition where

import Prelude

import Data.Foldable (elem)
import Data.Maybe (isJust, isNothing)
import Data.Nullable (Nullable, toMaybe)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Tuple (Tuple)
import Data.Typelevel.Num (class Nat, toInt, toInt')
import Effect (Effect)
import Game.Level.Completion (CompletionStatus)
import Game.Piece (PieceId(..))
import Type.Proxy (Proxy(..))
import Web.DOM (Element)

data Condition
foreign import data Negate :: Condition -> Condition
foreign import data BoardIsEmptyCondition :: Condition
foreign import data PieceAtCondition :: Type -> Type -> Symbol -> Condition
foreign import data AnyPieceAtCondition :: Type -> Type -> Condition
foreign import data CompletionStatusEqualsCondition :: Symbol -> Condition

type BoardIsEmpty r = ("" :: BoardIsEmptyCondition | r)
type PieceAt x y pieceId r = ("" :: PieceAtCondition x y pieceId | r)
type AnyPieceAt x y r = ("" :: AnyPieceAtCondition x y | r)
type NoPieceAt x y r = ("" :: Negate (AnyPieceAtCondition x y) | r)
type CompletionStatusEquals completionStatus r = ("" :: CompletionStatusEqualsCondition completionStatus | r)

class Verify :: forall k. k -> Constraint
class Verify c where
  --conditionName :: String
  verifyCondition :: Effect Boolean

instance Verify c => Verify (Negate c) where
  --conditionName = "not (" <> conditionName @c <> ")"
  verifyCondition = not <$> verifyCondition @c

instance Verify BoardIsEmptyCondition where
  --conditionName = "Board is empty"
  verifyCondition = pure false

instance (Nat x, Nat y) => Verify (PieceAtCondition x y pieceId) where
  --conditionName = reflectSymbol (Proxy :: Proxy pieceId) <> " piece at " <> (reflectLocation @x @y)
  verifyCondition = pure false



--instance
--  ( Verify row1
--  , Verify row2
--  , Union row1 row2 row3
--  , Nub row3 row
--  ) => Verify row
--  where
--  conditionName = "multiple conditions"
--  verifyCondition = (&&) <$> verifyCondition @row1 <*> verifyCondition @row2

reflectLocation :: forall x y. Nat x => Nat y => String
reflectLocation = "(" <> show (toInt' (Proxy :: Proxy x)) <> "," <> show (toInt' (Proxy :: Proxy y)) <> ")"


foreign import boardIsEmpty :: Effect Boolean
foreign import locationAt :: Int -> Int -> Effect (Nullable PieceId)
foreign import pieceAt :: Int -> Int -> Effect (Nullable Element)
foreign import completionStatus :: Effect (Nullable String)