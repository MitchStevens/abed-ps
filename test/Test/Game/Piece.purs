module Test.Game.Piece where

import Prelude

import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Expression (raw)
import Game.Piece (Capacity(..), PortType(..), andPiece, eval, getPorts, inputPort, isInput, notPiece, orPiece, outputPort, portMatches, xorPiece)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (shouldEqual)

tests :: TestSuite
tests = do
  let portIn = inputPort OneBit
  let portOut = outputPort OneBit
  let bigInput = inputPort EightBit
  describe "Capacity" do
    it "" $ pure unit
  describe "Port" do
    it "isInput" do
      isInput portIn `shouldEqual` true
      isInput portOut `shouldEqual` false
    describe "portMatches" do
      it "basic" do
        (portIn `portMatches` portOut) `shouldEqual` true
        (portOut `portMatches` portIn) `shouldEqual` true
        (portIn `portMatches` portIn) `shouldEqual` false
        (portOut `portMatches` portOut) `shouldEqual` false
      it "bigInput" do
        (bigInput `portMatches` portOut) `shouldEqual` false
        (bigInput `portMatches` portIn) `shouldEqual` false
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
          getPorts notPiece `shouldEqual` M.fromFoldable
            [ Tuple Direction.Left portIn
            , Tuple Direction.Right portOut
            ]
        it "OrPiece" do
          getPorts orPiece `shouldEqual` M.fromFoldable
            [ Tuple Direction.Left portIn
            , Tuple Direction.Up portIn
            , Tuple Direction.Right portOut
            ]
        it "andPiece" do
          getPorts andPiece `shouldEqual` M.fromFoldable
            [ Tuple Direction.Left portIn
            , Tuple Direction.Up portIn
            , Tuple Direction.Right portOut
            ]

