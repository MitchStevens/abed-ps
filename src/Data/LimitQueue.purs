{-
  Not efficent! use only for small n!
-}
module Data.LimitQueue where

import Prelude

import Data.Array as A
import Data.Traversable (class Traversable)

newtype LimitQueue a = LimitQueue { limit :: Int, queue :: Array a }
derive instance Functor LimitQueue

empty :: forall a. Int -> LimitQueue a
empty n = limitQueue n []

limitQueue :: forall a. Int -> Array a -> LimitQueue a
limitQueue n array = LimitQueue { limit: n, queue: A.drop (A.length array - n) array }

enqueue :: forall a. a -> LimitQueue a -> LimitQueue a
enqueue a (LimitQueue { limit, queue }) = limitQueue limit (A.cons a queue)
