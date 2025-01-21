module Test.Game.Board.Operation where

import Data.Lens (use)
import Prelude

import Control.Monad.Except (class MonadError, ExceptT, runExceptT, throwError)
import Control.Monad.State (class MonadState, put)
import Data.Either (Either(..))
import Data.Identity (Identity)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.Maybe (Maybe(..))
import Data.Set as S
import Effect.Class (class MonadEffect)
import Effect.Exception (Error, error)
import Game.Board (Board, BoardError(..), _pieces, addPiece, addPieceNoUpdate, decreaseSize, increaseSize, removePiece, standardBoard, validBoardSize)
import Game.Direction as Direction
import Game.Location (location)
import Game.Piece (andPiece, getOutputDirs, idPiece, leftPiece)
import Game.Rotation (rotation)
import Test.Game.Board (toAff)
import Test.Spec (Spec, SpecT, before, describe, hoistSpec, it)
import Test.Spec.Assertions (expectError, shouldEqual)

exceptToAff :: forall e m. MonadError Error m => Show e => ExceptT e m ~> m
exceptToAff exceptT = runExceptT exceptT >>= case _ of
  Left e -> throwError (error (show e))
  Right a -> pure a

spec :: Spec Unit
spec = hoistSpec identity (\_ -> toAff) tests

tests :: forall m
  .  MonadState Board m 
  => MonadError Error m 
  => MonadEffect m
  => SpecT m Unit Identity Unit
tests = do
  describe "Game.Board.Operation" do
    before (put standardBoard) do
      describe "addPiece" do
        it "can add a piece" do
          _ <- exceptToAff (addPiece (location 0 0) andPiece)
          pure unit
      it "will fail on adding a piece to the same location" $ do
        expectError do
          exceptToAff do
            addPiece (location 0 0) andPiece
            addPiece (location 0 0) andPiece
      --it "will recognise a new port created" do
      --  getPort Direction.Right `shouldReturn` Nothing
      --  _ <- exceptToAff (addPiece (location 2 1) andPiece)
        --getPort b1 Direction.Right `shouldEqual` Just (Output (Capacity 1))

      describe "updatePortsAround" do
        it " weird edgecase" do
          exceptToAff do
           addPiece (location 0 1) leftPiece
           addPieceNoUpdate (location 0 0) idPiece (rotation 3)
           --rotatePieceBy (location 0 0) (rotation 3)

        --  _pieces <<< at (location 0 1) .= Just { piece: leftPiece, rotation: rotation 0 }
        --  _pieces <<< at (location 0 0) .= Just { piece: idPiece,  rotation: rotation 3 }

        --  updatePortsAround (location 0 0)

          use (_pieces <<< at (location 0 1)) >>= case _ of
            Just info -> getOutputDirs info.piece `shouldEqual` S.fromFoldable [ Direction.Up ]
            Nothing -> throwError (error "couldn't find piece!")

      describe "removePiece" do
        it "can remove a piece" do
          _ <- exceptToAff (addPiece (location 0 0) andPiece)
          _ <- exceptToAff (removePiece (location 0 0))
          pure unit
        it "will fail on removing a piece if the location doesn't contain a piece" do
          expectError do
            exceptToAff do
              removePiece (location 0 0)
  --  it "will recognise a port has been removed" $ runBoardTest standardBoard do
  --    addPiece (location 2 1) andPiece
  --    b0 <- get
  --    lift $ ports b0 `shouldEqual` M.singleton Direction.Right (Output (Capacity 1))
  --    _ <- removePiece (location 2 1)
  --    b1 <- get
  --    lift $ ports b1 `shouldEqual` M.empty

      describe "board size change" do
        it "validBoardSize" do
          validBoardSize 3 `shouldEqual` Right 3
          validBoardSize 5 `shouldEqual` Right 5
          validBoardSize 2 `shouldEqual` Left (BadBoardSize 2)
          validBoardSize 4 `shouldEqual` Left (BadBoardSize 4)
          validBoardSize 11 `shouldEqual` Left (BadBoardSize 11)
        it "should allow board size increment and decrement" do
          exceptToAff increaseSize
          exceptToAff decreaseSize
      
      --describe "applyBoardEvent" do
      --  before (put standardBoard) do
      --    let loc = location 0 1
      --    it "AddedPiece" do
      --      exceptToAff (applyBoardEvent (AddedPiece loc (name idPiece)))
      --      use (_pieces <<< at loc) `shouldReturn` Just { piece: idPiece, rotation: rotation 0}
      --    it "added piece 2" do
      --      exceptToAff (applyBoardEvent (AddedPiece loc (name leftPiece)))
      --      maybeLeft <- use (_pieces <<< at (location 0 1))
      --      case maybeLeft of
      --        Just info -> do
      --          info.piece `shouldEqual` leftPiece
      --          info.rotation `shouldEqual` rotation 0
      --          getOutputDirs info.piece `shouldEqual` S.fromFoldable [ Direction.Up ]
      --        Nothing -> throwError (error "left piece was not added")

      --    it "RemovedPiece" do
      --      exceptToAff (applyBoardEvent (AddedPiece loc (name idPiece)))
      --      use (_pieces <<< at loc) `shouldReturn` Just { piece: idPiece, rotation: rotation 0}

      --      exceptToAff (applyBoardEvent (RemovedPiece loc (name idPiece)))
      --      use (_pieces <<< at loc) `shouldReturn` Nothing
