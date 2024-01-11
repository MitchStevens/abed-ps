module Test.Rotation where

import Prelude

import Data.Array (length)
import Data.Group (ginverse)
import Data.Number (pi)
import Game.Rotation (allRotations, rotation, toDegrees, toRadians)
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
    it "toDegrees" do
      toDegrees (rotation 0) `shouldEqual` 0.0
      toDegrees (rotation 1) `shouldEqual` 90.0
      toDegrees (rotation 2) `shouldEqual` 180.0
      toDegrees (rotation 3) `shouldEqual` 270.0
    it "toRadians" do
      toRadians (rotation 0) `shouldEqual` 0.0
      toRadians (rotation 1) `shouldEqual` (pi * 0.5)
      toRadians (rotation 2) `shouldEqual` pi
      toRadians (rotation 3) `shouldEqual` (pi * 1.5)

