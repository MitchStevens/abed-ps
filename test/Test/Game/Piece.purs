module Test.Game.Piece where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, catchError, throwError)
import Data.Array (fold)
import Data.Foldable (for_)
import Data.FoldableWithIndex (forWithIndex_)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections)
import Game.Piece (Piece(..), eval, getPorts)
import Game.Port (portCapacity)
import Game.Signal (Signal, equivalent)
import Test.Game.Signal (shouldBeEquivalentTo)
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



spec :: Spec Unit
spec = pure unit


