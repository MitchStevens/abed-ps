module Test.Game.Board.Path where

import Prelude

import Control.Extend (duplicate, extend)
import Data.List (List(..))
import Data.Maybe (Maybe(..))
import Data.Zipper (Zipper(..))
import Data.Zipper as Z
import Game.Board (standardBoard)
import Game.Board.Path (boardPath, pieceBoardEvent)
import Game.GameEvent (BoardEvent(..))
import Game.Location (location, rotation)
import Game.Piece (name)
import Game.Piece.BasicPiece (idPiece, leftPiece, rightPiece)
import Test.Game.Board (runBoardTest)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.AssertExtra (assertLeft, assertNothing, assertRight, equal, notEqual, shouldBeBefore, shouldContain, shouldEqual)

tests :: TestSuite
tests = do
  let l0 = location 0 0
  let l1 = location 1 0
  let l2 = location 2 0

  let a0 = location 0 0
  let a1 = location 0 1
  let a2 = location 0 2

  let c = location 1 1

  describe "pieceBoardEvent" do
    it "zipper test" do
      duplicate (Zipper Nil 1 Nil) `shouldEqual` (Zipper Nil (Zipper Nil 1 Nil) Nil)
      let z0 = Zipper Nil 0 (Cons 1 (Cons 2 Nil))
      let z1 = Zipper (Cons 0 Nil) 1 (Cons 2 Nil)
      let z2 = Zipper (Cons 1 (Cons 0 Nil)) 2 Nil
      duplicate z0 `shouldEqual` Zipper Nil z0 (Cons z1 (Cons z2 Nil))
      duplicate z1 `shouldEqual` Zipper (Cons z0 Nil) z1 (Cons z2 Nil)
      duplicate z2 `shouldEqual` Zipper (Cons z1 (Cons z0 Nil)) z2 Nil

      Z.fromFoldable ([] :: Array Int) `shouldEqual` Nothing
      Z.fromFoldable [ 0 ] `shouldEqual` Just (Zipper Nil 0 Nil)
      Z.fromFoldable [ 0, 1 ] `shouldEqual` Just (Zipper (Cons 0 Nil) 1 Nil)
      Z.fromFoldable [ 0, 1, 2 ] `shouldEqual` Just (Zipper (Cons 1 (Cons 0 Nil)) 2 Nil)

    it "small zippers" do
      pieceBoardEvent (Zipper Nil l1 Nil) `shouldEqual` Nothing
      pieceBoardEvent (Zipper (Cons l0 Nil) l1 Nil) `shouldEqual` Just Nil
      pieceBoardEvent (Zipper Nil l1 (Cons l2 Nil)) `shouldEqual` Just Nil
      pieceBoardEvent (Zipper (Cons l0 Nil) l1 (Cons l0 Nil)) `shouldEqual` Nothing

      pieceBoardEvent (Zipper Nil l0 (Cons l1 (Cons l2 Nil))) `shouldEqual`
        Just Nil
      pieceBoardEvent (Zipper (Cons l0 Nil) l1 (Cons l2 Nil)) `shouldEqual`
        Just (
          Cons (AddedPiece l1 (name idPiece)) $
          Cons (RotatedPiece l1 (rotation 0)) $
          Nil
        )
      pieceBoardEvent (Zipper (Cons l1 (Cons l0 Nil)) l2 Nil) `shouldEqual`
        Just Nil

      pieceBoardEvent (Zipper (Cons a0 Nil) a1 (Cons a2 Nil)) `shouldEqual`
        Just (
          Cons (AddedPiece a1 (name idPiece)) $
          Cons (RotatedPiece a1 (rotation 1)) $
          Nil
        )
      pieceBoardEvent (Zipper (Cons l2 Nil) l1 (Cons l0 Nil)) `shouldEqual`
        Just (
          Cons (AddedPiece l1 (name idPiece)) $
          Cons (RotatedPiece l1 (rotation 2)) $
          Nil
        )
      pieceBoardEvent (Zipper (Cons a2 Nil) a1 (Cons a0 Nil)) `shouldEqual`
        Just (
          Cons (AddedPiece a1 (name idPiece)) $
          Cons (RotatedPiece a1 (rotation 3)) $
          Nil
        )

  describe "boardPath" do
    it "small path" $ runBoardTest standardBoard do
      p0 <- boardPath [ l0 ]
      p0 `shouldEqual` Nothing

      p1 <- boardPath [ l0, l1 ]
      p1 `shouldEqual` Just Nil

      p2 <- boardPath [ l0, l1, l2 ]
      p2 `shouldEqual`
        Just (
          Cons (AddedPiece l1 (name idPiece)) $
          Cons (RotatedPiece l1 (rotation 0)) $
          Nil
        )

      p3 <- boardPath [ a0, a1, a2 ]
      p3 `shouldEqual`
        Just (
          Cons (AddedPiece a1 (name idPiece)) $
          Cons (RotatedPiece a1 (rotation 1)) $
          Nil
        )

      p4 <- boardPath [ a1, c, l1 ]
      p4 `shouldEqual`
        Just (
          Cons (AddedPiece c (name leftPiece)) $
          Cons (RotatedPiece c (rotation 0)) $
          Nil
        )

      p5 <- boardPath [ l1, c, a1 ]
      p5 `shouldEqual`
        Just (
          Cons (AddedPiece c (name rightPiece)) $
          Cons (RotatedPiece c (rotation 1)) $
          Nil
        )
      
      p6 <- boardPath [ a1, c, l1, l2 ]
      p6 `shouldEqual`
        Just (
          Cons (AddedPiece c (name leftPiece)) $
          Cons (RotatedPiece c (rotation 0)) $
          Cons (AddedPiece l1 (name rightPiece)) $
          Cons (RotatedPiece l1 (rotation 3)) $
          Nil
        )



--boardPath :: forall m. MonadState Board m => Array Location -> m (Maybe (List BoardEvent))
--pieceBoardEvent :: Zipper Location -> Maybe (List BoardEvent) 