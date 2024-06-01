module Test.Game.Board.Types where

import Prelude

import Data.Array (fold)
import Effect.Class.Console (log)
import Test.Game.Board (testBoard)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Unit.AssertExtra (shouldEqualString)

spec :: Spec Unit
spec = do
  describe "Game.Board.Types" do
    it "class Show" do
      show testBoard `shouldEqualString`
        fold
          [ "+━━━━━━━+━━ 1 ━━+━━━━━━━+\n"
          , "┃       ┃   ∨   ┃       ┃\n"
          , "┃  0,0  ┃  not  ┃  2,0  ┃\n"
          , "┃       ┃   ∨   ┃       ┃\n"
          , "+━━━━━━━+━━ 1 ━━+━━━━━━━+\n"
          , "╹       ╹   ∨   ╹       ╹\n"
          , "1> not >1> and >1> not >1\n"
          , "╻       ╻       ╻       ╻\n"
          , "+━━━━━━━+━━━━━━━+━━━━━━━+\n"
          , "┃       ┃       ┃       ┃\n"
          , "┃  0,2  ┃  1,2  ┃  2,2  ┃\n"
          , "┃       ┃       ┃       ┃\n"
          , "+━━━━━━━+━━━━━━━+━━━━━━━+"
          ]

