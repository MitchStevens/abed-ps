module Data.Map.Unsafe where

import Prelude

import Data.Map (Map)
import Data.Map.Internal as Map

--  only creates valid maps when f is increasing
unsafeMapKey :: forall k l a. (k -> l) -> Map k a -> Map l a
unsafeMapKey f = go
  where
    go = case _ of
      Map.Leaf -> Map.Leaf
      Map.Node n m k v l r -> Map.Node n m (f k) v (go l) (go r)
