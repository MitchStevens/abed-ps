module Data.Diff
  ( DiffOp(..)
  , diff
  , reconstructLeft
  , reconstructRight
  ) where

import Prelude

import Data.Array (mapMaybe)
import Data.List (List(..), (:))
import Data.List as List
import Data.Maybe (Maybe(..))

-- | One step of an edit script turning a left sequence into a right one.
-- | `Keep` items are common to both; `Remove` exist only on the left,
-- | `Insert` only on the right.
-- |
-- | The whole script is order-preserving: reading off `Keep`/`Remove` (via
-- | `reconstructLeft`) gives back the left sequence exactly, and `Keep`/
-- | `Insert` (via `reconstructRight`) gives back the right one -- every
-- | element of both inputs is accounted for exactly once, in its original
-- | position.
data DiffOp a
  = Keep a
  | Remove a
  | Insert a

derive instance eqDiffOp :: Eq a => Eq (DiffOp a)

instance showDiffOp :: Show a => Show (DiffOp a) where
  show = case _ of
    Keep a -> "Keep " <> show a
    Remove a -> "Remove " <> show a
    Insert a -> "Insert " <> show a

-- | The left sequence a diff script was built from (its `Keep`s and `Remove`s).
reconstructLeft :: forall a. Array (DiffOp a) -> Array a
reconstructLeft = mapMaybe case _ of
  Keep a -> Just a
  Remove a -> Just a
  Insert _ -> Nothing

-- | The right sequence a diff script was built from (its `Keep`s and `Insert`s).
reconstructRight :: forall a. Array (DiffOp a) -> Array a
reconstructRight = mapMaybe case _ of
  Keep a -> Just a
  Insert a -> Just a
  Remove _ -> Nothing

-- | A longest-common-subsequence edit script between two sequences: the
-- | shared (`Keep`) elements plus whatever's only on the left (`Remove`) or
-- | only on the right (`Insert`), interleaved in an order that reconstructs
-- | both originals exactly -- see `reconstructLeft`/`reconstructRight`, and
-- | the round-trip law in Test.Data.Diff.
-- |
-- | Plain textbook LCS recursion, no memoisation table: the sequences this
-- | is meant for (path commands for one piece's outline) are a handful of
-- | elements, not worth the bookkeeping a DP table would add.
diff :: forall a. Eq a => Array a -> Array a -> Array (DiffOp a)
diff xs ys = List.toUnfoldable (go (List.fromFoldable xs) (List.fromFoldable ys))
  where
  go :: List a -> List a -> List (DiffOp a)
  go Nil Nil = Nil
  go Nil (y : yt) = Insert y : go Nil yt
  go (x : xt) Nil = Remove x : go xt Nil
  go (x : xt) (y : yt)
    | x == y = Keep x : go xt yt
    | lcsLength xt (y : yt) >= lcsLength (x : xt) yt = Remove x : go xt (y : yt)
    | otherwise = Insert y : go (x : xt) yt

  lcsLength :: List a -> List a -> Int
  lcsLength Nil _ = 0
  lcsLength _ Nil = 0
  lcsLength (x : xt) (y : yt)
    | x == y = 1 + lcsLength xt yt
    | otherwise = max (lcsLength xt (y : yt)) (lcsLength (x : xt) yt)
