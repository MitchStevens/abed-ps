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
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Board.PathSegment (PathSegment(..), PathSegmentError(..), combine, combineSegmentWithExtant, fromPiece, singlePath, toPiece)
import Game.Direction as Direction
import Game.Piece (andPiece, chickenPiece, cornerCutPiece, crossPiece, idPiece, rightPiece)
import Game.Rotation (rotation)
import Test.Spec (Spec, describe, describeOnly, focus, it)
import Test.Spec.Assertions (shouldEqual, shouldReturn)
import Web.DOM.Document (doctype)

leftToUp    :: PathSegment
leftToUp    = PathSegment $ M.singleton Direction.Left Direction.Up
leftToRight :: PathSegment
leftToRight = PathSegment $ M.singleton Direction.Left Direction.Right
leftToDown  :: PathSegment
leftToDown  = PathSegment $ M.singleton Direction.Left Direction.Down
upToRight    :: PathSegment
upToRight    = PathSegment $ M.singleton Direction.Up Direction.Right
upToDown    :: PathSegment
upToDown    = PathSegment $ M.singleton Direction.Up Direction.Down
rightToLeft :: PathSegment
rightToLeft = PathSegment $ M.singleton Direction.Right Direction.Left
rightToUp :: PathSegment
rightToUp = PathSegment $ M.singleton Direction.Right Direction.Up
downToUp    :: PathSegment
downToUp    = PathSegment $ M.singleton Direction.Down Direction.Up
downToRight :: PathSegment
downToRight = PathSegment $ M.singleton Direction.Down Direction.Right

spec :: Spec Unit
spec = do
  describe "Game.Board.PathSegment" do
    let singlePathSegments = [ leftToUp, leftToRight, leftToDown, upToDown, rightToLeft, downToUp, downToRight ]

    describe "singlePath" do
      it "should create these paths" do
        singlePath Direction.Left Direction.Up    `shouldEqual` Right leftToUp
        singlePath Direction.Left Direction.Right `shouldEqual` Right leftToRight
        singlePath Direction.Left Direction.Down  `shouldEqual` Right leftToDown
        singlePath Direction.Up Direction.Down ` shouldEqual` Right upToDown

      it "should fail to create" do
        singlePath Direction.Left Direction.Left ` shouldEqual` Left (InvalidPathSegment (M.singleton Direction.Left Direction.Left))

    describe "singlePathSegmentFromPiece" do
      it "should create single output wires" do
        fromPiece { piece: idPiece, rotation: rotation 0}
          `shouldEqual` pure leftToRight

    describe "combine" do
      it "should create" do
        combine leftToRight upToDown `shouldEqual`
          Right (PathSegment $ M.fromFoldable [ Tuple Direction.Up Direction.Down, Tuple Direction.Left Direction.Right ])
        combine leftToRight downToUp `shouldEqual`
          Right (PathSegment $ M.fromFoldable [ Tuple Direction.Down Direction.Up, Tuple Direction.Left Direction.Right ])
      it "dual path segments should be commutative" do
        for_ singlePathSegments \seg1 ->
          for_ singlePathSegments \seg2 ->
            combine seg1 seg2 `shouldEqual` combine seg2 seg1

    describe "toPiece" do
      it "should create pieces from single path segments" do
        toPiece leftToRight `shouldEqual`
          { piece: idPiece, rotation: rotation 0 }
        toPiece upToDown `shouldEqual`
          { piece: idPiece, rotation: rotation 1 }
        toPiece downToRight `shouldEqual`
          { piece: rightPiece, rotation: rotation 3}
      describe "dual input pieces" do
        it "crossPiece" do
          map toPiece (combine leftToRight upToDown) `shouldEqual`
            pure { piece: crossPiece, rotation: rotation 0}
          map toPiece (combine leftToRight downToUp) `shouldEqual`
            pure { piece: crossPiece, rotation: rotation 1}
          map toPiece (combine rightToLeft downToUp) `shouldEqual`
            pure { piece: crossPiece, rotation: rotation 0}
          map toPiece (combine rightToLeft upToDown) `shouldEqual`
            pure { piece: crossPiece, rotation: rotation 1}
        it "cornerCut" do
          map toPiece (combine leftToDown upToRight) `shouldEqual`
            pure { piece: cornerCutPiece, rotation: rotation 0}
        it "chickenPiece" do
          map toPiece (combine leftToDown rightToUp) `shouldEqual`
            pure { piece: chickenPiece, rotation: rotation 0}
        it "reverseChickenPiece" do
          pure unit

    describe "fromPiece" do
      it "should create path segments for pieces that are simplifiable" do
        fromPiece { piece: idPiece, rotation: rotation 0 }
          `shouldEqual` Right (leftToRight)
        fromPiece { piece: idPiece, rotation: rotation 1} 
          `shouldEqual` Right (upToDown)
        fromPiece { piece: rightPiece, rotation: rotation 3} 
          `shouldEqual` Right (downToRight)
      it "should fail to create path segments for non-simplifiable pieces" do
        fromPiece { piece: andPiece, rotation: rotation 0 }
          `shouldEqual` Left (NoSimplificationForPiece andPiece)

    describe "combineSegmentWithExtant" do
      it "should return the " do
        combineSegmentWithExtant leftToRight Nothing
          `shouldEqual` pure { piece: idPiece, rotation: rotation 0}
        combineSegmentWithExtant downToRight Nothing
          `shouldEqual` pure { piece: rightPiece, rotation: rotation 3 }
      it "dual " do
        combineSegmentWithExtant leftToRight (Just { piece: idPiece, rotation: rotation 1})
          `shouldEqual` pure { piece: crossPiece, rotation: rotation 0 }
