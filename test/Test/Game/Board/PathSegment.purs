module Test.Game.Board.PathSegment
  ( spec
  )
  where

import Prelude

import Data.Either (Either(..))
import Data.Foldable (for_)
import Game.Board.PathSegment (PathSegment(..), PathSegmentError(..), dualPath, fromPiece, singlePath, toPiece)
import Game.Direction as Direction
import Game.Piece (crossPiece, idPiece, rightPiece)
import Game.Rotation (rotation)
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (shouldEqual, shouldReturn)


spec :: Spec Unit
spec = do
  describeOnly "Game.Board.PathSegment" do
    let leftToUp    = { from : Direction.Left, to: Direction.Up }
    let leftToRight = { from : Direction.Left, to: Direction.Right }
    let leftToDown  = { from : Direction.Left, to: Direction.Down }
    let upToDown    = { from : Direction.Up, to: Direction.Down }
    let downToRight = { from : Direction.Down, to: Direction.Right }
    let singlePathSegments = [ leftToUp, leftToRight, leftToDown, upToDown, downToRight ]

    describe "singlePath" do
      it "should create these paths" do
        singlePath Direction.Left Direction.Up    `shouldEqual` Right leftToUp
        singlePath Direction.Left Direction.Right `shouldEqual` Right leftToRight
        singlePath Direction.Left Direction.Down  `shouldEqual` Right leftToDown
        singlePath Direction.Up Direction.Down ` shouldEqual` Right upToDown

      it "should fail to create" do
        singlePath Direction.Left Direction.Left ` shouldEqual` Left (InvalidSinglePath { from: Direction.Left, to: Direction.Left})
    describe "dualPath" do
      it "should create" do
        dualPath leftToRight upToDown `shouldEqual`
          Right (DualPath upToDown leftToRight)
      it "dual path segments should be commutative" do
        for_ singlePathSegments \seg1 ->
          for_ singlePathSegments \seg2 ->
            (dualPath seg1 seg2 :: Either PathSegmentError PathSegment) `shouldEqual`
              dualPath seg2 seg1
    describe "toPiece" do
      it "should create pieces from single path segments" do
        toPiece (SinglePath leftToRight) `shouldEqual`
          { piece: idPiece, rotation: rotation 0 }
        toPiece (SinglePath upToDown) `shouldEqual`
          { piece: idPiece, rotation: rotation 1 }
        toPiece (SinglePath downToRight) `shouldEqual`
          { piece: rightPiece, rotation: rotation 3}
      it "should create pieces from dual path segments" do
        toPiece (DualPath leftToRight upToDown) `shouldEqual`
          { piece: crossPiece, rotation: rotation 0}
    describe "fromPiece" do
      it "should create path segments for pieces that are simplifiable" do
        fromPiece { piece: idPiece, rotation: rotation 0 }
          `shouldEqual` Right (SinglePath leftToRight)
