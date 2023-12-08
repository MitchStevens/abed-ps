module Test.Game.Board.Path where

import Prelude

import Control.Extend (duplicate, extend)
import Control.Monad.State (put)
import Data.Either (either)
import Data.List (List(..), (:))
import Data.List as L
import Data.Maybe (Maybe(..))
import Data.Zipper (Zipper(..))
import Data.Zipper as Z
import Game.Board (Board(..), standardBoard)
import Game.Board.Operation (addPiece, execBoardM, rotatePieceBy)
import Game.Board.Path (boardPath, boardPathWithError)
import Game.Direction as Direction
import Game.GameEvent (BoardEvent(..))
import Game.Location (location)
import Game.Piece (PieceId(..), andPiece, crossPiece, idPiece, leftPiece, name, notPiece, rightPiece)
import Game.Rotation (rotation)
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Board (testBoard, toAff)
import Test.Game.Board.Operation (exceptToAff)
import Test.Spec (Spec, before, describe, hoistSpec, it)
import Test.Spec.Assertions (shouldEqual, shouldReturn)

pathTestBoard :: Board
pathTestBoard = either (show >>> unsafeCrashWith) identity $ 
  flip execBoardM standardBoard do
    addPiece (location 0 1) notPiece
    addPiece (location 2 1) notPiece
    addPiece (location 1 0) idPiece
    rotatePieceBy (location 1 0) (rotation 1)
    addPiece (location 1 1) andPiece

spec :: Spec Unit
spec = do
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

    --it "small" do
    --k  createWi (Zipper Nil l1 Nil) `shouldEqual` Nothing
    --  pieceBoardEvent (Zipper (Cons l0 Nil) l1 Nil) `shouldEqual` Just Nil
    --  pieceBoardEvent (Zipper Nil l1 (Cons l2 Nil)) `shouldEqual` Just Nil
    --  pieceBoardEvent (Zipper (Cons l0 Nil) l1 (Cons l0 Nil)) `shouldEqual` Nothing

    --  pieceBoardEvent (Zipper Nil l0 (Cons l1 (Cons l2 Nil))) `shouldEqual`
    --    Just Nil
    --  pieceBoardEvent (Zipper (Cons l0 Nil) l1 (Cons l2 Nil)) `shouldEqual`
    --    Just (
    --      Cons (AddedPiece l1 (name idPiece)) $
    --      Cons (RotatedPiece l1 (rotation 0)) $
    --      Nil
    --    )
    --  pieceBoardEvent (Zipper (Cons l1 (Cons l0 Nil)) l2 Nil) `shouldEqual`
    --    Just Nil

    --  pieceBoardEvent (Zipper (Cons a0 Nil) a1 (Cons a2 Nil)) `shouldEqual`
    --    Just (
    --      Cons (AddedPiece a1 (name idPiece)) $
    --      Cons (RotatedPiece a1 (rotation 1)) $
    --      Nil
    --    )
    --  pieceBoardEvent (Zipper (Cons l2 Nil) l1 (Cons l0 Nil)) `shouldEqual`
    --    Just (
    --      Cons (AddedPiece l1 (name idPiece)) $
    --      Cons (RotatedPiece l1 (rotation 2)) $
    --      Nil
    --    )
    --  pieceBoardEvent (Zipper (Cons a2 Nil) a1 (Cons a0 Nil)) `shouldEqual`
    --    Just (
    --      Cons (AddedPiece a1 (name idPiece)) $
    --      Cons (RotatedPiece a1 (rotation 3)) $
    --      Nil
    --    )
  hoistSpec identity (\_ -> toAff) do
    describe "boardPath" do
      it "should create a single path" do
        boardPath Direction.Left [] Direction.Right `shouldReturn`  Nothing

        boardPath Direction.Left [ l0 ] Direction.Right `shouldReturn`
          Just (AddedPiece l0 (name idPiece) : Nil)

        boardPath Direction.Right [ l0 ] Direction.Left `shouldReturn`
          Just (AddedPiece l0 (name idPiece) : RotatedPiece l0 (rotation 2) : Nil)

      it "should create corner paths" do
        boardPath Direction.Up [ l0 ] Direction.Right `shouldReturn`
          Just (AddedPiece l0 (name leftPiece) : RotatedPiece l0 (rotation 1) : Nil)

        boardPath Direction.Down [ l0 ] Direction.Right `shouldReturn`
          Just (AddedPiece l0 (name rightPiece) : RotatedPiece l0 (rotation 3) : Nil)

      before (put standardBoard) do
        it "should create paths through the center of the board" do
          path <- exceptToAff $ boardPathWithError Direction.Left [a1, c, l1] Direction.Up
          path `shouldEqual`
              ( AddedPiece a1 (name idPiece)
              : AddedPiece c (name leftPiece)
              : AddedPiece l1 (name idPiece)
              : RotatedPiece l1 (rotation 3)
              : Nil
              )

      it "should create larger paths" do
        boardPath Direction.Left [ l0, l1, l2 ] Direction.Right `shouldReturn`
          Just (
            AddedPiece l0 (name idPiece)
            : AddedPiece l1 (name idPiece)
            : AddedPiece l2 (name idPiece)
            : Nil
          )

        boardPath Direction.Up [ l1, c, a1 ] Direction.Left `shouldReturn`
          Just (
            AddedPiece l1 (name idPiece)
            : RotatedPiece l1 (rotation 1)
            : AddedPiece c (name rightPiece)
            : RotatedPiece c (rotation 1)
            : AddedPiece a1 (name idPiece)
            : RotatedPiece a1 (rotation 2)
            : Nil
          )

        boardPath Direction.Left [ a1, c, l1, l2 ] Direction.Right `shouldReturn`
          Just (
            AddedPiece a1 (name idPiece)
            : AddedPiece c (name leftPiece)
            : AddedPiece l1 (name rightPiece)
            : RotatedPiece l1 (rotation 3)
            : AddedPiece l2 (name idPiece)
            : Nil
          )

      it "should fail on loops" do
        boardPath Direction.Right [ l0 ] Direction.Right `shouldReturn` Nothing
        boardPath Direction.Left [ l0, l0 ] Direction.Right `shouldReturn` Nothing
        boardPath Direction.Left [ l0, l1, l0 ] Direction.Right `shouldReturn` Nothing
      before (put pathTestBoard) do
        it "should create cross overs"  do
          boardPath Direction.Left [ l0, l1, l2 ] Direction.Right `shouldReturn`
            Just (
              AddedPiece l0 (name idPiece)
              : RemovedPiece l1 (PieceId "whatever")
              : AddedPiece l1 (name crossPiece)
              : AddedPiece l2 (name idPiece)
              : Nil
            )