module Test.Game.Board where

import Prelude

import Control.Monad.State (class MonadState, State, evalState, get, lift)
import Data.Array ((..))
import Data.Array as Array
import Data.Either (Either(..), either, fromRight)
import Data.Enum (enumFromTo)
import Data.Foldable (for_, length, traverse_)
import Data.Graph as G
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..))
import Debug (trace)
import Effect.Aff (Aff)
import Effect.Class.Console (log)
import Game.Board (Board(..), RelativeEdge, allPortsOnBoard, buildBoardGraph, buildConnectionMap, evalBoardScratch, evalBoardWithPortInfo, evalLocation, extractOutputs, getPortOnEdge, matchingRelativeEdge, relative, standardBoard, toAbsoluteEdge, toRelativeEdge)
import Game.Board.Operation (BoardError(..), BoardT, addPiece, decreaseSize, emptyBoard, evalBoardM, execBoardM, getPieceInfo, increaseSize, removePiece, rotatePieceBy, runBoardT, validBoardSize)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, Location(..), edge, location, rotation)
import Game.Location as Direction
import Game.Piece (getPort, ports)
import Game.Piece.BasicPiece (andPiece, idPiece, notPiece)
import Game.Piece.Port (Capacity(..), Port(..))
import Game.Piece.Port as Port
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Location (allDirections, allLocations, n)
import Test.QuickCheck (assertEquals)
import Test.Unit (TestSuite, describe, failure, it, success)
import Test.Unit.Assert (expectFailure)
import Test.Unit.AssertExtra (assertLeft, assertNothing, assertRight, equal, notEqual, shouldBeBefore, shouldContain, shouldEqual)

testBoard :: Board
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
runBoardTest board boardT = do 
  test <- runBoardT boardT board
  case test of
    Left boardError -> failure (show boardError)
    Right (Tuple a board) -> success

tests :: TestSuite
tests = do
  describe "meta" do
    it "runBoardTest" do
      runBoardTest standardBoard (addPiece (location 0 0) notPiece)
      expectFailure "" $ runBoardTest standardBoard (removePiece (location 0 0))

  let evalBoard inputs = evalBoardScratch inputs >>= extractOutputs
  describe "emptyBoard" do
    it "can create a board" do
      assertRight $ emptyBoard 3
      assertLeft $ emptyBoard 0
      assertLeft $ emptyBoard 4
      assertRight $ emptyBoard 5
  describe "getPortEdges" do
    it "empty" $ runBoardTest standardBoard do
      pure unit -- do this later

  describe "addPiece" do
    it "can add a piece" do
      assertRight $ flip evalBoardM standardBoard do
        addPiece (location 0 0) andPiece
    it "will fail on adding a piece to the same location" $ do
      assertLeft $ flip evalBoardM standardBoard do
        addPiece (location 0 0) andPiece
        addPiece (location 0 0) andPiece
    it "will recognise a new port created" $ runBoardTest standardBoard do
      b0 <- get
      getPort b0 Direction.Right `shouldEqual` Nothing

      addPiece (location 2 1) andPiece
      b1 <- get
      getPort b1 Direction.Right `shouldEqual` Just (Output (Capacity 1))
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
  describe "allPortsOnBoard" do
    it "should return empty for an empty board" $ runBoardTest standardBoard do
      p0 <- allPortsOnBoard
      length p0 `shouldEqual` 0

      addPiece (location 1 1) notPiece
      p1 <- allPortsOnBoard
      length p1 `shouldEqual` 2

      addPiece (location 2 1) idPiece
      p1 <- allPortsOnBoard
      length p1 `shouldEqual` 4

    it "testBoard" $ runBoardTest testBoard do
      --let portsOnBoard = M.fromFoldable []
      allPorts <- allPortsOnBoard
      length allPorts `shouldEqual` 9

      --equal portsOnBoard =<< allPortsOnBoard
  describe "getPortOnEdge" do
    it "should return empty if space is not occupied" $ runBoardTest testBoard do
      equal Nothing =<< getPortOnEdge (relative (location 0 0) Direction.Up)    
      equal Nothing =<< getPortOnEdge (relative (location 2 2) Direction.Down)  
      equal Nothing =<< getPortOnEdge (relative (location 0 2) Direction.Right) 
    --it "should still return empty if space is occupied but no port" $ runBoardTest do
    --  equal Nothing <$> getPortOnEdge (relative (location 0 1) Direction.Up)
    --  equal Nothing <$> getPortOnEdge (relative (location 0 1) Direction.Down)
    it "should return port if space is occupied an port exists" $ runBoardTest testBoard do
      equal (Just (Input (Capacity 1)))  =<< getPortOnEdge (relative (location 0 1) Direction.Left)
      equal (Just (Output (Capacity 1))) =<< getPortOnEdge (relative (location 0 1) Direction.Right)
      equal (Just (Output (Capacity 1))) =<< getPortOnEdge (relative (location 1 0) Direction.Right)
      equal (Just (Input (Capacity 1)))  =<< getPortOnEdge (relative (location 1 1) Direction.Up)
  describe "toAbsoluteEdge/toRelativeEdge" do
    it "toAbsoluteEdge" $ runBoardTest testBoard do
      equal (edge (location 0 1) Direction.Right) =<< toAbsoluteEdge (relative (location 0 1) Direction.Right)
      equal (edge (location 1 0) Direction.Down)  =<< toAbsoluteEdge (relative (location 1 0) Direction.Right)
      pure unit
    it "toRelativeEdge" $ runBoardTest testBoard do
      equal (relative (location 1 0) Direction.Right) =<< toRelativeEdge (edge (location 1 0) Direction.Down)
      equal (relative (location 1 1) Direction.Up)    =<< toRelativeEdge (edge (location 1 1) Direction.Up)
    it "moving from absolute edge to relative edge should a round trip" $ runBoardTest testBoard do
      for_ (edge <$> allLocations <*> allDirections) \absEdge -> 
        equal absEdge =<< (toRelativeEdge absEdge >>= toAbsoluteEdge)
  describe "matchingRelativeEdge" do
    it "matches" $ runBoardTest testBoard do
      equal (relative (location 1 1) Direction.Left) =<<
        matchingRelativeEdge (relative (location 0 1) Direction.Right)
      equal (relative (location 2 1) Direction.Left) =<<
        matchingRelativeEdge (relative (location 1 1) Direction.Right)
      equal (relative (location 1 1) Direction.Up) =<<
        matchingRelativeEdge (relative (location 1 0) Direction.Right)
  describe "board size change" do
    it "validBoardSize" do
      validBoardSize 3 `shouldEqual` Right 3
      validBoardSize 5 `shouldEqual` Right 5
      validBoardSize 2 `shouldEqual` Left (BadBoardSize 2)
      validBoardSize 4 `shouldEqual` Left (BadBoardSize 4)
      validBoardSize 11 `shouldEqual` Left (BadBoardSize 11)
    it "should allow board size increment and decrement" $ runBoardTest testBoard do
      increaseSize
      decreaseSize
  describe "buildBoardGraph" do
    let boardGraph = evalState buildBoardGraph testBoard
    it "topological sort" do
      let sortedLocations = Array.fromFoldable (G.topologicalSort boardGraph)
      (location 0 1 `shouldBeBefore` location 1 1) sortedLocations
      (location 1 0 `shouldBeBefore` location 1 1) sortedLocations
      (location 1 1 `shouldBeBefore` location 2 1) sortedLocations
      (location 0 1 `shouldBeBefore` location 2 1) sortedLocations
  describe "evalLocation"  do
    it "empty" $ runBoardTest standardBoard do
      v <- evalLocation M.empty (location 0 0)
      v `shouldEqual` M.empty
    it "single piece" $ runBoardTest standardBoard do
      addPiece (location 1 1) notPiece
      v <- evalLocation M.empty (location 1 1)
      (M.toUnfoldable v :: Array _) `shouldContain`
        Tuple (relative (location 1 1) Direction.Right) tt
    it "single piece with rotation" $ runBoardTest standardBoard do
      let loc = location 1 1
      addPiece loc notPiece
      rotatePieceBy loc (rotation 1)
      out0 :: Array _ <- M.toUnfoldable <$> evalLocation M.empty loc
      out0 `shouldContain` (Tuple (relative loc Direction.Right) tt)

      out1 :: Array _ <- M.toUnfoldable <$> evalLocation (M.singleton (relative loc Direction.Left) tt) loc
      out1 `shouldContain` (Tuple (relative loc Direction.Right) ff)
    it "testBoard" $ runBoardTest testBoard do
      let loc = location 1 1
      out0 :: Array _ <- M.toUnfoldable <$> (evalLocation (testInputRelEdge loc ff ff) loc)
      out1 :: Array _ <- M.toUnfoldable <$> (evalLocation (testInputRelEdge loc tt ff) loc)
      out2 :: Array _ <- M.toUnfoldable <$> (evalLocation (testInputRelEdge loc tt tt) loc)
      shouldContain out0 (Tuple (relative loc Direction.Right) ff)
      shouldContain out1 (Tuple (relative loc Direction.Right) ff)
      shouldContain out2 (Tuple (relative loc Direction.Right) tt)
  describe "buildConnectionMap" do
    it "" $ runBoardTest standardBoard do
      c0 <- buildConnectionMap <$> get
      length c0 `shouldEqual` 0

      addPiece (location 1 0) notPiece
      c1 <- buildConnectionMap <$> get
      length c1 `shouldEqual` 0
    it "with test board" $ runBoardTest testBoard do
      c <- buildConnectionMap <$> get
      length c `shouldEqual` 6



  describe "evalBoard" do
    it "should eval empty board"  $ runBoardTest standardBoard do
       equal (M.empty) =<< evalBoard (testInput ff ff)
    it "scratch" $ runBoardTest testBoard do
      signals :: Array _ <- M.toUnfoldable <$> evalBoardScratch (testInput tt ff)
      signals `shouldContain` (Tuple (relative (location 1 1) Direction.Up) tt)
      signals `shouldContain` (Tuple (relative (location 1 1) Direction.Right) ff)
      signals `shouldContain` (Tuple (relative (location 1 1) Direction.Left) ff)
    it "should eval accurately test board" $ runBoardTest testBoard do
      out0 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput ff ff)
      out1 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput tt ff)
      out2 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput ff tt)
      out3 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput tt tt)

      shouldContain out0 (Tuple Direction.Right ff)
      shouldContain out1 (Tuple Direction.Right tt)
      shouldContain out2 (Tuple Direction.Right tt)
      shouldContain out3 (Tuple Direction.Right tt)
  describe "evalBoardWithPortInfo" do
    it "empty" $ runBoardTest standardBoard do 
      b0 <- evalBoardWithPortInfo M.empty
      b0 `shouldEqual` M.empty

      addPiece (location 1 1) notPiece
      connections <- buildConnectionMap <$> get
      length connections `shouldEqual` 0
      signals :: Array _ <- M.toUnfoldable <$> evalBoardScratch M.empty
      signals `shouldContain`
        Tuple (relative (location 1 1) Direction.Right) tt

      ports <- allPortsOnBoard
      length ports `shouldEqual` 2
    
    it "with rotation" $ runBoardTest standardBoard do 
      let loc = location 1 0
      addPiece loc notPiece
      rotatePieceBy loc (rotation 1)

      connections <- buildConnectionMap <$> get
      length connections `shouldEqual` 1
      signals :: Array _ <- M.toUnfoldable <$> evalBoardScratch M.empty
      signals `shouldContain`
        Tuple (relative loc Direction.Right) tt
      ports :: Array _ <- M.toUnfoldable <$> allPortsOnBoard
      length ports `shouldEqual` 2
      ports `shouldContain` Tuple (relative loc Direction.Right) (Port.Output (Capacity 1))
