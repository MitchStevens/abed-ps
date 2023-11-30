module Test.Game.Expression where

import Prelude

import Data.Foldable (sequence_, traverse_)
import Data.HeytingAlgebra (ff, tt)
import Data.Int.Bits (shr)
import Data.Map (Map, fromFoldable)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..), uncurry)
import Game.Direction (CardinalDirection(..))
import Game.Expression (Expression, evaluate, raw, ref, simplify)
import Game.Signal (Signal(..))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec = do
  describe "Expression" do
    --describe "matchingRelativeEdge" do
    --  it "" $
    --    matchingRelativeEdge (relative (location 0 1) Direction.Left) `shouldReturn` (relative (location (-1) 1) Direction.Right)
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

simplifyTest complex expectedSimplification = simplify complex `shouldEqual` expectedSimplification

evaluateTest expression expectedSignal = evaluate stdin expression `shouldEqual` expectedSignal
  where
    stdin = M.fromFoldable
      [ Tuple Up    (Signal 0)
      , Tuple Right (Signal 1)
      , Tuple Down  (Signal 2)
      , Tuple Left  (Signal 4)
      ]