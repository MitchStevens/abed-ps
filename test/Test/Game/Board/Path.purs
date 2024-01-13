module Test.Game.Board.Path where

import Prelude

import Component.Board (_board)
import Control.Extend (duplicate, extend)
import Control.Monad.State (get, put)
import Data.Either (either)
import Data.Foldable (traverse_)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.Zipper (Zipper(..))
import Data.Zipper as Z
import Debug (trace)
import Game.Board 
import Game.Direction as Direction
import Game.Location (location)
import Game.Piece 
import Game.Rotation (rotation)
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Board (testBoard, toAff)
import Test.Game.Board.Operation (exceptToAff)
import Test.Spec (Spec, before, describe, hoistSpec, it)
import Test.Spec.Assertions (shouldContain, shouldEqual, shouldReturn)

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
  let l00 = location 0 0
  let l01 = location 0 1
  let l02 = location 0 2
  let l10 = location 1 0
  let l11 = location 1 1
  let l12 = location 1 2
  let l20 = location 2 0
  let l21 = location 2 1
  let l22 = location 2 2

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
    describe "addBoardPath" do
      describe "Basic Paths" do
        it "should fail if no locations are provided" do
          addBoardPath Direction.Left [] Direction.Right `shouldReturn` false

        it "should create a single path" do
          addBoardPath Direction.Left [ l00 ] Direction.Right `shouldReturn` true
          use (_pieces) `shouldReturn` M.singleton l00 { piece: idPiece, rotation: rotation 0 }

        it "should create a single path from right to left" do
          addBoardPath Direction.Right [ l00 ] Direction.Left `shouldReturn` true
          use (_pieces) `shouldReturn` M.singleton l00 { piece: idPiece, rotation: rotation 2 }

        it "should create corner paths" do
          addBoardPath Direction.Up [ l00 ] Direction.Right `shouldReturn` true
          use _pieces `shouldReturn` M.singleton l00 { piece: leftPiece, rotation: rotation 1 }

        it "should create right corner paths" do
          addBoardPath Direction.Down [ l00 ] Direction.Right `shouldReturn` true
          use _pieces `shouldReturn` M.singleton l00 { piece: rightPiece, rotation: rotation 3 }

        it "should create larger paths" do
          addBoardPath Direction.Left [ l00, l10, l20 ] Direction.Right `shouldReturn` true
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l00 { piece: idPiece, rotation: rotation 0 }
            , Tuple l10 { piece: idPiece, rotation: rotation 0 }
            , Tuple l20 { piece: idPiece, rotation: rotation 0 }
            ]

        it "should create paths through the center of the board" do
          addBoardPath Direction.Left [l01, l11, l10] Direction.Up `shouldReturn` true
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l01 { piece: idPiece, rotation: rotation 0 }
            , Tuple l11 { piece: leftPiece, rotation: rotation 0 }
            , Tuple l10 { piece: idPiece, rotation: rotation 3 }
            ]
        
        it "should create complex paths" do
          addBoardPath Direction.Up [ l10, l11, l01 ] Direction.Left `shouldReturn` true
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l10 { piece: idPiece, rotation: rotation 1 }
            , Tuple l11  { piece: rightPiece, rotation: rotation 1 }
            , Tuple l01 { piece: idPiece, rotation: rotation 2 }
            ]

        it "should create length 4 paths" do
          addBoardPath Direction.Left [ l01, l11, l10, l20 ] Direction.Right `shouldReturn` true
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l01 { piece: idPiece, rotation: rotation 0 }
            , Tuple l11  { piece: leftPiece, rotation: rotation 0 }
            , Tuple l10 { piece: rightPiece, rotation: rotation 3 }
            , Tuple l20 { piece: idPiece, rotation: rotation 0 }
            ]

        it "should fail on when initial dir == terminal " do
          addBoardPath Direction.Right [ l00 ] Direction.Right `shouldReturn` false

        it "should fail when path has same location twice" do
          addBoardPath Direction.Left [ l00, l00 ] Direction.Right `shouldReturn` false

        it "should fail on loops" do
          addBoardPath Direction.Left [ l00, l10, l00 ] Direction.Right `shouldReturn` false

        it "should fail when obstructed  by other pieces" do
          addBoardPath Direction.Left [ l00 ] Direction.Right `shouldReturn` true
          addBoardPath Direction.Left [ l00 ] Direction.Right `shouldReturn` false

      describe "Paths requiring removal" do
        it "should create a cross over with no rotation" do
          addBoardPath Direction.Up [ l10, l11, l12 ] Direction.Down `shouldReturn` true
          addBoardPath Direction.Left [ l01, l11, l21 ] Direction.Right `shouldReturn` true
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 0}


        it "should create a cross over with rotation 1" do
          addBoardPath Direction.Right [ l21, l11, l01 ] Direction.Left `shouldReturn` true
          addBoardPath Direction.Up [ l10, l11, l12 ] Direction.Down `shouldReturn` true
          b <- get
          trace (show b) \_ -> pure unit
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 1 }
          use (_pieces <<< at l10) `shouldReturn` Just { piece: idPiece, rotation: rotation 1 }

        it "should create a cross over with rotation 2" do
          addBoardPath Direction.Right [ l21, l11, l01 ] Direction.Left `shouldReturn` true
          addBoardPath Direction.Down [ l12, l11, l10 ] Direction.Up `shouldReturn` true
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 2 }

        it "should create a cross over with rotation 3" do
          addBoardPath Direction.Down [ l12, l11, l10 ] Direction.Up `shouldReturn` true
          addBoardPath Direction.Left [ l01, l11, l21 ] Direction.Right `shouldReturn` true
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 3 }

      describe "Weird edge cases" do
        it "cruz" do
          addBoardPath Direction.Left [ l00, l10, l11, l12 ] Direction.Down `shouldReturn` true
          addBoardPath Direction.Left [ l01, l11, l21 ] Direction.Right `shouldReturn` true
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 0 }
          use (_pieces <<< at l10) >>= traverse_ \info ->
            getOutputDirs info.piece `shouldContain` Direction.Down

          --`shouldReturn` Just { piece: rightPiece, rotation: rotation 0 }



      --before (put pathTestBoard) do
      --  it "should create cross overs"  do
      --    addBoardPath Direction.Left [ l0, l1, l2 ] Direction.Right `shouldReturn` true
      --    use (_pieces <<< at l0) `shouldReturn` Just { piece: idPiece, rotation: rotation 0 }
      --    use (_pieces <<< at l1) `shouldReturn` Just { piece: crossPiece, rotation: rotation 0 }
      --    use (_pieces <<< at l2) `shouldReturn` Just { piece: idPiece, rotation: rotation 0 }