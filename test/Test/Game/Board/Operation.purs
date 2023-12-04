module Test.Game.Board.Operation where

import Prelude

import Control.Monad.Except (class MonadError, ExceptT, runExceptT, throwError)
import Control.Monad.State (class MonadState, put)
import Data.Either (Either(..))
import Data.Identity (Identity)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Debug (debugger, trace)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log)
import Effect.Exception (Error, error)
import Game.Board (Board(..), relativeEdgeLocation, standardBoard)
import Game.Board.EvaluableBoard (topologicalSort)
import Game.Board.Operation (BoardError(..), addPiece, decreaseSize, increaseSize, removePiece, validBoardSize)
import Game.Board.Query (buildConnectionMap)
import Game.Location (location)
import Game.Piece (andPiece)
import Test.Game.Board (testBoard, toAff)
import Test.Spec (Spec, SpecT, before, beforeAll_, describe, hoistSpec, it)
import Test.Spec.Assertions (expectError, shouldEqual, shouldReturn)

exceptToAff :: forall e m. MonadError Error m => Show e => ExceptT e m ~> m
exceptToAff exceptT = runExceptT exceptT >>= case _ of
  Left e -> throwError (error (show e))
  Right a -> pure a

spec :: Spec Unit
spec = hoistSpec identity (\_ -> toAff) tests

tests :: forall m. MonadState Board m => MonadError Error m => MonadEffect m
  => SpecT m Unit Identity Unit
tests = do
  describe "Operation" do
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
      
      describe "topologicalSort" do
        before (put testBoard) do
          let getNodes edges =
                edges
                  # (M.toUnfoldable :: _ -> List _)
                  # L.foldMap (\(Tuple a b) -> a : b : Nil)
                  # map relativeEdgeLocation
                  # L.nub
          it "should sort good" do
            edges <- buildConnectionMap
            let nodes = getNodes edges
            topologicalSort nodes edges `shouldEqual`
              Just (L.fromFoldable [ location 1 0, location 0 1, location 1 1, location 2 1 ])

