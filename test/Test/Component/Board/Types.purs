module Test.Component.Board.Types where

import Game.Board
import Game.Piece
import Prelude

import Component.Board.Types (boardPortInfo, zoomGeometry, zoomInset, zoomTransform)
import Data.Foldable (for_)
import Data.Int (toNumber)
import Data.Number (abs)
import Game.Location (Location(..))
import Test.Spec.Assertions (shouldSatisfy)
import Component.Board.Types as Board
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Location (location)
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
  describe "zoomTransform" do
    it "scales one slot up to the board's width and moves it to the origin" do
      zoomTransform 3 0.0 (location 0 0) `shouldEqual` "translate(-25.0%, -25.0%) scale(3.5)"
      zoomTransform 3 0.0 (location 2 1) `shouldEqual` "translate(-225.0%, -125.0%) scale(3.5)"
      zoomTransform 5 0.0 (location 4 4) `shouldEqual` "translate(-425.0%, -425.0%) scale(5.5)"

  describe "zoomGeometry" do
    -- where the slot at `loc` lands, in board widths, once transformed
    let
      slotEdges n inset loc@(Location { x, y }) =
        let { scale, dx, dy } = zoomGeometry n inset loc
            unit = scale / (toNumber n + 0.5)
            left = dx + scale * (toNumber x + 0.25) / (toNumber n + 0.5)
            top = dy + scale * (toNumber y + 0.25) / (toNumber n + 0.5)
        in { left, top, right: left + unit, bottom: top + unit }
      near a b = abs (a - b) < 1.0e-9

    it "puts the slot `inset` in from every edge of the board" do
      for_ [ 1, 3, 5, 9 ] \n -> for_ [ location 0 0, location (n - 1) (n `div` 2) ] \loc ->
        for_ [ 0.0, zoomInset 3, zoomInset 7 ] \inset -> do
          let e = slotEdges n inset loc
          for_ [ e.left, e.top, 1.0 - e.right, 1.0 - e.bottom ] \gap ->
            gap `shouldSatisfy` near inset

  describe "zoomInset" do
    it "is the port track either side of the grid" do
      zoomInset 3 `shouldEqual` (25.0 / 350.0)

  describe "boardPortInfo" do
    it "reads State.boardPortInfoMap directly" do
      boardPortInfo testState `shouldEqual` pure noPortInfo

      let
        info = Frame.fromFoldable noPortInfo
          [ Tuple Direction.Left { connected: true, port: inputPort OneBit, signal: zero }
          , Tuple Direction.Right { connected: false, port: outputPort OneBit, signal: zero }
          ]

      boardPortInfo (testState { boardPortInfoMap = info }) `shouldEqual` info
