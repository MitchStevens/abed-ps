module Test.Main where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_, runAff_)
import Halogen as Test
import Test.Spec.Discovery (discover)
import Test.Spec.Reporter as Reporter
import Test.Spec.Runner (runSpec)

main :: Effect Unit
main = launchAff_ $
  discover "Test.*" >>= runSpec [ Reporter.specReporter ]
{-
runAff_ (\_ -> pure unit) $ runTest do
  describe "Expression tests"           Test.Game.Expression.tests
  --describe "Location tests"             Test.Game.Location.tests
  --describe "Piece tests"                Test.Game.Piece.tests
  --describe "Board tests"                Test.Game.Board.tests
  --describe "Path"                       Test.Game.Board.Path.tests
  --describe "ProblemDescription tests"   Test.Game.ProblemDescription.tests
  --describe "Rules Engine tests"         Test.Game.RulesEngine.tests
  --describe "Game Event Tests"           Test.Game.GameEvent.tests
  --describe "Component tests" do
  --  Test.Component.Board.tests