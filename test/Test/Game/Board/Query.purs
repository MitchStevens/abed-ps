module Test.Game.Board.Query where

import Prelude

import Control.Monad.Error.Class (class MonadError)
import Control.Monad.State (class MonadState, put)
import Data.Foldable (for_, traverse_)
import Data.Identity (Identity)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Game.Board (Board(..), _pieces, absolute, relative, adjacentRelativeEdge, buildConnectionMap, capacityRipple, getPortOnEdge, toAbsoluteEdge, toRelativeEdge)
import Game.Capacity (Capacity(..))
import Game.Direction (allDirections)
import Game.Direction as Direction
import Game.Location (location)
import Game.Piece (getPort)
import Game.Port (inputPort, outputPort, portCapacity)
import Test.Game.Board (testBoard, toAff)
import Test.Game.Location (allLocations)
import Test.Spec (Spec, SpecT, before, beforeAll_, describe, describeOnly, hoistSpec, it)
import Test.Spec.Assertions (expectError, shouldEqual, shouldReturn)


spec :: Spec Unit
spec = hoistSpec identity (\_ -> toAff) tests

tests :: forall m. MonadState Board m => MonadError Error m
  => SpecT m Unit Identity Unit
tests = do
  describe "Board.Query" do
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
          getPortOnEdge (relative (location 0 1) Direction.Left)  `shouldReturn` Just (inputPort  OneBit)
          getPortOnEdge (relative (location 0 1) Direction.Right) `shouldReturn` Just (outputPort OneBit)
          getPortOnEdge (relative (location 1 0) Direction.Right) `shouldReturn` Just (outputPort OneBit)
          getPortOnEdge (relative (location 1 1) Direction.Up)    `shouldReturn` Just (inputPort  OneBit)
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
      describe "buildConnectionMap" do
        it "builds connection map" do
          let l01 = location 0 1
          let l10 = location 1 0
          let l11 = location 1 1
          let l21 = location 2 1
          connections <- buildConnectionMap
          connections `shouldEqual` M.fromFoldable
            [ Tuple (relative l11 Direction.Left) (relative l01 Direction.Right)
            , Tuple (relative l11 Direction.Up) (relative l10 Direction.Right)
            , Tuple (relative l21 Direction.Left) (relative l11 Direction.Right)
            ]
        describe "capacityRipple" do
          it "ripples" do
            capacityRipple (relative (location 1 1) Direction.Up) TwoBit
            use (_pieces <<< at (location 1 1)) >>= traverse_ \info ->
              (portCapacity <$> getPort info.piece Direction.Left) `shouldEqual` Just TwoBit
            --use (_pieces <<< at (location 0 1)) >>= traverse_ \info ->
            --  getCapacity info.piece `shouldEqual` Just TwoBit
