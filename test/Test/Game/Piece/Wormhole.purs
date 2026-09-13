module Test.Game.Piece.Wormhole where

import Prelude

import Control.Monad.State (evalState, execState)
import Data.Array ((!!))
import Data.Array as A
import Data.Foldable (sequence_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Traversable (traverse)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece (eval)
import Game.Piece.Types (stepPiece, tick)
import Game.Piece.Wormhole (counter, risingEdge)
import Game.Signal (Signal, mkSignal)
import Test.QuickCheck ((===))
import Test.QuickCheck.Gen (arrayOf, chooseInt)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

-- | The wormhole buffer after ticking `counter` `n` times from a zero buffer.
runCounter :: Int -> Map CardinalDirection Signal
runCounter n = execState (sequence_ (A.replicate n (tick counter))) (M.singleton Direction.Down zero)

-- | Feed a sequence of `Left` inputs (0/1) through `risingEdge`, collecting the
-- | `Right` output on each tick.
runRisingEdge :: Array Int -> Array Signal
runRisingEdge bits = map (\o -> fromMaybe zero (M.lookup Direction.Right o)) outs
  where
  outs = evalState
    (traverse (\x -> stepPiece risingEdge (M.singleton Direction.Left (mkSignal x))) bits)
    M.empty

spec :: Spec Unit
spec = describe "Game.Piece.Wormhole" do

  describe "counter" do
    it "buffers the tick count after n ticks" do
      quickCheck do
        n <- chooseInt 0 200
        pure $ M.lookup Direction.Down (runCounter n) === Just (mkSignal n)

    it "buffers the tick count (worked examples)" do
      M.lookup Direction.Down (runCounter 0) `shouldEqual` Just (mkSignal 0)
      M.lookup Direction.Down (runCounter 1) `shouldEqual` Just (mkSignal 1)
      M.lookup Direction.Down (runCounter 10) `shouldEqual` Just (mkSignal 10)

    it "reads the current count on its observable output" do
      let observed n = M.lookup Direction.Left (eval counter (runCounter n))
      observed 0 `shouldEqual` Just (mkSignal 0)
      observed 1 `shouldEqual` Just (mkSignal 1)
      observed 42 `shouldEqual` Just (mkSignal 42)

  describe "risingEdge" do
    it "pulses on a 0->1 transition and is zero otherwise" do
      runRisingEdge [ 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0 ]
        `shouldEqual` map mkSignal [ 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0 ]

    it "is zero when the input is held high (no repeated pulse)" do
      runRisingEdge [ 1, 1, 1, 1, 1 ] `shouldEqual` map mkSignal [ 1, 0, 0, 0, 0 ]

    it "is zero for an all-zero input" do
      runRisingEdge [ 0, 0, 0, 0 ] `shouldEqual` map mkSignal [ 0, 0, 0, 0 ]

    it "matches the reference rising-edge function for arbitrary bit streams" do
      quickCheck do
        bits <- arrayOf (chooseInt 0 1)
        let
          want = mapWithIndex
            (\i x -> if x == 1 && fromMaybe 0 (bits !! (i - 1)) == 0 then one else zero)
            bits
        pure $ runRisingEdge bits === want
