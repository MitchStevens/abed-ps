module Game.RulesEngine where

import Prelude

import Control.Alternative (guard)
import Data.Foldable (class Foldable, findMap)
import Data.Maybe (Maybe(..))
import Data.Predicate (Predicate(..))

data Rule a b = Rule (Predicate a) b

runRule :: forall a b. Rule a b -> a -> Maybe b
runRule (Rule (Predicate f) output) input = 
  guard (f input) $> output

runEngine :: forall f a b. Foldable f => f (Rule a b) -> a -> Maybe b
runEngine engine input = findMap (\rule -> runRule rule input) engine
