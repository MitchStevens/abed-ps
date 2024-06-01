module Test.Game.Board.BoardConnections where

import Prelude

import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Board (RelativeEdge, relative)
import Game.Board.BoardConnections (BoardConnections)
import Game.Board.BoardConnections as BoardConnections
import Game.Board.EvaluableBoard (getConnections)
import Game.Piece.Direction as Direction
import Game.Location (location)
import Test.Game.Board (testBoard)
import Test.Game.Board.EvaluableBoard (testEvaluableBoard)
import Test.Spec (Spec, describe, describeOnly, it, itOnly)
import Test.Spec.Assertions (shouldEqual)

r1 :: RelativeEdge
r1 = relative (location 0 0) Direction.Right

r2 :: RelativeEdge
r2 = relative (location 1 0) Direction.Left

r3 :: RelativeEdge
r3 = relative (location 1 0) Direction.Right

r4 :: RelativeEdge
r4 = relative (location 2 0) Direction.Left

testBoardConnections :: BoardConnections
testBoardConnections = getConnections testEvaluableBoard

additionalConnections :: BoardConnections
additionalConnections = M.fromFoldable
  [ Tuple (relative u Direction.Right) (relative u Direction.Left)
  , Tuple (relative l Direction.Right) (relative l Direction.Left)
  , Tuple (relative r Direction.Right) (relative r Direction.Left)
  ]
  where
    u = location 1 0
    l = location 0 1
    r = location 2 1

spec :: Spec Unit
spec =
  describe "BoardConnections" do
    describe "allLocations" do
      it "should return empty set for a non-connected map" do
        BoardConnections.allLocations M.empty `shouldEqual` S.empty
      it "should return both the initial and terminal locations" do
        BoardConnections.allLocations (M.singleton r2 r1) `shouldEqual` S.fromFoldable [ location 0 0, location 1 0 ]
      it "should have ..." do
        BoardConnections.allLocations testBoardConnections `shouldEqual`
          S.fromFoldable
            [ location (-1) 1
            , location 0    1
            , location 1    (-1)
            , location 1    0
            , location 1    1
            , location 2    1
            , location 3    1
            ]
    describe "initialVertices" do
      it "n=0 case" do
        BoardConnections.initialVertices (M.empty :: Map Int Int) `shouldEqual` S.empty
      it "n=1 case" do
        BoardConnections.initialVertices (M.singleton 1 2) `shouldEqual` S.singleton 1
      it "n=2 case" do
        BoardConnections.initialVertices (M.fromFoldable [Tuple r2 r1, Tuple r3 r2]) `shouldEqual` S.singleton r3
      it "n=2 case reversed" do
        BoardConnections.initialVertices (M.fromFoldable [Tuple r1 r2, Tuple r2 r3]) `shouldEqual` S.singleton r1
      it "n=3 case" do
        BoardConnections.initialVertices (M.fromFoldable [ Tuple 1 2, Tuple 3 4, Tuple 2 3])
          `shouldEqual` S.singleton 1
      it "n=3 case reversed" do
        BoardConnections.initialVertices (M.fromFoldable [Tuple r4 r3, Tuple r2 r1, Tuple r3 r2]) `shouldEqual` S.singleton r4
      --it "not reducible" do
      --  BoardConnections.initialVertices testBoardConnections `shouldEqual` testBoardConnections
      it "with simplifications" do
        BoardConnections.initialVertices (M.union testBoardConnections additionalConnections) `shouldEqual`
          S.fromFoldable
            [ (relative (location 3 1) Direction.Right) 
            , (relative (location 1 1) Direction.Left) 
            , (relative (location 1 1) Direction.Up)   
            ]
    describe "edgeContraction" do
      it "n=0 case" do
        BoardConnections.edgeContraction (M.empty :: Map Int Int) `shouldEqual` M.empty
      it "n=1 case" do
        BoardConnections.edgeContraction (M.singleton 1 2) `shouldEqual` M.singleton 1 2
      it "n=2 case" do
        BoardConnections.edgeContraction (M.fromFoldable [Tuple r2 r1, Tuple r3 r2]) `shouldEqual` M.singleton r3 r1
      it "n=2 case reversed" do
        BoardConnections.edgeContraction (M.fromFoldable [Tuple r1 r2, Tuple r2 r3]) `shouldEqual` M.singleton r1 r3
      it "n=3 case" do
        BoardConnections.edgeContraction (M.fromFoldable [ Tuple 1 2, Tuple 3 4, Tuple 2 3])
          `shouldEqual` (M.singleton 1 4)
      it "n=3 case reversed" do
        BoardConnections.edgeContraction (M.fromFoldable [Tuple r4 r3, Tuple r2 r1, Tuple r3 r2]) `shouldEqual` M.singleton r4 r1
      it "not reducible" do
        BoardConnections.edgeContraction testBoardConnections `shouldEqual` testBoardConnections
      it "with simplifications" do
        BoardConnections.edgeContraction (M.union testBoardConnections additionalConnections) `shouldEqual`
          M.fromFoldable
            [ Tuple (relative (location 3 1) Direction.Right) (relative (location 1 1) Direction.Right)
            , Tuple (relative (location 1 1) Direction.Left) (relative (location (-1) 1) Direction.Right)
            , Tuple (relative (location 1 1) Direction.Up) (relative (location 1 (-1)) Direction.Right)
            ]

--  (fromFoldable 
--    [(Tuple (RelEdge (1,0) Right) (RelEdge (0,0) Right))
--    ,(Tuple (RelEdge (2,0) Left) (RelEdge (1,0) Left))
--    ]) ≠ 
--    (fromFoldable [(Tuple (RelEdge (2,0) Left) (RelEdge (0,0) Right))])

