{-
  Not efficent! use only for small n!
-}
module Data.LimitQueue where

import Prelude

import Data.Array as A
import Data.Traversable (class Foldable, class Traversable, foldMap, foldl, foldr, sequence, traverse, traverse_)

newtype LimitQueue a = LimitQueue { limit :: Int, queue :: Array a }
derive instance Functor LimitQueue
instance Foldable LimitQueue where
  foldr f z (LimitQueue {limit, queue}) = foldr f z queue
  foldl f z (LimitQueue {limit, queue}) = foldl f z queue
  foldMap f (LimitQueue {limit, queue}) = foldMap f queue

instance Traversable LimitQueue where
  traverse f (LimitQueue {limit, queue}) = LimitQueue <<< { limit, queue: _} <$> traverse f queue
  sequence (LimitQueue {limit, queue}) = LimitQueue <<< {limit, queue: _ } <$> sequence queue

empty :: forall a. Int -> LimitQueue a
empty n = limitQueue n []
limitQueue :: forall a. Int -> Array a -> LimitQueue a
limitQueue n array = LimitQueue { limit: n, queue: A.drop (A.length array - n) array }
enqueue :: forall a. a -> LimitQueue a -> LimitQueue a
enqueue a (LimitQueue { limit, queue }) = limitQueue limit (A.cons a queue)
