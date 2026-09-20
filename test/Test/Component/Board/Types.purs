module Test.Component.Board.Types where

import Game.Board
import Game.Piece
import Prelude

import Component.Board.Types (boardPortInfo)
import Component.Board.Types as Board
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Port (inputPort, outputPort)
import Game.PortInfo (noPortInfo)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

testState :: Board.State
testState = Board.initialState { board: standardBoard }

spec :: Spec Unit
spec = describe "Component.Board.Types" do
  -- `boardPortInfo` is now a plain projection of `State.boardPortInfoMap`,
  -- which `Component.Board`'s `EvaluateBoard` handler is the only thing
  -- that ever populates (via `Game.Board.Compiled.boundaryPortInfo`) --
  -- nothing left here to derive on the fly.
  describe "boardPortInfo" do
    it "reads State.boardPortInfoMap directly" do
      boardPortInfo testState `shouldEqual` pure noPortInfo

      let
        info = Frame.fromFoldable noPortInfo
          [ Tuple Direction.Left { connected: true, port: inputPort OneBit, signal: zero }
          , Tuple Direction.Right { connected: false, port: outputPort OneBit, signal: zero }
          ]

      boardPortInfo (testState { boardPortInfoMap = info }) `shouldEqual` info
