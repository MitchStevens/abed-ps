module Test.Component.Rendering.Wire where

import Game.Piece
import Prelude

import Component.Rendering.Segment (Segment(..))
import Component.Rendering.Wire (wirePath)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Port (inputPort, outputPort)
import Game.Signal (Signal)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = do
  describe "Component.Rendering.Wire" do
    it "wirePath" do
      let signal = zero
      let id = M.fromFoldable [ Tuple Direction.Left {connected: false, port: inputPort OneBit, signal} , Tuple Direction.Right {connected: false, port: outputPort OneBit, signal} ]
      let left = M.fromFoldable [ Tuple Direction.Left {connected: false, port: inputPort OneBit, signal} , Tuple Direction.Up {connected: false, port: outputPort OneBit, signal} ]
      let super = M.fromFoldable
                [ Tuple Direction.Left {connected: false, port: inputPort OneBit, signal}
                , Tuple Direction.Up {connected: false, port: outputPort OneBit, signal}
                , Tuple Direction.Right {connected: false, port: outputPort OneBit, signal}
                , Tuple Direction.Down {connected: false, port: outputPort OneBit, signal} ]

      -- Expected points are the same relative deltas the old `PathCommand`
      -- assertions checked (see git history), walked out into absolute
      -- coordinates -- `wirePath` no longer has a hidden cursor to thread.
      wirePath id `shouldEqual`
        [ LineTo { from: { x: 75.0, y: 35.0 }, to: { x: 88.0, y: 35.0 } }
        , LineTo { from: { x: 88.0, y: 35.0 }, to: { x: 88.0, y: 25.0 } }
        , LineTo { from: { x: 88.0, y: 25.0 }, to: { x: 100.0, y: 50.0 } }
        , LineTo { from: { x: 100.0, y: 50.0 }, to: { x: 88.0, y: 75.0 } }
        , LineTo { from: { x: 88.0, y: 75.0 }, to: { x: 88.0, y: 65.0 } }
        , LineTo { from: { x: 88.0, y: 65.0 }, to: { x: 75.0, y: 65.0 } }
        , QuadTo { from: { x: 75.0, y: 65.0 }, control: { x: 75.0, y: 65.0 }, to: { x: 25.0, y: 65.0 } }
        , LineTo { from: { x: 25.0, y: 65.0 }, to: { x: 0.0, y: 65.0 } }
        , LineTo { from: { x: 0.0, y: 65.0 }, to: { x: 0.0, y: 35.0 } }
        , LineTo { from: { x: 0.0, y: 35.0 }, to: { x: 25.0, y: 35.0 } }
        , QuadTo { from: { x: 25.0, y: 35.0 }, control: { x: 25.0, y: 35.0 }, to: { x: 75.0, y: 35.0 } }
        ]
      wirePath left `shouldEqual`
        [ LineTo { from: { x: 35.0, y: 25.0 }, to: { x: 35.0, y: 12.0 } }
        , LineTo { from: { x: 35.0, y: 12.0 }, to: { x: 25.0, y: 12.0 } }
        , LineTo { from: { x: 25.0, y: 12.0 }, to: { x: 50.0, y: 0.0 } }
        , LineTo { from: { x: 50.0, y: 0.0 }, to: { x: 75.0, y: 12.0 } }
        , LineTo { from: { x: 75.0, y: 12.0 }, to: { x: 65.0, y: 12.0 } }
        , LineTo { from: { x: 65.0, y: 12.0 }, to: { x: 65.0, y: 25.0 } }
        , QuadTo { from: { x: 65.0, y: 25.0 }, control: { x: 65.0, y: 65.0 }, to: { x: 25.0, y: 65.0 } }
        , LineTo { from: { x: 25.0, y: 65.0 }, to: { x: 0.0, y: 65.0 } }
        , LineTo { from: { x: 0.0, y: 65.0 }, to: { x: 0.0, y: 35.0 } }
        , LineTo { from: { x: 0.0, y: 35.0 }, to: { x: 25.0, y: 35.0 } }
        , QuadTo { from: { x: 25.0, y: 35.0 }, control: { x: 35.0, y: 35.0 }, to: { x: 35.0, y: 25.0 } }
        ]

      wirePath super `shouldEqual`
        [ LineTo { from: { x: 35.0, y: 25.0 }, to: { x: 35.0, y: 12.0 } }
        , LineTo { from: { x: 35.0, y: 12.0 }, to: { x: 25.0, y: 12.0 } }
        , LineTo { from: { x: 25.0, y: 12.0 }, to: { x: 50.0, y: 0.0 } }
        , LineTo { from: { x: 50.0, y: 0.0 }, to: { x: 75.0, y: 12.0 } }
        , LineTo { from: { x: 75.0, y: 12.0 }, to: { x: 65.0, y: 12.0 } }
        , LineTo { from: { x: 65.0, y: 12.0 }, to: { x: 65.0, y: 25.0 } }
        , QuadTo { from: { x: 65.0, y: 25.0 }, control: { x: 65.0, y: 35.0 }, to: { x: 75.0, y: 35.0 } }
        , LineTo { from: { x: 75.0, y: 35.0 }, to: { x: 88.0, y: 35.0 } }
        , LineTo { from: { x: 88.0, y: 35.0 }, to: { x: 88.0, y: 25.0 } }
        , LineTo { from: { x: 88.0, y: 25.0 }, to: { x: 100.0, y: 50.0 } }
        , LineTo { from: { x: 100.0, y: 50.0 }, to: { x: 88.0, y: 75.0 } }
        , LineTo { from: { x: 88.0, y: 75.0 }, to: { x: 88.0, y: 65.0 } }
        , LineTo { from: { x: 88.0, y: 65.0 }, to: { x: 75.0, y: 65.0 } }
        , QuadTo { from: { x: 75.0, y: 65.0 }, control: { x: 65.0, y: 65.0 }, to: { x: 65.0, y: 75.0 } }
        , LineTo { from: { x: 65.0, y: 75.0 }, to: { x: 65.0, y: 88.0 } }
        , LineTo { from: { x: 65.0, y: 88.0 }, to: { x: 75.0, y: 88.0 } }
        , LineTo { from: { x: 75.0, y: 88.0 }, to: { x: 50.0, y: 100.0 } }
        , LineTo { from: { x: 50.0, y: 100.0 }, to: { x: 25.0, y: 88.0 } }
        , LineTo { from: { x: 25.0, y: 88.0 }, to: { x: 35.0, y: 88.0 } }
        , LineTo { from: { x: 35.0, y: 88.0 }, to: { x: 35.0, y: 75.0 } }
        , QuadTo { from: { x: 35.0, y: 75.0 }, control: { x: 35.0, y: 65.0 }, to: { x: 25.0, y: 65.0 } }
        , LineTo { from: { x: 25.0, y: 65.0 }, to: { x: 0.0, y: 65.0 } }
        , LineTo { from: { x: 0.0, y: 65.0 }, to: { x: 0.0, y: 35.0 } }
        , LineTo { from: { x: 0.0, y: 35.0 }, to: { x: 25.0, y: 35.0 } }
        , QuadTo { from: { x: 25.0, y: 35.0 }, control: { x: 35.0, y: 35.0 }, to: { x: 35.0, y: 25.0 } }
        ]
