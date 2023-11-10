module Test.Unit.AssertExtra where

import Prelude

import Control.Monad.Trans.Class (lift)
import Data.Array (findIndex, findLastIndex)
import Data.Either (Either(..))
import Data.Foldable (class Foldable, elem, foldr)
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff, liftAff)
import Test.Unit (Test, failure, success)
import Test.Unit.Assert (shouldEqual)
import Test.Unit.Assert as Test.Unit

assertRight :: forall m a b. MonadAff m => Show a => Either a b -> m Unit
assertRight either = liftAff $ case either of
  Right _ -> success
  Left a -> failure $ "expected Right _, got " <> show a

assertLeft :: forall m a b. MonadAff m => Show b => Either a b -> m Unit
assertLeft either = liftAff $ case either of
  Right b -> failure $ "expected Left _, got " <> show b
  Left _ -> success

assertNothing :: forall m a. MonadAff m => Show a => Maybe a -> m Unit
assertNothing maybe = liftAff $
  case maybe of
    Just a -> failure $ "Expected Nothing, got " <> show (Just a)
    Nothing -> success

assertJust :: forall m a. MonadAff m => Show a => Maybe a -> m Unit
assertJust maybe = liftAff $
  case maybe of
    Just _ -> success
    Nothing -> failure "Expected Just _, got Nothing"

equal :: forall m a. MonadAff m => Eq a => Show a => a -> a -> m Unit
equal expected actual = liftAff $ Test.Unit.equal expected actual

notEqual :: forall m a. MonadAff m => Eq a => Show a => a -> a -> m Unit
notEqual expected actual = liftAff $
  if expected /= actual then success
  else failure $ "expected " <> show expected <>
       "not equal to " <> show actual

shouldEqual :: forall m a. MonadAff m => Eq a => Show a => a -> a -> m Unit
shouldEqual a b = liftAff $ Test.Unit.shouldEqual a b

shouldNotEqual :: forall m a. MonadAff m => Eq a => Show a => a -> a -> m Unit
shouldNotEqual = flip notEqual

shouldContain :: forall f m a. MonadAff m => Foldable f => Eq a => Show a => Show (f a) => f a -> a -> m Unit
shouldContain fa expected = liftAff $
  if elem expected fa then success else failure $ (show expected <> " was not found in " <> show fa)

shouldBeBefore :: forall m a. MonadAff m => Eq a => Show a => a -> a -> Array a -> m Unit
shouldBeBefore first second fa = liftAff $
  case findIndex (eq first) fa, findLastIndex (eq second) fa of
    Just i, Just j ->
      if i < j
        then success
        else failure $ show second <> " was found before " <> show first <> " in the array " <> show fa
    Just _, Nothing -> failure $ show second <> " was not found in " <> show fa
    Nothing, Just _ -> failure $ show first <> " was not found in " <> show fa
    Nothing, Nothing -> failure $ "neither " <> show first <> " nor " <> show second <> " was found in " <> show fa

