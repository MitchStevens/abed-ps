module Test.Component.Board where

import Prelude

import Component.Board as Board
import Data.Maybe (Maybe(..))
--import Test.Component.Utils (mountComponent)
import Test.Unit (TestSuite, describe, it)


tests :: TestSuite
tests = do
  pure unit
  --describe "component" do
  --  it "initialisation" do
  --    _ <- mountComponent Board.component Nothing
  --    pure unit