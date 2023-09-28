module Test.Unit.AssertExtra where

import Prelude

import Data.Array (findIndex, findLastIndex)
import Data.Either (Either(..))
import Data.Foldable (class Foldable, elem, foldr)
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.Maybe (Maybe(..))
import Test.Unit (Test, failure, success)

assertRight :: forall a b. Show a => Either a b -> Test
assertRight = case _ of
  Right _ -> success
  Left a -> failure $ "expected Right _, got " <> show a

assertLeft :: forall a b. Show b => Either a b -> Test
assertLeft = case _ of
  Right b -> failure $ "expected Left _, got " <> show b
  Left _ -> success

assertNothing :: forall a. Show a => Maybe a -> Test
assertNothing = case _ of
  Just a -> failure $ "Expected Nothing, got " <> show (Just a)
  Nothing -> success

assertJust :: forall a. Show a => Maybe a -> Test
assertJust = case _ of
  Just _ -> success
  Nothing -> failure "Expected Just _, got Nothing"

notEqual :: forall a. Eq a => Show a => a -> a -> Test
notEqual expected actual =
  if expected /= actual then success
  else failure $ "expected " <> show expected <>
       "not equal to " <> show actual

shouldNotEqual :: forall a. Eq a => Show a => a -> a -> Test
shouldNotEqual = flip notEqual

shouldContain :: forall f a. Foldable f => Eq a => Show a => Show (f a) => f a -> a -> Test
shouldContain fa expected =
  if elem expected fa then success else failure $ (show expected <> " was not found in " <> show fa)

shouldBeBefore :: forall a. Eq a => Show a => a -> a -> Array a -> Test
shouldBeBefore first second fa = case findIndex (eq first) fa, findLastIndex (eq second) fa of
  Just i, Just j ->
    if i < j
      then success
      else failure $ show second <> " was found before " <> show first <> " in the array " <> show fa
  Just _, Nothing -> failure $ show second <> " was not found in " <> show fa
  Nothing, Just _ -> failure $ show first <> " was not found in " <> show fa
  Nothing, Nothing -> failure $ "neither " <> show first <> " nor " <> show second <> " was found in " <> show fa

