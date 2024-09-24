module Test.Game.Piece.BasicPiece where

import Prelude

import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Piece (andPiece, getPorts, notPiece, orPiece, xorPiece)
import Game.Piece as Port
import Game.Port (inputPort, outputPort)
import Game.Signal (Signal(..))
import Test.Game.Piece (testEval)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)

spec :: Spec Unit
spec = do
  describe "Game.Piece.BasicPiece" do
    let f x y = M.fromFoldable [ Tuple Direction.Left x, Tuple Direction.Up y ]
    let inPort = inputPort OneBit
    let outPort = outputPort OneBit
    describe "NotPiece" do
      it "eval" do
        testEval notPiece (f ff ff) (M.singleton Direction.Right one)
        testEval notPiece (f tt ff) (M.singleton Direction.Right zero)
        testEval notPiece (f tt tt) (M.singleton Direction.Right zero)
      it "ports" do
        getPorts notPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Right outPort
          ]
    describe "OrPiece" do
      it "eval" do
        testEval orPiece (f ff ff) (M.singleton Direction.Right zero)
        testEval orPiece (f tt ff) (M.singleton Direction.Right one)
        testEval orPiece (f tt tt) (M.singleton Direction.Right one)
      it "ports" do
        getPorts orPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]
    describe "andPiece" do
      it "eval" do
        testEval andPiece (f ff ff) (M.singleton Direction.Right zero)
        testEval andPiece (f tt ff) (M.singleton Direction.Right zero)
        testEval andPiece (f tt tt) (M.singleton Direction.Right one)
      it "ports" do
        getPorts andPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]
    describe "xorPiece" do
      it "eval" do
        testEval xorPiece (f ff ff) (M.singleton Direction.Right zero)
        testEval xorPiece (f tt ff) (M.singleton Direction.Right one)
        testEval xorPiece (f ff tt) (M.singleton Direction.Right one)
        testEval xorPiece (f tt tt) (M.singleton Direction.Right zero)
      it "ports" do
        getPorts xorPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]