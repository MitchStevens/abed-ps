module Test.Unit.AssertExtra where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow)
import Control.Monad.Trans.Class (lift)
import Data.Array (findIndex, findLastIndex)
import Data.Array as A
import Data.Either (Either(..))
import Data.Foldable (class Foldable, elem, foldl, foldr, for_)
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Maybe.First (First)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Exception (Error)
import Test.Spec.Assertions (fail, shouldEqual)

shouldEqualMap :: forall k v m. Ord k => Eq v => Show v => MonadThrow Error m => Map k v -> Map k v -> m Unit
shouldEqualMap m1 m2 = 
  for_ (M.keys m1 <> M.keys m2) \k -> 
    M.lookup k m1 `shouldEqual` M.lookup k m2



{-
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
-}

shouldBeBefore :: forall m f a. MonadError Error m => Foldable f => Eq a => Show a => a -> a -> f a -> m Unit
shouldBeBefore first second fa =
  case findIndex (eq first) arr, findLastIndex (eq second) arr of
    Just i, Just j -> when (not (i < j)) do
      fail $ show second <> " was found before " <> show first <> " in " <> show arr
    Just _, Nothing ->
      fail $ show second <> " was not found in " <> show arr
    Nothing, Just _ -> 
      fail $ show first <> " was not found in " <> show arr
    Nothing, Nothing -> 
      fail $ "neither " <> show first <> " nor " <> show second <> " was found in " <> show arr
  where arr = A.fromFoldable fa

