module Test.Game.Board where

import Prelude

import Control.Monad.Error.Class (class MonadError, throwError)
import Control.Monad.Except (ExceptT, runExcept, runExceptT)
import Control.Monad.State (class MonadState, State, StateT, evalState, evalStateT, get, lift, put)
import Data.Array ((..))
import Data.Array as Array
import Data.Either (Either(..), either, fromRight)
import Data.Enum (enumFromTo)
import Data.Foldable (for_, length, traverse_)
import Data.HeytingAlgebra (ff, tt)
import Data.Identity (Identity)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..))
import Debug (trace)
import Effect.Aff (Aff, Error, error)
import Effect.Aff.Class (class MonadAff)
import Effect.Class.Console (log)
import Game.Board (Board(..), RelativeEdge, absolute, addPath, addPiece, adjacentRelativeEdge, execBoardM, getBoardPortEdge, getPortOnEdge, increaseSize, relative, rotatePieceBy, standardBoard, toAbsoluteEdge, toRelativeEdge)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.Location (Location(..), location)
import Game.Piece (andPiece, notPiece, xorPiece)
import Game.Piece as Port
import Game.Port (inputPort, outputPort)
import Game.Rotation (rotation)
import Game.Signal (Signal(..))
import Halogen.HTML (object)
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Location (allLocations)
import Test.Spec (Spec, SpecT, before, describe, hoistSpec, it, itOnly)
import Test.Spec.Assertions (fail, shouldContain, shouldEqual, shouldReturn)

testBoard :: Board
testBoard = Board
  { size: 3
  , pieces: M.fromFoldable
    [ Tuple (location 0 1) { piece: notPiece, rotation: rotation 0 }
    , Tuple (location 2 1) { piece: notPiece, rotation: rotation 0 }
    , Tuple (location 1 0) { piece: notPiece, rotation: rotation 1 }
    , Tuple (location 1 1) { piece: andPiece, rotation: rotation 0 }
    ]
  }

testBoardCrossOver :: Board
testBoardCrossOver = either (show >>> unsafeCrashWith) identity $
  flip execBoardM standardBoard do
    increaseSize
    addPiece (location 2 2) xorPiece
    addPiece (location 4 2) xorPiece
    addPiece (location 2 4) xorPiece
    rotatePieceBy (location 2 4) (rotation 1)
    void $ addPath Direction.Left [ location 0 2, location 1 2 ] Direction.Right
    void $ addPath Direction.Left [ location 3 2 ] Direction.Right
    void $ addPath Direction.Up [ location 2 0, location 2 1 ] Direction.Down
    void $ addPath Direction.Up [ location 3 3, location 3 4 ] Direction.Left
    void $ addPath Direction.Left [ location 3 1, location 4 1 ] Direction.Down
    void $ addPath Direction.Up [ location 1 3, location 2 3 ] Direction.Down
    pure unit


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

toAff ::  StateT Board Aff ~> Aff
--toAff = flip evalStateT standardBoard
toAff ma = evalStateT ma standardBoard

spec :: Spec Unit
spec = hoistSpec identity (\_ -> toAff) tests

tests :: forall m. MonadState Board m => MonadError Error m
  => SpecT m Unit Identity Unit
tests = do
  describe "Game.Board" do
    before (put testBoard) do
      describe "getPortOnEdge" do
        it "should return empty if space is not occupied" do
          getPortOnEdge (relative (location 0 0) Direction.Up)    `shouldReturn` Nothing
          getPortOnEdge (relative (location 2 2) Direction.Down)  `shouldReturn` Nothing
          getPortOnEdge (relative (location 0 2) Direction.Right) `shouldReturn` Nothing
        it "should still return empty if space is occupied but no port" do
          getPortOnEdge (relative (location 0 1) Direction.Up)    `shouldReturn` Nothing
          getPortOnEdge (relative (location 0 1) Direction.Down)  `shouldReturn` Nothing
        it "should return port if space is occupied and a port exists" do
          getPortOnEdge (relative (location 0 1) Direction.Left)  `shouldReturn` Just (inputPort OneBit)
          getPortOnEdge (relative (location 0 1) Direction.Right) `shouldReturn` Just (outputPort OneBit)
          getPortOnEdge (relative (location 1 0) Direction.Right) `shouldReturn` Just (outputPort OneBit)
          getPortOnEdge (relative (location 1 1) Direction.Up)    `shouldReturn` Just (inputPort OneBit)
      describe "toAbsoluteEdge/toRelativeEdge" do
        it "no piece at location test" do
          toAbsoluteEdge (relative (location 0 0) Direction.Right) `shouldReturn` absolute (location 0 0) Direction.Right
          toRelativeEdge (absolute (location 0 0) Direction.Right) `shouldReturn` relative (location 0 0) Direction.Right
        it "piece has no rotation test" do
          toAbsoluteEdge (relative (location 0 1) Direction.Right) `shouldReturn` absolute (location 0 1) Direction.Right
          toRelativeEdge (absolute (location 0 1) Direction.Right) `shouldReturn` relative (location 0 1) Direction.Right
        it "piece has rotation" do
          toAbsoluteEdge (relative (location 1 0) Direction.Right) `shouldReturn` absolute (location 1 0) Direction.Down
          toRelativeEdge (absolute (location 1 0) Direction.Right) `shouldReturn` relative (location 1 0) Direction.Up
        it "moving from absolute edge to relative edge should a round trip" do
          for_ (absolute <$> allLocations <*> allDirections) \absEdge -> 
            (toRelativeEdge absEdge >>= toAbsoluteEdge) `shouldReturn` absEdge
      describe "matchingRelativeEdge" do
        it "matches" do
          adjacentRelativeEdge (relative (location 0 1) Direction.Right) `shouldReturn` relative (location 1 1) Direction.Left
          adjacentRelativeEdge (relative (location 1 1) Direction.Right) `shouldReturn` relative (location 2 1) Direction.Left
          adjacentRelativeEdge (relative (location 1 0) Direction.Right) `shouldReturn` relative (location 1 1) Direction.Up
      it "getBoardPortEdge" do
        getBoardPortEdge Direction.Right `shouldReturn` relative (location 3 1) Direction.Right
        getBoardPortEdge Direction.Left `shouldReturn` relative (location (-1) 1) Direction.Right

--      describe "evalBoard" do
--        let evalBoard inputs = evalBoardScratch inputs >>= extractOutputs
--        it "should eval empty board" do
--          put standardBoard
--          evalBoard (testInput ff ff) `shouldReturn` M.empty
--        it "scratch" do
--          put testBoard
--          signals :: Array _ <- M.toUnfoldable <$> evalBoardScratch (testInput tt ff)
--          signals `shouldContain` (Tuple (relative (location 1 1) Direction.Up) tt)
--          signals `shouldContain` (Tuple (relative (location 1 1) Direction.Right) ff)
--          signals `shouldContain` (Tuple (relative (location 1 1) Direction.Left) ff)
--        it "should eval accurately test board" do
--          out0 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput ff ff)
--          out1 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput tt ff)
--          out2 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput ff tt)
--          out3 :: Array _ <- M.toUnfoldable <$> evalBoard (testInput tt tt)
--
--          shouldContain out0 (Tuple Direction.Right ff)
--          shouldContain out1 (Tuple Direction.Right tt)
--          shouldContain out2 (Tuple Direction.Right tt)
--          shouldContain out3 (Tuple Direction.Right tt)

      --describe "evalBoardWithPortInfo" do
      --  it "empty" do 
      --    evalBoardWithPortInfo M.empty `shouldReturn` M.empty

      --    addPiece (location 1 1) notPiece
      --    connections <- buildConnectionMap <$> get
      --    length connections `shouldEqual` 0
      --    signals :: Array _ <- M.toUnfoldable <$> evalBoardScratch M.empty
      --    signals `shouldContain`
      --      Tuple (relative (location 1 1) Direction.Right) tt

      --    ports <- allPortsOnBoard
      --    length ports `shouldEqual` 2
      --  
      --  it "with rotation" $ runBoardTest standardBoard do 
      --    let loc = location 1 0
      --    addPiece loc notPiece
      --    rotatePieceBy loc (rotation 1)

      --    connections <- buildConnectionMap <$> get
      --    length connections `shouldEqual` 1
      --    signals :: Array _ <- M.toUnfoldable <$> evalBoardScratch M.empty
      --    signals `shouldContain`
      --      Tuple (relative loc Direction.Right) tt
      --    ports :: Array _ <- M.toUnfoldable <$> allPortsOnBoard
      --    length ports `shouldEqual` 2
      --    ports `shouldContain` Tuple (relative loc Direction.Right) (Port.Output (Capacity 1))
--object

    --describe "matchingRelativeEdge" do
    --  it "" $
    --    matchingRelativeEdge (relative (location 0 1) Direction.Left) `shouldReturn` (relative (location (-1) 1) Direction.Right)

{-

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



