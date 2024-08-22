module Test.Game.Board.PathSegment
  ( downToRight
  , leftToDown
  , leftToRight
  , leftToUp
  , spec
  , upToDown
  )
  where

import Prelude

import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Game.Board.PathSegment (PathSegment(..), PathSegmentError(..), SinglePathSegment, combineSegmentWithExtant, dualPath, singlePath, singlePathSegmentFromPiece, toPiece)
import Game.Direction as Direction
import Game.Piece (andPiece, crossPiece, idPiece, rightPiece)
import Game.Rotation (rotation)
import Test.Spec (Spec, describe, describeOnly, focus, it)
import Test.Spec.Assertions (shouldEqual, shouldReturn)
import Web.DOM.Document (doctype)

leftToUp    :: SinglePathSegment
leftToUp    = { from : Direction.Left, to: Direction.Up }
leftToRight :: SinglePathSegment
leftToRight = { from : Direction.Left, to: Direction.Right }
leftToDown  :: SinglePathSegment
leftToDown  = { from : Direction.Left, to: Direction.Down }
upToDown    :: SinglePathSegment
upToDown    = { from : Direction.Up, to: Direction.Down }
downToRight :: SinglePathSegment
downToRight = { from : Direction.Down, to: Direction.Right }

spec :: Spec Unit
spec = do
  describe "Game.Board.PathSegment" do
    let singlePathSegments = [ leftToUp, leftToRight, leftToDown, upToDown, downToRight ]

    describe "singlePath" do
      it "should create these paths" do
        singlePath Direction.Left Direction.Up    `shouldEqual` Right leftToUp
        singlePath Direction.Left Direction.Right `shouldEqual` Right leftToRight
        singlePath Direction.Left Direction.Down  `shouldEqual` Right leftToDown
        singlePath Direction.Up Direction.Down ` shouldEqual` Right upToDown

      it "should fail to create" do
        singlePath Direction.Left Direction.Left ` shouldEqual` Left (InvalidSinglePath { from: Direction.Left, to: Direction.Left})

    focus $ describe "singlePathSegmentFromPiece" do
      pure unit


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
        singlePathSegmentFromPiece { piece: idPiece, rotation: rotation 0 }
          `shouldEqual` Right (leftToRight)
        singlePathSegmentFromPiece { piece: idPiece, rotation: rotation 1} 
          `shouldEqual` Right (upToDown)
        singlePathSegmentFromPiece { piece: rightPiece, rotation: rotation 3} 
          `shouldEqual` Right (downToRight)
      it "should fail to create path segments for non-simplifiable pieces" do
        singlePathSegmentFromPiece { piece: andPiece, rotation: rotation 0 }
          `shouldEqual` Left (NoSimplificationForPiece andPiece)

    focus $ describe "combineSegmentWithExtant" do
      it "should return the " do
        pure unit
      it "dual " do
        combineSegmentWithExtant leftToRight (Just { piece: idPiece, rotation: rotation 1})
          `shouldEqual` pure { piece: crossPiece, rotation: rotation 0 }
