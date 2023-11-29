module Test.Main where

import Prelude

import Effect (Effect)
import Effect.Aff (runAff_)
import Game.ProblemDescription as Test.Game
import Halogen as Test
--import Test.Component.Board as Test.Component.Board
--import Test.Game.Board as Test.Game.Board
--import Test.Game.Board.Path as Test.Game.Board.Path
--import Test.Game.Direction as Test.Game.Direction
--import Test.Game.Edge as Test.Game.Edge
--import Test.Game.Expression as Test.Game.Expression
--import Test.Game.GameEvent as Test.Game.GameEvent
--import Test.Game.Location as Test.Game.Location
--import Test.Game.Piece as Test.Game.Piece
--import Test.Game.Piece.WirePiece as Test.Game.Piece.WirePiece
--import Test.Game.Problem as Test.Game.Problem
import Test.Game.Rotation as Test.Game.Rotation
--import Test.Game.RulesEngine as Test.Game.RulesEngine
import Test.Unit (describe, it)
import Test.Unit.Assert (shouldEqual)
import Test.Unit.Output.Fancy (runTest)
  
main :: Effect Unit
main = runAff_ (\_ -> pure unit) $ runTest do
  --describe "Test.Game.Board      "  Test.Game.Board.tests
  --describe "Test.Game.Board.Path "  Test.Game.Board.Path.tests
  --describe "Test.Game.Direction  "  Test.Game.Direction.tests
  --describe "Test.Game.Edge       "  Test.Game.Edge.tests
  --describe "Test.Game.Expression "  Test.Game.Expression.tests
  --describe "Test.Game.GameEvent  "  Test.Game.GameEvent.tests
  --describe "Test.Game.Location   "  Test.Game.Location.tests
  --describe "Test.Game.Piece      "  do
  --  Test.Game.Piece.tests
  --  Test.Game.Piece.WirePiece.tests
  --describe "Test.Game.Problem    "  Test.Game.Problem.tests
  describe "Test.Game.Rotation   "  Test.Game.Rotation.tests
  --describe "Test.Game.RulesEngine"  Test.Game.RulesEngine.tests
