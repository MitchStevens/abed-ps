module Test.Game.Expression where

import Prelude

import Data.Foldable (sequence_, traverse_)
import Data.HeytingAlgebra (ff, tt)
import Data.Int.Bits (shr)
import Data.Map (Map, fromFoldable)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..), uncurry)
import Game.Expression (Expression, Signal(..), evaluate, raw, ref, simplify)
import Game.Direction (CardinalDirection(..))
import Test.Unit (Test, TestSuite, describe, it, test)
import Test.Unit.Assert (shouldEqual)

tests :: TestSuite
tests = do
  describe "Signal" do
    it "show" do
      show (Signal 0)  `shouldEqual` "0000"
      show (Signal 1)  `shouldEqual` "0001"
      show (Signal 15) `shouldEqual` "000f"
      show (Signal 16) `shouldEqual` "0010"
      show (Signal (-1)) `shouldEqual` "ffff"
  describe "Expression" do
    it "simplify" $ traverse_ (uncurry simplifyTest) $
      [ Tuple (raw 0) (raw 0)
      , Tuple (raw 1 || raw 2) (raw 3)
      , Tuple (raw 1 && raw 2) (raw 0)
      , Tuple (ref Up && raw 0) (raw 0)
      ]
    it "evaluate" $ traverse_ (uncurry evaluateTest) $
      [ Tuple (raw 0) (Signal 0)
      , Tuple (ref Up) (Signal 0)
      , Tuple (ref Right) (Signal 1)
      , Tuple (ref Down) (Signal 2)
      , Tuple (ref Right || raw 2) (Signal 3)
      ]

simplifyTest :: Expression -> Expression -> Test
simplifyTest complex expectedSimplification = simplify complex `shouldEqual` expectedSimplification

evaluateTest :: Expression -> Signal -> Test
evaluateTest expression expectedSignal = evaluate stdin expression `shouldEqual` expectedSignal
  where
    stdin = M.fromFoldable
      [ Tuple Up    (Signal 0)
      , Tuple Right (Signal 1)
      , Tuple Down  (Signal 2)
      , Tuple Left  (Signal 4)
      ]