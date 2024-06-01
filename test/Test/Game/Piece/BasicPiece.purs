module Test.Game.Piece.BasicPiece where

import Prelude

import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction as Direction
import Game.Piece (andPiece, eval, getPort, getPorts, notPiece, orPiece, shouldRipple, updateCapacity, xorPiece)
import Game.Piece as Port
import Game.Piece.Port (inputPort, outputPort)
import Game.Piece.Signal (Signal(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual, shouldNotEqual)

spec :: Spec Unit
spec = do
  describe "Test.Game.Piece.BasicPiece" do
    let f x y = M.fromFoldable [ Tuple Direction.Left x, Tuple Direction.Up y ]
    let inPort = inputPort OneBit
    let outPort = outputPort OneBit
    describe "NotPiece" do
      it "eval" do
        eval notPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 1)
        eval notPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        eval notPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 0)
      it "ports" do
        getPorts notPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Right outPort
          ]
      it "ripple" do
        shouldRipple notPiece `shouldEqual` true
        let notPiece' = updateCapacity Direction.Up TwoBit notPiece 
        notPiece' `shouldEqual` Nothing
        case updateCapacity Direction.Left TwoBit notPiece of
          Just notPiece2 -> do
            getPort notPiece2 Direction.Left `shouldEqual` Just (inputPort TwoBit)
            getPort notPiece2 Direction.Right `shouldEqual` Just (outputPort TwoBit)
          Nothing -> fail ""
    describe "OrPiece" do
      it "eval" do
        eval orPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        eval orPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 1)
        eval orPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 1)
      it "ports" do
        getPorts orPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]
    describe "andPiece" do
      it "eval" do
        eval andPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        eval andPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        eval andPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 1)
      it "ports" do
        getPorts andPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]
    describe "xorPiece" do
      it "eval" do
        eval xorPiece (f ff ff) `shouldEqual` M.singleton Direction.Right (Signal 0)
        eval xorPiece (f tt ff) `shouldEqual` M.singleton Direction.Right (Signal 1)
        eval xorPiece (f ff tt) `shouldEqual` M.singleton Direction.Right (Signal 1)
        eval xorPiece (f tt tt) `shouldEqual` M.singleton Direction.Right (Signal 0)
      it "ports" do
        getPorts xorPiece `shouldEqual` M.fromFoldable
          [ Tuple Direction.Left inPort
          , Tuple Direction.Up inPort
          , Tuple Direction.Right outPort
          ]

