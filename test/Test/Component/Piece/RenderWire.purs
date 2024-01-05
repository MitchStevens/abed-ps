module Test.Component.Piece.RenderWire where

import Prelude

import Component.Piece.RenderWire (wirePath)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece (Capacity(..), inputPort, outputPort)
import Game.Signal (Signal(..))
import Halogen.Svg.Attributes (CommandPositionReference(..), l, m, q)
import Test.Spec (Spec, describe, it, itOnly)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = do
  describe "RenderWire" do
    it "wirePath" do
      let signal = Signal 0
      let singleRightOutput = M.singleton Direction.Right {connected: false, port: outputPort OneBit, signal: Signal 0}
      let id = M.fromFoldable [ Tuple Direction.Left {connected: false, port: inputPort OneBit, signal} , Tuple Direction.Right {connected: false, port: outputPort OneBit, signal} ]
      let left = M.fromFoldable [ Tuple Direction.Left {connected: false, port: inputPort OneBit, signal} , Tuple Direction.Up {connected: false, port: outputPort OneBit, signal} ]
      let super = M.fromFoldable
                [ Tuple Direction.Left {connected: false, port: inputPort OneBit, signal}
                , Tuple Direction.Up {connected: false, port: outputPort OneBit, signal}
                , Tuple Direction.Right {connected: false, port: outputPort OneBit, signal}
                , Tuple Direction.Down {connected: false, port: outputPort OneBit, signal} ]

      wirePath singleRightOutput `shouldEqual`
        [ m Rel 75.0 35.0
        , l Rel 13.0 0.0
        , l Rel 0.0 (-10.0)
        , l Rel 12.0 25.0
        , l Rel (-12.0) 25.0
        , l Rel 0.0 (-10.0)
        , l Rel (-13.0) 0.0
        , q Rel 0.0 (-30.0) 0.0 (-30.0) ]
      wirePath id `shouldEqual`
        [ m Rel 75.0 35.0
        , l Rel 13.0 0.0
        , l Rel 0.0 (-10.0)
        , l Rel 12.0 25.0
        , l Rel (-12.0) 25.0
        , l Rel 0.0 (-10.0)
        , l Rel (-13.0) 0.0
        , q Rel 0.0 0.0 (-50.0) 0.0
        , l Rel (-25.0) 0.0
        , l Rel 0.0 (-30.0)
        , l Rel 25.0 0.0
        , q Rel 0.0 0.0 50.0 0.0
        ]
      wirePath left `shouldEqual`
        [ m Rel 35.0 25.0
        , l Rel 0.0 (-13.0)
        , l Rel (-10.0) 0.0
        , l Rel 25.0 (-12.0)
        , l Rel 25.0 12.0
        , l Rel (-10.0) 0.0
        , l Rel 0.0 13.0
        , q Rel 0.0 40.0 (-40.0) 40.0
        , l Rel (-25.0) 0.0
        , l Rel 0.0 (-30.0)
        , l Rel 25.0 0.0
        , q Rel 10.0 0.0 10.0 (-10.0)
        ]

      wirePath super `shouldEqual`
        [ m Rel 35.0 25.0
        , l Rel 0.0 (-13.0)
        , l Rel (-10.0) 0.0
        , l Rel 25.0 (-12.0)
        , l Rel 25.0 12.0
        , l Rel (-10.0) 0.0
        , l Rel 0.0 13.0
        , q Rel 0.0 10.0 10.0 10.0
        , l Rel 13.0 0.0
        , l Rel 0.0 (-10.0)
        , l Rel 12.0 25.0
        , l Rel (-12.0) 25.0
        , l Rel 0.0 (-10.0)
        , l Rel (-13.0) 0.0
        , q Rel (-10.0) 0.0 (-10.0) 10.0
        , l Rel 0.0 13.0
        , l Rel 10.0 0.0
        , l Rel (-25.0) 12.0
        , l Rel (-25.0) (-12.0)
        , l Rel 10.0 0.0
        , l Rel 0.0 (-13.0)
        , q Rel 0.0 (-10.0) (-10.0) (-10.0)
        , l Rel (-25.0) 0.0
        , l Rel 0.0 (-30.0)
        , l Rel 25.0 0.0
        , q Rel 10.0 0.0 10.0 (-10.0)
        ]
