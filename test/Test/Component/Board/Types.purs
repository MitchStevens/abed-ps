module Test.Component.Board.Types where

import Game.Board
import Game.Piece
import Prelude
import Prelude

import Component.Board.Types (boardPortInfo)
import Component.Board.Types as Board
import Control.Monad.State (evalStateT, gets, modify_, put)
import Data.HeytingAlgebra (ff)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.Zipper as Z
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Port (inputPort, outputPort)
import Test.Game.Board (testBoard)
import Test.Spec (Spec, describe, describeOnly, hoistSpec, it)
import Test.Spec.Assertions (shouldReturn)

testState :: Board.State
testState = Board.initialState Nothing

spec :: Spec Unit
spec = hoistSpec identity (\_ -> flip evalStateT testState)  do
  describe "Component.Board.Types" do
    it "boardPortInfo" do
      boardPortInfo `shouldReturn` M.empty
      put (Board.initialState (Just testBoard))
      modify_ $ _ { boardPorts = getPorts idPiece }
      gets (_.boardPorts) `shouldReturn` M.fromFoldable
        [ Tuple Direction.Left (inputPort OneBit)
        , Tuple Direction.Right (outputPort OneBit)
        ]
      boardPortInfo `shouldReturn` M.fromFoldable
        [ Tuple Direction.Left { connected: false, port: inputPort OneBit, signal: ff }
        , Tuple Direction.Right { connected: false, port: outputPort OneBit, signal: ff }
        ]