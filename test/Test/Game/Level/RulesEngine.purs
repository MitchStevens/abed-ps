module Test.Game.Level.RulesEngine where

import Prelude

import Data.HeytingAlgebra (ff, tt)
import Data.Int (even)
import Data.Maybe (Maybe(..))
import Data.Predicate (Predicate(..))
import Game.Level.RulesEngine (Rule(..), runEngine, runRule)
import Test.Unit (TestSuite, describe, it)
import Test.Unit.Assert (shouldEqual)

evenOnly :: Predicate Int
evenOnly = Predicate even

multipleOf :: Int -> Predicate Int
multipleOf n = Predicate \x -> x `mod` n == 0

tests :: TestSuite
tests = do
  describe "Rule" do
    it "should return nothing for false" $
      runRule (Rule ff unit) 42 `shouldEqual` Nothing
    it "should return unit for true" $
      runRule (Rule tt unit) 42 `shouldEqual` Just unit
    it "should evaluate rules" do
      runRule (Rule evenOnly unit) 42 `shouldEqual` Just unit
      runRule (Rule evenOnly unit) 41 `shouldEqual` Nothing
      runRule (Rule (multipleOf 2) unit) 42 `shouldEqual` Just unit
      runRule (Rule (multipleOf 3) unit) 42 `shouldEqual` Just unit
      runRule (Rule (multipleOf 4) unit) 42 `shouldEqual` Nothing
    it "should negate rules" do
      runRule (Rule (not evenOnly) unit) 42 `shouldEqual` Nothing
      runRule (Rule (not (not evenOnly)) unit) 42 `shouldEqual` Just unit
    it "should || rules" do
      runRule (Rule (multipleOf 2 || multipleOf 3) unit) 39 `shouldEqual` Just unit
      runRule (Rule (multipleOf 2 || multipleOf 3) unit) 40 `shouldEqual` Just unit
      runRule (Rule (multipleOf 2 || multipleOf 3) unit) 41 `shouldEqual` Nothing
      runRule (Rule (multipleOf 2 || multipleOf 3) unit) 42 `shouldEqual` Just unit
    it "should && rules" do
      runRule (Rule (multipleOf 2 && multipleOf 3) unit) 39 `shouldEqual` Nothing
      runRule (Rule (multipleOf 2 && multipleOf 3) unit) 40 `shouldEqual` Nothing
      runRule (Rule (multipleOf 2 && multipleOf 3) unit) 41 `shouldEqual` Nothing
      runRule (Rule (multipleOf 2 && multipleOf 3) unit) 42 `shouldEqual` Just unit
  describe "RulesEngine" do
    let engine = [ Rule evenOnly "even", Rule (multipleOf 3) "multiple of 3"]
    it "should combine rules" do
      runEngine engine 39 `shouldEqual` Just "multiple of 3"
      runEngine engine 40 `shouldEqual` Just "even"
      runEngine engine 41 `shouldEqual` Nothing
      runEngine engine 42 `shouldEqual` Just "even"

