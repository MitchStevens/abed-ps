module Component.TestRunner
  ( component
  , module Component.TestRunner.Types
  ) where

import Component.TestRunner.Render
import Component.TestRunner.Types
import Prelude

import Control.Monad.State.Class (modify_)
import Data.Array as A
import Data.FunctorWithIndex (mapWithIndex)
import Data.LimitQueue (LimitQueue)
import Data.LimitQueue as LQ
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Level.Completion (TestCaseOutcome)
import Game.Port (Port(..), isInput, isOutput, portCapacity)
import Game.Signal (Base, Signal, SignalRepresentation(..), printSignal)
import Halogen (ComponentHTML, defaultEval, mkEval)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

component :: forall m. H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where
    eval = mkEval (defaultEval)

