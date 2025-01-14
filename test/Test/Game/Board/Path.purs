module Test.Game.Board.Path where

import Game.Board
import Game.Piece
import Prelude

import Component.Board (_board)
import Control.Extend (duplicate, extend)
import Control.Monad.Error.Class (class MonadError, throwError)
import Control.Monad.Except (ExceptT)
import Control.Monad.State (class MonadState, get, lift, put)
import Data.Either (either, isRight)
import Data.Foldable (traverse_)
import Data.Identity (Identity)
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
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Exception (Error, error)
import Game.Direction as Direction
import Game.Location (location)
import Game.Rotation (rotation)
import Halogen.Svg.Attributes (m)
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Board (testBoard, toAff)
import Test.Game.Board.Operation (exceptToAff)
import Test.Game.Board.PathSegment (leftToRight)
import Test.Spec (Spec, SpecT, before, beforeAll, beforeAll_, before_, describe, describeOnly, focus, hoistSpec, it, itOnly)
import Test.Spec.Assertions (expectError, shouldContain, shouldEqual, shouldReturn, shouldSatisfy)

pathTestBoard :: Board
pathTestBoard = either (show >>> unsafeCrashWith) identity $ 
  flip execBoardM standardBoard do
    addPiece (location 0 1) notPiece
    addPiece (location 2 1) notPiece
    addPiece (location 1 0) idPiece
    rotatePieceBy (location 1 0) (rotation 1)
    addPiece (location 1 1) andPiece


spec :: Spec Unit
spec = hoistSpec identity (\_ -> toAff) tests

emptyBoard :: Board
emptyBoard = Board { pieces: M.empty, size: 3 }



--hoistSpec :: forall m a. (m ~> Identity) -> (ComputationType -> a ~> Aff) -> (SpecT a Unit m) ~> (SpecT Aff Unit Identity)


tests :: forall m
  .  MonadState Board m
  => MonadError Error m
  => MonadAff m
  => SpecT m Unit Identity Unit
tests =
  describe "Game.Board.Path" do
    let l00 = location 0 0
    let l01 = location 0 1
    let l02 = location 0 2
    let l10 = location 1 0
    let l11 = location 1 1
    let l12 = location 1 2
    let l20 = location 2 0
    let l21 = location 2 1
    let l22 = location 2 2

    let path1 = { initial: Direction.Left
      , start: l00
      , segments: []
      , terminal: Direction.Right }

    let path2 = { initial: Direction.Left
      , start: l00
      , segments: [Direction.Right, Direction.Right]
      , terminal: Direction.Right }

    describe "toPath" do
      it "should fail when creating an empty path" do
        toPath Direction.Left [] Direction.Right
          `shouldEqual` throwError PathIsEmpty
      it "should fail when locations are not adjacent" do
        toPath Direction.Left [l00, l02] Direction.Right
          `shouldEqual` throwError (LocationsAreNotAdjacent l00 l02)
      it "should create single paths" do
        toPath Direction.Left [l00] Direction.Right
          `shouldEqual` pure path1
    describe "partitionPath" do
      it "" do
        partitionPath path1
          `shouldEqual` pure (M.singleton l00 leftToRight)
        partitionPath path2
          `shouldEqual` pure
            (M.fromFoldable
              [ Tuple l00 leftToRight
              , Tuple l10 leftToRight
              , Tuple l20 leftToRight
              ] )

    describe "addPath" do
      before_ (put emptyBoard) do
        describe "Paths on empty board" do
          it "should fail if no locations are provided" do
            expectError $
              exceptToAff do
                addPath Direction.Left [] Direction.Right
          
          it "should create a single path" do
            pathAdded <- exceptToAff $ addPath Direction.Left [ l00 ] Direction.Right
            pathAdded `shouldEqual`
              { initial: Direction.Left, start: l00, segments: [], terminal: Direction.Right }
            use (_pieces) `shouldReturn` M.singleton l00 { piece: idPiece, rotation: rotation 0 }

          it "should create a single path from right to left" do
            pathAdded <- exceptToAff $ addPath Direction.Right [ l00 ] Direction.Left
            pathAdded `shouldEqual`
              { initial: Direction.Right, start: l00, segments: [], terminal: Direction.Left }
            use (_pieces) `shouldReturn` M.singleton l00 { piece: idPiece, rotation: rotation 2 }

          it "should create corner paths" do
            pathAdded <- exceptToAff $ addPath Direction.Up [ l00 ] Direction.Right
            pathAdded `shouldEqual`
              { initial: Direction.Up, start: l00, segments: [], terminal: Direction.Right }
            use _pieces `shouldReturn` M.singleton l00 { piece: leftPiece, rotation: rotation 1 }

        it "should create right corner paths" do
          pathAdded <- exceptToAff $ addPath Direction.Down [ l00 ] Direction.Right 
          pathAdded `shouldEqual`  
            { initial: Direction.Down, start: l00, segments: [], terminal: Direction.Right }
          use _pieces `shouldReturn` M.singleton l00 { piece: rightPiece, rotation: rotation 3 }

        it "should create larger paths" do
          pathAdded <- exceptToAff do
            addPath Direction.Left [ l00, l10, l20 ] Direction.Right
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l00 { piece: idPiece, rotation: rotation 0 }
            , Tuple l10 { piece: idPiece, rotation: rotation 0 }
            , Tuple l20 { piece: idPiece, rotation: rotation 0 }
            ]

        it "should create paths through the center of the board" do
          pathAdded <- exceptToAff do
            addPath Direction.Left [l01, l11, l10] Direction.Up
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l01 { piece: idPiece, rotation: rotation 0 }
            , Tuple l11 { piece: leftPiece, rotation: rotation 0 }
            , Tuple l10 { piece: idPiece, rotation: rotation 3 }
            ]
        
        it "should create complex paths" do
          pathAdded <- exceptToAff do
            addPath Direction.Up [ l10, l11, l01 ] Direction.Left
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l10 { piece: idPiece, rotation: rotation 1 }
            , Tuple l11  { piece: rightPiece, rotation: rotation 1 }
            , Tuple l01 { piece: idPiece, rotation: rotation 2 }
            ]

        it "should create length 4 paths" do
          pathAdded <- exceptToAff do
            addPath Direction.Left [ l01, l11, l10, l20 ] Direction.Right
          use _pieces `shouldReturn` M.fromFoldable
            [ Tuple l01 { piece: idPiece, rotation: rotation 0 }
            , Tuple l11  { piece: leftPiece, rotation: rotation 0 }
            , Tuple l10 { piece: rightPiece, rotation: rotation 3 }
            , Tuple l20 { piece: idPiece, rotation: rotation 0 }
            ]

        it "should fail on when initial dir == terminal " do
          expectError $ exceptToAff $ addPath Direction.Right [ l00 ] Direction.Right

        it "should fail when path has same location twice" do
          expectError $ exceptToAff $ addPath Direction.Left [ l00, l00 ] Direction.Right

        it "should fail on loops" do
          expectError $ exceptToAff $ addPath Direction.Left [ l00, l10, l00 ] Direction.Right

        it "should create a cross over with no rotation" do
          void $ exceptToAff $ addPath Direction.Up [ l10, l11, l12 ] Direction.Down
          void $ exceptToAff $ addPath Direction.Left [ l01, l11, l21 ] Direction.Right
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 0}

        it "should create a cross over with rotation 1" do
          void $ exceptToAff $ addPath Direction.Right [ l21, l11, l01 ] Direction.Left
          void $ exceptToAff $ addPath Direction.Up [ l10, l11, l12 ] Direction.Down
          b <- get
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 1 }
          use (_pieces <<< at l10) `shouldReturn` Just { piece: idPiece, rotation: rotation 1 }

        it "should create a cross over when paths are flipped" do
          void $ exceptToAff $ addPath Direction.Right [ l21, l11, l01 ] Direction.Left
          void $ exceptToAff $ addPath Direction.Down [ l12, l11, l10 ] Direction.Up
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 0 }

        it "should create a cross over with rotation 3" do
          void $ exceptToAff $ addPath Direction.Down [ l12, l11, l10 ] Direction.Up
          void $ exceptToAff $ addPath Direction.Left [ l01, l11, l21 ] Direction.Right
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 1 }
        
        --it "should update ports around" do
        --  void $ exceptToAff $ addPath Direction.Left [ l10 ] Direction.Right
        --  use (_pieces <<< at l10) `shouldReturn` Just { piece: idPiece, rotation: rotation 0}

        --  void $ exceptToAff $ addPath Direction.Up [ l11 ] Direction.Right
        --  use (_pieces <<< at l10) `shouldReturn` Just { piece: intersectionRightPiece, rotation: rotation 0}


      describe "Weird edge cases" do
        it "cruz" do
          exceptToAff do
            void $ addPath Direction.Left [ l00, l10, l11, l12 ] Direction.Down
            void $ addPath Direction.Left [ l01, l11, l21 ] Direction.Right
          use (_pieces <<< at l11) `shouldReturn` Just { piece: crossPiece, rotation: rotation 0 }
          use (_pieces <<< at l10) >>= traverse_ \info ->
            getOutputDirs info.piece `shouldContain` Direction.Down
        
        it "crossOver" do
          exceptToAff do
            setBoardSize 5
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

          --`shouldReturn` Just { piece: rightPiece, rotation: rotation 0 }



      --before (put pathTestBoard) do
      --  it "should create cross overs"  do
      --    addBoardPath Direction.Left [ l0, l1, l2 ] Direction.Right `shouldReturn` true
      --    use (_pieces <<< at l0) `shouldReturn` Just { piece: idPiece, rotation: rotation 0 }
      --    use (_pieces <<< at l1) `shouldReturn` Just { piece: crossPiece, rotation: rotation 0 }
      --    use (_pieces <<< at l2) `shouldReturn` Just { piece: idPiece, rotation: rotation 0 }