module Test.Game.Board.Query where

import Prelude

import Control.Monad.Error.Class (class MonadError)
import Control.Monad.State (class MonadState, put)
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.Identity (Identity)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Game.Board (Board, Cell(..), _pieces, buildConnectionMap, capacityRipple, getBoardEdges, getBoardPorts, relative)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Location (location)
import Game.Piece (getPort)
import Game.Port (inputPort, noPort, outputPort, portCapacity)
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
      describe "getBoardEdges" do
        it "gives the location just inside each of the four sides" do
          -- `testBoard` is size 3
          edges <- getBoardEdges
          edges `shouldEqual` Frame.tabulate case _ of
            Direction.Up -> location 1 0
            Direction.Right -> location 2 1
            Direction.Down -> location 1 2
            Direction.Left -> location 0 1

      describe "getBoardPorts" do
        it "reads the port each side's edge piece presents, and noPort where there's no piece" do
          -- the Left and Right edges hold unrotated `notPiece`s; the bottom edge is empty
          ports <- getBoardPorts
          Frame.index Direction.Left ports `shouldEqual` inputPort OneBit
          Frame.index Direction.Right ports `shouldEqual` outputPort OneBit
          Frame.index Direction.Down ports `shouldEqual` noPort

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
              case info.piece of
                Leaf p -> (portCapacity <$> getPort p Direction.Left) `shouldEqual` Just TwoBit
                Nested _ -> pure unit
            --use (_pieces <<< at (location 0 1)) >>= traverse_ \info ->
            --  getCapacity info.piece `shouldEqual` Just TwoBit
