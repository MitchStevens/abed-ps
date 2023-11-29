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
      Map.Two l k v r -> Map.Two (go l) (f k) v (go r)
      Map.Three l k1 v1 m k2 v2 r -> Map.Three (go l) (f k1) v1 (go m) (f k2) v2 (go r)