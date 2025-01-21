module Test.Game.Edge where

import Prelude

import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Control.Monad.Maybe.Trans (MaybeT(..), lift, runMaybeT)
import Control.Monad.State (class MonadState, StateT(..), evalStateT, runStateT)
import Data.Foldable (for_)
import Data.Identity (Identity)
import Data.Maybe (maybe)
import Effect.Aff (Aff)
import Effect.Exception (Error, error)
import Game.Board (Board(..), RelativeEdge)
import Game.Board.Edge (AbsoluteEdge(..), absolute, adjacent, edgeLocation, fromAbsoluteEdge, getPortOnEdge, relative, toAbsoluteEdge)
import Game.Capacity (Capacity(..))
import Game.Direction (allDirections)
import Game.Direction as Direction
import Game.Location (location)
import Game.Port (inputPort, outputPort)
import Test.Game.Board (testBoard)
import Test.Game.Location (allLocations)
import Test.Spec (Spec, SpecT(..), describe, hoistSpec, it, itOnly)
import Test.Spec.Assertions (fail, shouldEqual, shouldNotEqual, shouldReturn)
import Test.Spec.QuickCheck (quickCheck)

allEdges :: Array AbsoluteEdge
allEdges = absolute <$> allLocations <*> allDirections

expectNothing :: forall m a. MonadThrow Error m => MaybeT m a -> MaybeT m Unit
expectNothing maybeT = lift do
  runMaybeT maybeT >>= maybe (pure unit) (\_ -> throwError (error "expectNothing failed"))

toAff :: MaybeT (StateT Board Aff) ~> Aff
toAff = runMaybeT >>> flip evalStateT testBoard >>> (bindFlipped (maybe (throwError (error "toAff")) pure))

spec :: Spec Unit
spec =  hoistSpec identity (\_ -> toAff) tests

tests :: forall m. MonadState Board m => MonadError Error m
  => SpecT (MaybeT m) Unit Identity Unit
tests =
  describe "Edge" do
    --it "matchEdge" do
    --  for_ allEdges \edge -> matchEdge edge `shouldNotEqual` edge
    --  for_ allEdges \edge -> matchEdge (matchEdge edge) `shouldEqual` edge
    it "should have derived Ord correctly" do
      for_ allEdges \e1 -> 
        for_ allEdges \e2 -> 
          unless (not (edgeLocation e1 > edgeLocation e2) || (e1 > e2)) do
            fail ""
    describe "getPortOnEdge" do
      it "should return empty if space is not occupied" do
        expectNothing $ getPortOnEdge (relative (location 0 0) Direction.Up)
        expectNothing $ getPortOnEdge (relative (location 2 2) Direction.Down)
        expectNothing $ getPortOnEdge (relative (location 0 2) Direction.Right)
      it "should still return empty if space is occupied but no port" do
        expectNothing $ getPortOnEdge (relative (location 0 1) Direction.Up)  
        expectNothing $ getPortOnEdge (relative (location 0 1) Direction.Down)
      it "should return port if space is occupied and a port exists" do
        getPortOnEdge (relative (location 0 1) Direction.Left)  `shouldReturn` (inputPort OneBit)
        getPortOnEdge (relative (location 0 1) Direction.Right) `shouldReturn` (outputPort OneBit)
        getPortOnEdge (relative (location 1 0) Direction.Right) `shouldReturn` (outputPort OneBit)
        getPortOnEdge (relative (location 1 1) Direction.Up)    `shouldReturn` (inputPort OneBit)
    describe "toAbsoluteEdge/toRelativeEdge" do
      it "no piece at location test" do
        expectNothing $ toAbsoluteEdge (relative (location 0 0) Direction.Right)
        expectNothing $ fromAbsoluteEdge @RelativeEdge (absolute (location 0 0) Direction.Right)
      it "piece has no rotation test" do
        toAbsoluteEdge (relative (location 0 1) Direction.Right) `shouldReturn` absolute (location 0 1) Direction.Right
        fromAbsoluteEdge (absolute (location 0 1) Direction.Right) `shouldReturn` relative (location 0 1) Direction.Right
      it "piece has rotation" do
        toAbsoluteEdge (relative (location 1 0) Direction.Right) `shouldReturn` absolute (location 1 0) Direction.Down
        fromAbsoluteEdge (absolute (location 1 0) Direction.Right) `shouldReturn` relative (location 1 0) Direction.Up
      --it "moving from absolute edge to relative edge should a round trip" do
      --  for_ (absolute <$> allLocations <*> allDirections) \absEdge -> 
      --    (fromAbsoluteEdge absEdge >>= toAbsoluteEdge) `shouldReturn` absEdge
    describe "matchingRelativeEdge" do
      it "matches" do
        adjacent (relative (location 0 1) Direction.Right) `shouldReturn` relative (location 1 1) Direction.Left
        adjacent (relative (location 1 1) Direction.Right) `shouldReturn` relative (location 2 1) Direction.Left
        adjacent (relative (location 1 0) Direction.Right) `shouldReturn` relative (location 1 1) Direction.Up
