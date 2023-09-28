module Test.Game.Piece where

import Prelude

import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Expression (raw)
import Game.Location as Direction
import Game.Piece (Capacity(..), Port(..), eval, isInput, portMatches, ports)
import Game.Piece.BasicPiece (andPiece, notPiece, orPiece, xorPiece)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (shouldEqual)

tests :: TestSuite
tests = do
  let inputPort = Input (Capacity 1)
  let outputPort = Output (Capacity 1)
  let bigInput = Input (Capacity 10)
  describe "Capacity" do
    it "" $ pure unit
  describe "Port" do
    it "isInput" do
      isInput inputPort `shouldEqual` true
      isInput outputPort `shouldEqual` false
    describe "portMatches" do
      it "basic" do
        (inputPort `portMatches` outputPort) `shouldEqual` true
        (outputPort `portMatches` inputPort) `shouldEqual` true
        (inputPort `portMatches` inputPort) `shouldEqual` false
        (outputPort `portMatches` outputPort) `shouldEqual` false
      it "bigInput" do
        (bigInput `portMatches` outputPort) `shouldEqual` false
        (bigInput `portMatches` inputPort) `shouldEqual` false
  describe "Piece" do
    describe "Basic Piece"  do 
      let f x y = M.fromFoldable [ Tuple Direction.Left x, Tuple Direction.Up y ]
      describe "eval" do
        it "NotPiece" do
          eval notPiece (f ff ff) `shouldEqual` M.singleton Direction.Right tt
          eval notPiece (f tt ff) `shouldEqual` M.singleton Direction.Right ff
          eval notPiece (f tt tt) `shouldEqual` M.singleton Direction.Right ff
        it "OrPiece" do
          eval orPiece (f ff ff) `shouldEqual` M.singleton Direction.Right ff
          eval orPiece (f tt ff) `shouldEqual` M.singleton Direction.Right tt
          eval orPiece (f tt tt) `shouldEqual` M.singleton Direction.Right tt
        it "andPiece" do
          eval andPiece (f ff ff) `shouldEqual` M.singleton Direction.Right ff
          eval andPiece (f tt ff) `shouldEqual` M.singleton Direction.Right ff
          eval andPiece (f tt tt) `shouldEqual` M.singleton Direction.Right tt
        it "xorPiece" do
          eval xorPiece (f ff ff) `shouldEqual` M.singleton Direction.Right ff
          eval xorPiece (f tt ff) `shouldEqual` M.singleton Direction.Right tt
          eval xorPiece (f ff tt) `shouldEqual` M.singleton Direction.Right tt
          eval xorPiece (f tt tt) `shouldEqual` M.singleton Direction.Right ff
      describe "ports" do
        it "NotPiece" do
          ports notPiece `shouldEqual` M.fromFoldable
            [ Tuple Direction.Left inputPort
            , Tuple Direction.Right outputPort
            ]
        it "OrPiece" do
          ports orPiece `shouldEqual` M.fromFoldable
            [ Tuple Direction.Left inputPort
            , Tuple Direction.Up inputPort
            , Tuple Direction.Right outputPort
            ]
        it "andPiece" do
          ports andPiece `shouldEqual` M.fromFoldable
            [ Tuple Direction.Left inputPort
            , Tuple Direction.Up inputPort
            , Tuple Direction.Right outputPort
            ]


