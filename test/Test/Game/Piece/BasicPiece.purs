module Test.Game.Piece.BasicPiece where

import Prelude

import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Piece (andPiece, evaluatePiece, getPorts, notPiece, orPiece, xorPiece)
import Game.Piece as Port
import Game.Port (inputPort, outputPort)
import Game.Signal (Signal(..))
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
        evaluatePiece notPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 1)
        evaluatePiece notPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        evaluatePiece notPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 0)
      it "ports" do
        getPorts notPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Right outPort
          ]
    describe "OrPiece" do
      it "eval" do
        evaluatePiece orPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        evaluatePiece orPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 1)
        evaluatePiece orPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 1)
      it "ports" do
        getPorts orPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]
    describe "andPiece" do
      it "eval" do
        evaluatePiece andPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        evaluatePiece andPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        evaluatePiece andPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 1)
      it "ports" do
        getPorts andPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]
    describe "xorPiece" do
      it "eval" do
        evaluatePiece xorPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        evaluatePiece xorPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 1)
        evaluatePiece xorPiece (f ff tt) `shouldEqual` M.singleton Direction.Right (Signal 1)
        evaluatePiece xorPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 0)
      it "ports" do
        getPorts xorPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]