module Test.Game.Piece.BasicPiece where

import Prelude

import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece (Capacity(..), andPiece, eval, getPorts, notPiece, orPiece, xorPiece)
import Game.Piece as Port
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)

spec :: Spec Unit
spec = do
  describe "Basic Piece" do
    let f x y = M.fromFoldable [ Tuple Direction.Left x, Tuple Direction.Up y ]
    let inputPort = Port.Input OneBit
    let outputPort = Port.Output OneBit
    describe "NotPiece" do
      it "eval" do
        eval notPiece (f ff ff) `shouldEqual` M.singleton Direction.Right tt
        eval notPiece (f tt ff) `shouldEqual` M.singleton Direction.Right ff
        eval notPiece (f tt tt) `shouldEqual` M.singleton Direction.Right ff
      it "ports" do
        getPorts notPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inputPort
          , Tuple Direction.Right outputPort
          ]
    describe "OrPiece" do
      it "eval" do
        eval orPiece (f ff ff) `shouldEqual` M.singleton Direction.Right ff
        eval orPiece (f tt ff) `shouldEqual` M.singleton Direction.Right tt
        eval orPiece (f tt tt) `shouldEqual` M.singleton Direction.Right tt
      it "ports" do
        getPorts orPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inputPort
          , Tuple Direction.Up inputPort
          , Tuple Direction.Right outputPort
          ]
    describe "andPiece" do
      it "eval" do
        eval andPiece (f ff ff) `shouldEqual` M.singleton Direction.Right ff
        eval andPiece (f tt ff) `shouldEqual` M.singleton Direction.Right ff
        eval andPiece (f tt tt) `shouldEqual` M.singleton Direction.Right tt
      it "ports" do
        getPorts andPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inputPort
          , Tuple Direction.Up inputPort
          , Tuple Direction.Right outputPort
          ]
    describe "xorPiece" do
      it "eval" do
        eval xorPiece (f ff ff) `shouldEqual` M.singleton Direction.Right ff
        eval xorPiece (f tt ff) `shouldEqual` M.singleton Direction.Right tt
        eval xorPiece (f ff tt) `shouldEqual` M.singleton Direction.Right tt
        eval xorPiece (f tt tt) `shouldEqual` M.singleton Direction.Right ff
      it "ports" do
        getPorts xorPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inputPort
          , Tuple Direction.Up inputPort
          , Tuple Direction.Right outputPort
          ]

