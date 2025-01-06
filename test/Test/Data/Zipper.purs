module Test.Data.Zipper where

import Prelude

import Control.Extend (duplicate, extend)
import Data.Array as A
import Data.Filterable (filter)
import Data.Foldable (foldl, foldr)
import Data.Foldable (for_)
import Data.List (List(..), (:))
import Data.List as L
import Data.Maybe (Maybe(..))
import Data.Zipper (Zipper(..), moveLeft, moveRight)
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "Data.Zipper" do
  describe "class Foldable" do
    it "foldr" do
      for_ (duplicate (Zipper Nil 0 (1:2:3:4:Nil))) \z ->
        foldr A.cons [] z `shouldEqual` [0, 1, 2, 3, 4]

    it "foldl" do
      for_ (duplicate (Zipper Nil 0 (1:2:3:4:Nil))) \z ->
        foldl A.snoc [] z `shouldEqual` [0, 1, 2, 3, 4]

  describe "movement" do
    it "moveLeft" do
      moveLeft (Zipper Nil 0 Nil) `shouldEqual` Nothing
      moveLeft (Zipper (1:0:Nil) 2 (3:4:Nil)) `shouldEqual`
        (Just $ Zipper (0: Nil) 1 (2:3:4:Nil))
    
    it "moveRight" do
      moveRight (Zipper Nil 0 Nil) `shouldEqual` Nothing
      moveRight (Zipper (1:0:Nil) 2 (3:4:Nil)) `shouldEqual` 
        (Just $ Zipper (2:1:0:Nil) 3 (4:Nil))
    
    it "roundtrip" do
      for_ (duplicate (Zipper Nil 0 (1:2:3:4:Nil))) \z ->
        for_ (Just z >>= moveLeft >>= moveRight) \z' ->
          z `shouldEqual` z'

  it "extend" do
    extend identity (Zipper (1:0:Nil) 2 (3:4:Nil)) `shouldEqual`
      Zipper
        ( Zipper Nil 0 (1:2:3:4:Nil)
        : Zipper (0:Nil) 1 (2:3:4:Nil)
        : Nil
        )
        (Zipper (1:0:Nil) 2 (3:4:Nil))
        ( Zipper (2:1:0:Nil) 3 (4:Nil)
        : Zipper (3:2:1:0:Nil) 4 Nil
        : Nil
        )

    --for_ (duplicate (Zipper Nil 0 (1:2:3:4:Nil))) \z ->

  it "should convert to arrays in the correct order" do
    A.fromFoldable (Zipper Nil 1 Nil) `shouldEqual` [1]
    A.fromFoldable (Zipper Nil 1 (L.singleton 2)) `shouldEqual` [1, 2]
    A.fromFoldable (Zipper (0:Nil) 1 Nil) `shouldEqual` [0, 1]
    A.fromFoldable (Zipper (1:0:Nil) 2 (3:4:Nil)) `shouldEqual` [0, 1, 2, 3, 4]

