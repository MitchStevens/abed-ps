module Test.Game.Piece where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Error.Class (class MonadError, class MonadThrow, catchError, throwError)
import Data.Array (fold)
import Data.Array as A
import Data.Foldable (find, for_)
import Data.FoldableWithIndex (allWithIndex, forWithIndex_)
import Data.Functor (($>))
import Data.FunctorWithIndex (mapWithIndex)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections)
import Game.Piece (Piece(..), eval, getPorts, name, truncateInputs)
import Game.Port (portCapacity)
import Game.Signal (Signal, equivalent)
import Test.Game.Signal (genSignal, shouldBeEquivalentTo)
import Test.QuickCheck (Result(..), arbitrary, assertEquals, withHelp)
import Test.QuickCheck.Gen (Gen)
import Test.Spec (Spec, describe)
import Test.Spec.Assertions (fail)
import Text.Printf (printf)
import Type.Proxy (Proxy(..))

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

lessThanOrEqTo :: Piece -> Piece -> Gen Result
lessThanOrEqTo p1 p2 = do
  inputs <- truncateInputs p1 <$> genSignals
  let outs1 = eval p1 inputs
  let outs2 = eval p2 inputs
  let le = flip allWithIndex outs1 \dir signal ->
         Just signal == M.lookup dir outs2

  if le
    then pure $ Success
    else pure $ Failed $ show { p1, p2, inputs, outs1, outs2 }