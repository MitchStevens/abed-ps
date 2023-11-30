module Test.Main where

import Prelude

import Effect (Effect)
import Effect.Aff (runAff_)
import Halogen as Test
import Test.Component.Board as Test.Component.Board
import Test.Game.Board as Test.Game.Board
import Test.Game.Board.Path as Test.Game.Board.Path
import Test.Game.Expression as Test.Game.Expression
import Test.Game.GameEvent as Test.Game.GameEvent
import Test.Game.Location as Test.Game.Location
import Test.Game.Piece as Test.Game.Piece
import Test.Game.Level.Problem as Test.Game.Level.Problem
import Test.Unit (describe, it)
import Test.Unit.Assert (shouldEqual)
import Test.Unit.Output.Fancy (runTest)
  
main :: Effect Unit
main = runAff_ (\_ -> pure unit) $ runTest do
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