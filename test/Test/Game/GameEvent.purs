module Test.Game.GameEvent where

import Prelude
import Game.GameEvent

import Data.Foldable (length)
import Data.Newtype (unwrap)
import Game.Piece (name)
{-
tests :: TestSuite
tests = do
  describe "GameEventStore" do
    pure unit
--    let addEvent    = BoardEvent $ AddedPiece (location 0 0) (name idPiece)
--    let rotateEvent = BoardEvent $ RotatedPiece (location 0 0) (rotation 1)
--    let removeEvent = BoardEvent $ RemovedPiece (location 0 0) (name idPiece)
--    let boardSizeEvent = SidebarEvent BoardSizeIncrementClicked
--    it "empty" do
--      let store = empty
--      length store.gameEventHistory `shouldEqual` 0
--      length store.allGameEvents `shouldEqual` 0
--    it "cons" do
--      let store = empty
--      pure unit
--    describe "game event predicates" do
--      it "basic predicates" do
--        unwrap boardEvent addEvent `shouldEqual` true
--        unwrap boardEvent boardSizeEvent `shouldEqual` false
--        unwrap pieceAdded addEvent `shouldEqual` true
--        unwrap pieceAdded removeEvent `shouldEqual` false
--      it "locationAt" do
--        unwrap (locationAt (location 0 0)) removeEvent `shouldEqual` true
--        unwrap (locationAt (location 0 1)) removeEvent `shouldEqual` false
--      it "pieceId" do
--        unwrap (pieceId (name idPiece)) addEvent `shouldEqual` true
--        unwrap (pieceId (name notPiece)) addEvent `shouldEqual` false
--    describe "GameEventStore predicates" do
--      let store = empty # cons addEvent # cons rotateEvent # cons removeEvent # cons addEvent
--      it "count" do
--        unwrap (count eq 2 pieceAdded) store `shouldEqual` true
--        unwrap (count eq 1 pieceRemoved) store `shouldEqual` true
--        unwrap (count eq 1 pieceRotated) store `shouldEqual` true
--        unwrap (count eq 1 pieceMoved) store `shouldEqual` false
--      it "first time" do
--        unwrap (firstTime pieceAdded) store `shouldEqual` false
--        unwrap (secondTime pieceAdded) store `shouldEqual` true
  

{-
  describe "BoardDeltaStore" do
    let addDelta = AddedPiece (location 0 0) (PieceId "idPiece")
    let rotateDelta = RotatedPiece (location 0 0) (rotation 1)
    let removeDelta = invertBoardDelta addDelta
    it "cons" do
      let s0 = empty
      s0.boardDeltaHistory `shouldEqual` Nil
      s0.allDeltas `shouldEqual` M.empty
      let s1 = cons addDelta s0
      s1.boardDeltaHistory `shouldEqual` (addDelta : Nil)
      s1.allDeltas `shouldEqual` M.singleton addDelta 1
      let s2 = cons removeDelta s1
      s2.boardDeltaHistory `shouldEqual` (removeDelta : addDelta : Nil)
      s2.allDeltas `shouldEqual` M.fromFoldable
        [ Tuple addDelta 1
        , Tuple removeDelta 1 
        ]
    it "uncons" do
      let s0 = foldl (flip cons) empty [addDelta, rotateDelta]
      s0.boardDeltaHistory `shouldEqual` (rotateDelta : addDelta : Nil)
      s0.allDeltas `shouldEqual` M.fromFoldable
        [ Tuple addDelta 1
        , Tuple rotateDelta 1 
        ]
      case uncons s0 of
        Just { head, tail } -> do
          head `shouldEqual` rotateDelta
          tail `shouldEqual`
            { boardDeltaHistory: (addDelta : Nil) 
            , allDeltas: M.fromFoldable
              [ Tuple addDelta 1
              , Tuple rotateDelta 1 
              ]
            }
        Nothing -> failure "couldn't uncons deltaboardstore"
-}