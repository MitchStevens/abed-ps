module Test.Rotation where

import Prelude

import Data.Array (length)
import Data.Group (ginverse)
import Game.Rotation (allRotations, rotation)
import Test.QuickCheck ((===), (/==))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = do
  describe "Rotation" do
    it "basic" do
      length allRotations `shouldEqual` 4
      rotation 0 `shouldEqual` rotation 4
      rotation (-1) `shouldEqual` rotation 3
    it "is a semigroup" do
      quickCheck \a b -> rotation a <> rotation b === rotation (a+b)
    it "is a monoid" do
     quickCheck \a -> rotation a <> mempty === rotation a
     quickCheck \a -> mempty <> rotation a === rotation a
    it "is a group" do
     quickCheck \a -> rotation a <> ginverse (rotation a) === mempty

