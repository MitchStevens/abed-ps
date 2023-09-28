module Test.Game.Board where

import Prelude

import Data.Array ((..))
import Data.Array as Array
import Data.Either (either, fromRight)
import Data.Enum (enumFromTo)
import Data.Foldable (for_, traverse_)
import Data.Graph as G
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..))
import Debug (trace)
import Game.Board (RelativeEdge, addPiece, buildBoardGraph, emptyBoard, evalBoard, evalLocation, getPieceInfo, getPortOnEdge, matchingRelativeEdge, relative, removePiece, rotatePieceBy, toAbsoluteEdge, toRelativeEdge)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, Location(..), edge, location, rotation)
import Game.Location as Direction
import Game.Piece (Capacity(..), Port(..), getPort, mkPiece, ports)
import Game.Piece.BasicPiece (andPiece, notPiece)
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Location (allDirections, allLocations, n)
import Test.QuickCheck (assertEquals)
import Test.Unit (TestSuite, describe, failure, it, success)
import Test.Unit.Assert (shouldEqual)
import Test.Unit.AssertExtra (assertLeft, assertNothing, assertRight, shouldBeBefore, shouldContain)

not = { name: "Not", piece: mkPiece notPiece}
and = { name: "And", piece: mkPiece andPiece}


testBoard = either (show >>> unsafeCrashWith) identity $ 
  emptyBoard n
    >>= addPiece (location 0 1) notPiece
    >>= addPiece (location 2 1) notPiece
    >>= addPiece (location 1 0) notPiece
    >>= rotatePieceBy (location 1 0) (rotation 1)
    >>= addPiece (location 1 1) andPiece

testInput :: Signal -> Signal -> Map CardinalDirection Signal
testInput x y = M.fromFoldable $
  [ Tuple Direction.Left x
  , Tuple Direction.Up y
  ]

testInputRelEdge :: Location -> Signal -> Signal -> Map RelativeEdge Signal
testInputRelEdge loc x y = M.fromFoldable $
  [ Tuple (relative loc Direction.Left) x
  , Tuple (relative loc Direction.Up) y
  ]

tests :: TestSuite
tests = do
  describe "emptyBoard" do
    it "can create a board" do
      assertRight $ emptyBoard 3
      assertLeft $ emptyBoard 0
      assertLeft $ emptyBoard 4
      assertRight $ emptyBoard 5
  describe "addPiece" do
    it "can add a piece" do
      assertRight $ emptyBoard 3 >>= addPiece (location 0 0) andPiece
    it "will fail on adding a piece to the same location" do
      assertLeft $ emptyBoard 3 
        >>= addPiece (location 0 0) andPiece
        >>= addPiece (location 0 0) andPiece
    it "will recognise a new port created" do
      let b =  emptyBoard 3 >>= addPiece (location 2 1) andPiece
      for_ b \board ->
        getPort board Direction.Right `shouldEqual` Just (Output (Capacity 1))
  describe "removePiece" do
    it "can remove a piece" do
      assertRight $ emptyBoard 3
        >>= addPiece (location 0 0) andPiece
        >>= removePiece (location 0 0)
    it "will fail on removing a piece if the location doesn't contain a piece" do
      assertLeft $ emptyBoard 3
        >>= removePiece (location 0 0)
    it "will recognise a port has been removed" do
      let b0 = emptyBoard 3 >>= addPiece (location 2 1) andPiece
      for_ b0 \board ->
        ports board `shouldEqual` M.singleton Direction.Right (Output (Capacity 1))
      let b1 = b0 >>= removePiece (location 2 1)
      for_ b1 \board ->
        ports board `shouldEqual` M.empty
  describe "getPieceInfo" do
    it "" do
      assertNothing $ getPieceInfo testBoard (location 0 0)
      maybe (failure "") (\p -> p.rotation `shouldEqual` rotation 1) (getPieceInfo testBoard (location 1 0))
      maybe (failure "") (\p -> p.rotation `shouldEqual` rotation 0) (getPieceInfo testBoard (location 1 1))
  describe "getPortOnEdge" do
    it "should return empty if space is not occupied" do
      getPortOnEdge testBoard (relative (location 0 0) Direction.Up) `shouldEqual` Nothing
      getPortOnEdge testBoard (relative (location 2 2) Direction.Down) `shouldEqual` Nothing
      getPortOnEdge testBoard (relative (location 0 2) Direction.Right) `shouldEqual` Nothing
    it "should still return empty if space is occupied but no port" do
      getPortOnEdge testBoard (relative (location 0 1) Direction.Up) `shouldEqual` Nothing
      getPortOnEdge testBoard (relative (location 0 1) Direction.Down) `shouldEqual` Nothing
    it "should return port if space is occupied an port exists" do
      getPortOnEdge testBoard (relative (location 0 1) Direction.Left) `shouldEqual` Just (Input (Capacity 1))
      getPortOnEdge testBoard (relative (location 0 1) Direction.Right) `shouldEqual` Just (Output (Capacity 1))
      getPortOnEdge testBoard (relative (location 1 0) Direction.Right) `shouldEqual` Just (Output (Capacity 1))
      getPortOnEdge testBoard (relative (location 1 1) Direction.Up) `shouldEqual` Just (Input (Capacity 1))
  describe "toAbsoluteEdge/toRelativeEdge" do
    it "toAbsoluteEdge" do
      toAbsoluteEdge testBoard (relative (location 0 1) Direction.Right) `shouldEqual` edge (location 0 1) Direction.Right
      toAbsoluteEdge testBoard (relative (location 1 0) Direction.Right) `shouldEqual` edge (location 1 0) Direction.Down
    it "toRelativeEdge" do
      let loc = location 1 0
      toRelativeEdge testBoard (edge loc Direction.Down) `shouldEqual` relative loc Direction.Right
      toRelativeEdge testBoard (edge (location 1 1) Direction.Up) `shouldEqual` relative (location 1 1) Direction.Up
    it "moving from absolute edge to relative edge should a round trip" do
      for_ (edge <$> allLocations <*> allDirections) \absEdge -> 
        toAbsoluteEdge testBoard (toRelativeEdge testBoard absEdge) `shouldEqual` absEdge
  describe "matchingRelativeEdge" do
    it "matches" do
      matchingRelativeEdge testBoard (relative (location 0 1) Direction.Right)
        `shouldEqual` (relative (location 1 1) Direction.Left)
      matchingRelativeEdge testBoard (relative (location 1 1) Direction.Right)
        `shouldEqual` (relative (location 2 1) Direction.Left)
      matchingRelativeEdge testBoard (relative (location 1 0) Direction.Right)
        `shouldEqual` (relative (location 1 1) Direction.Up)
  describe "buildBoardGraph" do
    let boardGraph = buildBoardGraph testBoard
    it "topological sort" do
      let sortedLocations = Array.fromFoldable (G.topologicalSort boardGraph)
      (location 0 1 `shouldBeBefore` location 1 1) sortedLocations
      (location 1 0 `shouldBeBefore` location 1 1) sortedLocations
      (location 1 1 `shouldBeBefore` location 2 1) sortedLocations
      (location 0 1 `shouldBeBefore` location 2 1) sortedLocations
  describe "evalLocation" do
    it "" do
      let loc = location 1 0
      --let on  = M.singleton (relative (location 1 (-1)) Direction.Down) tt
      --let off = M.singleton (relative (location 1 (-1)) Direction.Down) ff
      --evalLocation testBoard on loc
      --  `shouldEqual` M.union on (M.singleton (relative loc Direction.Right) ff)
      --evalLocation testBoard off loc
      --  `shouldEqual` M.union off (M.singleton (relative loc Direction.Right) tt)
      
          l2 = location 1 1
      
      (M.toUnfoldable (evalLocation testBoard (testInputRelEdge l2 ff ff) l2) :: Array (Tuple RelativeEdge Signal))
        `shouldContain` (Tuple (relative l2 Direction.Right) ff)
      (M.toUnfoldable (evalLocation testBoard (testInputRelEdge l2 tt ff) l2) :: Array (Tuple RelativeEdge Signal))
        `shouldContain` (Tuple (relative l2 Direction.Right) ff)
      (M.toUnfoldable (evalLocation testBoard (testInputRelEdge l2 tt tt) l2) :: Array (Tuple RelativeEdge Signal))
        `shouldContain` (Tuple (relative l2 Direction.Right) tt)


  describe "evalBoard" do
    it "eval accurately test board" do
      evalBoard testBoard (testInput ff ff) `shouldEqual` M.singleton Direction.Right ff
      evalBoard testBoard (testInput tt ff) `shouldEqual` M.singleton Direction.Right tt
      evalBoard testBoard (testInput ff tt) `shouldEqual` M.singleton Direction.Right tt
      evalBoard testBoard (testInput tt tt) `shouldEqual` M.singleton Direction.Right tt
      pure unit




