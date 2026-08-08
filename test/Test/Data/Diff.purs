module Test.Data.Diff where

import Prelude

import Data.Diff (DiffOp(..), diff, reconstructLeft, reconstructRight)
import Test.QuickCheck (assertEquals)
import Test.QuickCheck.Gen (Gen, arrayOf, chooseInt)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

-- | A small alphabet so random arrays actually overlap sometimes -- with a
-- | wide-open Int range two random arrays would almost never share an
-- | element, and the Keep path would never get exercised.
genSmallArray :: Gen (Array Int)
genSmallArray = arrayOf (chooseInt 0 4)

spec :: Spec Unit
spec =
  describe "Data.Diff" do
    it "keeps identical sequences entirely" do
      diff [ 1, 2, 3 ] [ 1, 2, 3 ] `shouldEqual` [ Keep 1, Keep 2, Keep 3 ]

    it "removes everything when the right side is empty" do
      diff [ 1, 2, 3 ] [] `shouldEqual` [ Remove 1, Remove 2, Remove 3 ]

    it "inserts everything when the left side is empty" do
      diff [] [ 1, 2, 3 ] `shouldEqual` [ Insert 1, Insert 2, Insert 3 ]

    it "finds the shared subsequence around a single removal" do
      diff [ 1, 2, 3 ] [ 1, 3 ] `shouldEqual` [ Keep 1, Remove 2, Keep 3 ]

    it "finds the shared subsequence around a single insertion" do
      diff [ 1, 3 ] [ 1, 2, 3 ] `shouldEqual` [ Keep 1, Insert 2, Keep 3 ]

    it "handles a swap in the middle (our actual use case: one leg for another)" do
      diff [ 1, 2, 3, 4 ] [ 1, 5, 3, 4 ] `shouldEqual`
        [ Keep 1, Remove 2, Insert 5, Keep 3, Keep 4 ]

    describe "round-trip (the property the whole design depends on)" do
      it "reconstructs the left sequence from Keep+Remove" do
        quickCheck do
          xs <- genSmallArray
          ys <- genSmallArray
          pure (reconstructLeft (diff xs ys) `assertEquals` xs)

      it "reconstructs the right sequence from Keep+Insert" do
        quickCheck do
          xs <- genSmallArray
          ys <- genSmallArray
          pure (reconstructRight (diff xs ys) `assertEquals` ys)
