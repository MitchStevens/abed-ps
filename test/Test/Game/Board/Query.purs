module Test.Game.Board.Query where

import Prelude

import Control.Monad.Error.Class (class MonadError)
import Control.Monad.State (class MonadState, put)
import Data.Foldable (traverse_)
import Data.Identity (Identity)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Game.Board (Board, _pieces, buildConnectionMap, capacityRipple, relative)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Location (location)
import Game.Piece (getPort)
import Game.Port (portCapacity)
import Test.Game.Board (testBoard, toAff)
import Test.Spec (Spec, SpecT, before, describe, hoistSpec, it)
import Test.Spec.Assertions (shouldEqual)


spec :: Spec Unit
spec = hoistSpec identity (\_ -> toAff) tests

tests :: forall m. MonadState Board m => MonadError Error m
  => SpecT m Unit Identity Unit
tests = do
  describe "Board.Query" do
    before (put testBoard) do
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
