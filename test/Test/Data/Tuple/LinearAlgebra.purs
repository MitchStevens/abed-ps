module Test.Data.Tuple.LinearAlgebra where

import Prelude

import Control.Monad.Error.Class (class MonadError)
import Data.Number (abs, pi, pow)
import Data.Tuple (Tuple(..))
import Data.Tuple.LinearAlgebra (Point, dot, rotateBy, translateBy)
import Effect.Exception (Error)
import Game.Rotation (rotation)
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (shouldEqual, shouldSatisfy)

shouldBeCloseTo :: forall m a. MonadError Error m 
  => Point -> Point -> m Unit
shouldBeCloseTo a b = let d = (a - b) in d `dot` d `shouldSatisfy` (_ < epsilon)
  where epsilon = 0.00000000001

spec :: Spec Unit
spec = describeOnly "Linear Algebra" do
  it "translateBy" do
    translateBy (Tuple 0.0 0.0) (Tuple 10.0 20.0) `shouldEqual` Tuple 10.0 20.0
  it "rotateBy" do
    rotateBy (rotation 2) (Tuple 10.0 10.0) `shouldBeCloseTo` Tuple (-10.0) (-10.0)
  it "rotateByAround" do
    rotati