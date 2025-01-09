module Component.TestRunner.Types where

import Prelude

import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NE
import Data.Generic.Rep (class Generic)
import Data.Lens (Lens')
import Data.Lens.Record (prop)
import Data.LimitQueue (LimitQueue)
import Data.List (List)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Show.Generic (genericShow)
import Data.Time.Duration (Milliseconds(..))
import Data.Zipper (Zipper)
import Game.Direction (CardinalDirection)
import Game.Piece (Piece(..), eval)
import Game.Port (Port(..))
import Game.Signal (Base, Signal)
import Type.Proxy (Proxy(..))
import Game.TestCase

maxRows = 5
delayBetweenTests = Milliseconds 1000.0

type Input =
  { base :: Base
  , inputs :: NonEmptyArray (Map CardinalDirection Signal)
  , model :: Piece
  }

type State =
  { base :: Base
  , testCases :: Zipper TestCase
  , model :: Piece
  , runNextTestOnPassed :: Boolean
  }

data Query a
  = TestCaseOutcome TestCaseOutcome a


data Action
  = Receive Input
  | RunSingleTest
  | RunAllTests 
  | CurrentTestCaseCompleted TestCaseOutcome

data Output
  = TestCaseData TestCaseData
  | AllTestsPassed

initialState :: Input -> State
initialState { base, inputs, model } =
  { base, model, testCases, runNextTestOnPassed: true }
  where
    testCases = NE.toUnfoldable1 $ flip map inputs \i ->
      { data: { inputs: i, expected: eval model i }
      , outcome: Nothing
      }

slot = Proxy :: Proxy "testRunner"

_testCases :: Lens' State (Zipper TestCase)
_testCases = prop (Proxy :: Proxy "testCases")

_runNextTestOnPassed :: Lens' State Boolean
_runNextTestOnPassed = prop (Proxy :: Proxy "runNextTestOnPassed")