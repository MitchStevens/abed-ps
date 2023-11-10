module Data.Zipper where

import Prelude

import Control.Comonad (class Comonad, class Extend, extract)
import Data.Foldable (class Foldable, foldMap, foldl, foldr)
import Data.Lens (Lens', lens)
import Data.List (List(..))
import Data.List as L
import Data.Maybe (Maybe(..))
import Data.Traversable (class Traversable, sequence, traverse)
import Data.Tuple (Tuple(..))
import Data.Unfoldable (unfoldr)

data Zipper a = Zipper (List a) a (List a)

instance Functor Zipper where
  map f (Zipper ls v rs) = Zipper (map f ls) (f v) (map f rs)

instance Foldable Zipper where
  foldr f z (Zipper ls v rs) = foldr f (f v (foldl (flip f) z ls)) rs
  foldl f z (Zipper ls v rs) = foldl f (f (foldr (flip f) z rs) v) ls
  foldMap f (Zipper ls v rs) = foldMap f (L.reverse ls) <> f v <> foldMap f rs

instance Traversable Zipper where
  traverse f (Zipper ls v rs) = Zipper <$> (L.reverse <$> traverse f (L.reverse ls)) <*> f v <*> traverse f rs
  sequence (Zipper ls v rs) = Zipper <$> (L.reverse <$> sequence (L.reverse ls)) <*> v <*> sequence rs

instance Extend Zipper where
  extend f zipper = Zipper (map f lefts) (f zipper) (map f rights)
    where
      dup x = Tuple x x
      lefts = unfoldr (\z -> map dup (moveLeft z)) zipper
      rights = unfoldr (\z -> map dup (moveRight z)) zipper

instance Comonad Zipper where
  extract (Zipper _  v _) = v

moveLeft :: forall a. Zipper a -> Maybe (Zipper a)
moveLeft (Zipper ls v rs) = case ls of
  Nil -> Nothing
  Cons v' ls' -> Just (Zipper ls' v' (Cons v rs))

moveRight :: forall a. Zipper a -> Maybe (Zipper a)
moveRight (Zipper ls v rs) = case rs of
  Nil -> Nothing
  Cons v' rs' -> Just (Zipper (Cons v ls) v' rs')

head :: forall a. Zipper a -> a
head = extract

_head :: forall a. Lens' (Zipper a) a
_head = lens head (\(Zipper ls _ rs) x -> Zipper ls x rs)

append :: forall a. a -> Zipper a -> Zipper a
append v' (Zipper ls v rs) = Zipper (Cons v ls) v' Nil

singleton :: forall a. a -> Zipper a
singleton v = Zipper Nil v Nil

undo = moveLeft
redo = moveRight