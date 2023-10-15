module Test.Main where

import Prelude

import Effect (Effect)
import Effect.Aff (runAff_)
import Test.Game.Board              as Test.Game.Board
import Test.Game.Expression         as Test.Game.Expression
import Test.Game.Location           as Test.Game.Location
import Test.Game.Piece              as Test.Game.Piece
import Test.Game.ProblemDescription as Test.Game.ProblemDescription
import Test.Game.RulesEngine        as Test.Game.RulesEngine
import Test.Unit (describe, it)
import Test.Unit.Assert (shouldEqual)
import Test.Unit.Output.Fancy (runTest)
  
main :: Effect Unit
main = runAff_ (\_ -> pure unit) $ runTest do
  describe "Expression tests"           Test.Game.Expression.tests
  describe "Location tests"             Test.Game.Location.tests
  describe "Piece tests"                Test.Game.Piece.tests
  describe "Board tests"                Test.Game.Board.tests
  describe "ProblemDescription tests"   Test.Game.ProblemDescription.tests
  describe "Rules Engine tests"         Test.Game.RulesEngine.tests

  --describe "Better Piece" do
  --  it "test1" $ eval SimpleNegate { left: true } `shouldEqual` { right: false }
  --  it "test1" $ eval SimpleNegate { left: true } `shouldEqual` { right: false }
  --  pure unit
