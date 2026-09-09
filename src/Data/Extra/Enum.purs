module Data.Extra.Enum
  ( inverseMap
  ) where

import Prelude

import Data.Enum (class BoundedEnum, upFromIncluding)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe)
import Data.Tuple (Tuple(..))

-- | Inverts a mapping out of a bounded enum by brute force: walks every
-- | value of `a` once, applying `f` to build a `Map`, so a `find`-based
-- | inversion doesn't have to rescan `a`'s values and reapply `f` on every
-- | lookup.
-- |
-- | The table is only built once *per partial application* -- `let inv =
-- | inverseMap f in inv b1 <> inv b2` shares one `table` across both
-- | lookups, but two separate top-level calls `inverseMap f b1` and
-- | `inverseMap f b2` each rebuild it from scratch. Hold onto the result of
-- | `inverseMap f` and reuse it to actually get the caching.
inverseMap :: forall a b. BoundedEnum a => Ord b => (a -> b) -> b -> Maybe a
inverseMap f = \b -> M.lookup b table
  where
  table :: Map b a
  table = M.fromFoldable (map (\a -> Tuple (f a) a) (upFromIncluding bottom :: Array a))
