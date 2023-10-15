module Test.Game.Board.BoardDeltaStore where

import Prelude

import Data.Array (foldl, foldr)
import Data.List (List(..), (:))
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Board.BoardDelta (BoardDelta(..), invertBoardDelta)
import Game.Board.BoardDeltaStore (cons, empty, uncons)
import Game.Location (location, rotation)
import Game.Piece (PieceId(..))
import Test.Unit (TestSuite, describe, failure, it)
import Test.Unit.Assert (shouldEqual)


tests :: TestSuite
tests = do
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


