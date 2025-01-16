module Test.Game.Piece where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, catchError, throwError)
import Data.Array (fold)
import Data.Foldable (for_)
import Data.FoldableWithIndex (allWithIndex, forWithIndex_)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections)
import Game.Piece (Piece(..), eval, getPorts)
import Game.Port (portCapacity)
import Game.Signal (Signal, equivalent)
import Test.Game.Signal (genSignal, shouldBeEquivalentTo)
import Test.QuickCheck (Result, arbitrary, assertEquals)
import Test.QuickCheck.Gen (Gen)
import Test.Spec (Spec, describe)
import Test.Spec.Assertions (fail)

testEval :: forall m. MonadError Error m => Piece -> Map CardinalDirection Signal -> Map CardinalDirection Signal -> m Unit
testEval piece inputs expected = do
  let recieved = eval piece inputs 
  forWithIndex_ (portCapacity <$> getPorts piece) \dir capacity -> 
    case M.lookup dir expected, M.lookup dir recieved of
      Just s1, Just s2 ->
        shouldBeEquivalentTo capacity s1 s2
          `catchError` \e ->
            throwError e *> (fail $ " in direction " <> show dir)

      Nothing, Nothing -> pure unit
      _, _ -> fail "expected"

genSignals :: Gen (Map CardinalDirection Signal)
genSignals = M.fromFoldable <$> for allDirections \dir -> Tuple dir <$> genSignal

equivalentTo :: Piece -> Piece -> Gen Result
equivalentTo p1 p2 = do
  inputs <- genSignals
  pure $ eval p1 inputs `assertEquals` eval p2 inputs

lessThanOrEqTo :: Piece -> Piece -> Gen Boolean
lessThanOrEqTo p1 p2 = do
  inputs <- genSignals
  let outs2 = eval p2 inputs
  pure $ flip allWithIndex (eval p1 inputs) \dir signal ->
    Just signal == M.lookup dir outs2

spec :: Spec Unit
spec = pure unit


