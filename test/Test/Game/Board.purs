module Test.Game.Board where

import Prelude

import Control.Monad.State (get, lift)
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
import Effect.Aff (Aff)
import Game.Board (Board(..), BoardT, RelativeEdge, addPiece, buildBoardGraph, emptyBoard, evalBoard, evalBoardM, evalLocation, execBoardM, execBoardT, getPieceInfo, getPortOnEdge, matchingRelativeEdge, relative, removePiece, rotatePieceBy, runBoardT, standardBoard, toAbsoluteEdge, toRelativeEdge)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, Location(..), edge, location, rotation)
import Game.Location as Direction
import Game.Piece (Capacity(..), Port(..), getPort, mkPiece, ports)
import Game.Piece.BasicPiece (andPiece, notPiece)
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Board.BoardDelta as BoardDelta
import Test.Game.Board.BoardDeltaStore as BoardDeltaStore
import Test.Game.Location (allDirections, allLocations, n)
import Test.QuickCheck (assertEquals)
import Test.Unit (TestSuite, describe, failure, it, success)
import Test.Unit.Assert (equal, shouldEqual)
import Test.Unit.AssertExtra (assertLeft, assertNothing, assertRight, shouldBeBefore, shouldContain)

testBoard = either (show >>> unsafeCrashWith) identity $ 
  flip execBoardM standardBoard do
    addPiece (location 0 1) notPiece
    addPiece (location 2 1) notPiece
    addPiece (location 1 0) notPiece
    rotatePieceBy (location 1 0) (rotation 1)
    addPiece (location 1 1) andPiece

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

runBoardTest :: forall a. Board -> BoardT Aff a -> Aff Unit
runBoardTest board boardT = void $ runBoardT boardT board

tests :: TestSuite
tests = do
  boardTests
  BoardDelta.tests
  BoardDeltaStore.tests

boardTests :: TestSuite
boardTests = do
  describe "emptyBoard" do
    it "can create a board" do
      assertRight $ emptyBoard 3
      assertLeft $ emptyBoard 0
      assertLeft $ emptyBoard 4
      assertRight $ emptyBoard 5
  describe "addPiece" do
    it "can add a piece" do
      assertRight $ flip evalBoardM standardBoard do
        addPiece (location 0 0) andPiece
    it "will fail on adding a piece to the same location" $ do
      assertLeft $ flip evalBoardM standardBoard do
        addPiece (location 0 0) andPiece
        addPiece (location 0 0) andPiece
    it "will recognise a new port created" $ runBoardTest standardBoard do
      addPiece (location 2 1) andPiece
      board <- get
      lift $ getPort board Direction.Right `shouldEqual` Just (Output (Capacity 1))
  describe "removePiece" do
    it "can remove a piece" do
      assertRight $ flip evalBoardM standardBoard do
        addPiece (location 0 0) andPiece
        removePiece (location 0 0)
    it "will fail on removing a piece if the location doesn't contain a piece" do
      assertLeft $ flip evalBoardM standardBoard do
        removePiece (location 0 0)
    it "will recognise a port has been removed" $ runBoardTest standardBoard do
      addPiece (location 2 1) andPiece
      b0 <- get
      lift $ ports b0 `shouldEqual` M.singleton Direction.Right (Output (Capacity 1))
      _ <- removePiece (location 2 1)
      b1 <- get
      lift $ ports b1 `shouldEqual` M.empty
  describe "getPieceInfo" do
    it "" $ runBoardTest testBoard do
      piece10 <- getPieceInfo (location 1 0)
      lift $ piece10.rotation `shouldEqual` rotation 1

      piece11 <- getPieceInfo (location 1 1)
      lift $ piece11.rotation `shouldEqual` rotation 0
  describe "getPortOnEdge" do
    it "should return empty if space is not occupied" $ runBoardTest testBoard do
      _ <- equal Nothing <$> getPortOnEdge (relative (location 0 0) Direction.Up)    
      _ <- equal Nothing <$> getPortOnEdge (relative (location 2 2) Direction.Down)  
      _ <- equal Nothing <$> getPortOnEdge (relative (location 0 2) Direction.Right) 
      pure unit
    --it "should still return empty if space is occupied but no port" $ runBoardTest do
    --  equal Nothing <$> getPortOnEdge (relative (location 0 1) Direction.Up)
    --  equal Nothing <$> getPortOnEdge (relative (location 0 1) Direction.Down)
    it "should return port if space is occupied an port exists" $ runBoardTest testBoard do
      _ <- equal (Just (Input (Capacity 1)))  <$> getPortOnEdge (relative (location 0 1) Direction.Left)
      _ <- equal (Just (Output (Capacity 1))) <$> getPortOnEdge (relative (location 0 1) Direction.Right)
      _ <- equal (Just (Output (Capacity 1))) <$> getPortOnEdge (relative (location 1 0) Direction.Right)
      _ <- equal (Just (Input (Capacity 1)))  <$> getPortOnEdge (relative (location 1 1) Direction.Up)
      pure unit
  describe "toAbsoluteEdge/toRelativeEdge" do
    it "toAbsoluteEdge" $ runBoardTest testBoard do
      _ <- equal (edge (location 0 1) Direction.Right) <$> toAbsoluteEdge (relative (location 0 1) Direction.Right)
      _ <- equal (edge (location 1 0) Direction.Down)  <$> toAbsoluteEdge (relative (location 1 0) Direction.Right)
      pure unit
    it "toRelativeEdge" $ runBoardTest testBoard do
      _ <- equal (relative (location 1 0) Direction.Right) <$> toRelativeEdge (edge (location 1 0) Direction.Down)
      _ <- equal (relative (location 1 1) Direction.Up)    <$> toRelativeEdge (edge (location 1 1) Direction.Up)
      pure unit
    it "moving from absolute edge to relative edge should a round trip" $ runBoardTest testBoard do
      for_ (edge <$> allLocations <*> allDirections) \absEdge -> 
        equal absEdge <$> (toRelativeEdge absEdge >>= toAbsoluteEdge)
  describe "matchingRelativeEdge" do
    it "matches" $ runBoardTest testBoard do
      _ <- equal (relative (location 1 1) Direction.Left) <$>
        matchingRelativeEdge (relative (location 0 1) Direction.Right)
      _ <- equal (relative (location 2 1) Direction.Left) <$>
        matchingRelativeEdge (relative (location 1 1) Direction.Right)
      _ <- equal (relative (location 1 1) Direction.Up) <$>
        matchingRelativeEdge (relative (location 1 0) Direction.Right)
      pure unit
  describe "buildBoardGraph" do
    let boardGraph = buildBoardGraph testBoard
    it "topological sort" do
      let sortedLocations = Array.fromFoldable (G.topologicalSort boardGraph)
      (location 0 1 `shouldBeBefore` location 1 1) sortedLocations
      (location 1 0 `shouldBeBefore` location 1 1) sortedLocations
      (location 1 1 `shouldBeBefore` location 2 1) sortedLocations
      (location 0 1 `shouldBeBefore` location 2 1) sortedLocations
  describe "evalLocation"  do
    it "" $ runBoardTest testBoard do
      let loc = location 1 0
      --let on  = M.singleton (relative (location 1 (-1)) Direction.Down) tt
      --let off = M.singleton (relative (location 1 (-1)) Direction.Down) ff
      --evalLocation testBoard on loc
      --  `shouldEqual` M.union on (M.singleton (relative loc Direction.Right) ff)
      --evalLocation testBoard off loc
      --  `shouldEqual` M.union off (M.singleton (relative loc Direction.Right) tt)
      
          l2 = location 1 1
      
      _ <- equal [ Tuple (relative l2 Direction.Right) ff ] <$>
            M.toUnfoldable <$> (evalLocation (testInputRelEdge l2 ff ff) l2)
      _ <- equal [ Tuple (relative l2 Direction.Right) ff ] <$>
            M.toUnfoldable <$> (evalLocation (testInputRelEdge l2 tt ff) l2)
      _ <- equal [ Tuple (relative l2 Direction.Right) tt ] <$>
            M.toUnfoldable <$> (evalLocation (testInputRelEdge l2 tt tt) l2)
      pure unit 
  describe "evalBoard" do
    it "should eval empty board"  $ runBoardTest standardBoard do
      _ <- equal (M.empty) <$> evalBoard (testInput ff ff)
      pure unit
    it "should eval accurately test board" $ runBoardTest testBoard do
      _ <- equal (M.singleton Direction.Right ff) <$> evalBoard (testInput ff ff)
      _ <- equal (M.singleton Direction.Right ff) <$> evalBoard (testInput tt ff)
      _ <- equal (M.singleton Direction.Right ff) <$> evalBoard (testInput ff tt)
      _ <- equal (M.singleton Direction.Right tt) <$> evalBoard (testInput tt tt)
      pure unit




