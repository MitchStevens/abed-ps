module Component.TestRunner.Types where

import Game.TestCase
import Prelude

import Data.Array as A
import Data.Array ((!!))
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NE
import Data.Generic.Rep (class Generic)
import Data.Lens (Lens')
import Data.Lens.Record (prop)
import Data.LimitQueue (LimitQueue)
import Data.List (List)
import Data.List as L
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Show.Generic (genericShow)
import Data.Time.Duration (Milliseconds(..))
import Game.Direction (CardinalDirection)
import Game.Piece (Piece(..), eval)
import Game.Port (Port(..))
import Game.Signal (Base, Signal)
import Type.Proxy (Proxy(..))

maxRows = 5
delayBetweenTests = Milliseconds 1000.0

type Input =
  { base :: Base
  , inputs :: NonEmptyArray (Map CardinalDirection Signal)
  , model :: Piece
  }

type State =
  { base :: Base
  , testCases :: Array TestCase
  , currentIndex :: Int
  , model :: Piece
  , runNextTestOnPassed :: Boolean
  }

currentTestCase :: State -> Maybe TestCase
currentTestCase state = state.testCases !! state.currentIndex

data Query a
  = TestCaseOutcome TestCaseOutcome a

data Action
  = Receive Input
  | RunCurrentTest
  | RunAllTests 
  | CurrentTestCaseCompleted TestCaseOutcome

data Output
  = TestCaseData TestCaseData
  | AllTestsPassed

initialState :: Input -> State
initialState { base, inputs, model } =
  { base, model, testCases, currentIndex: 0, runNextTestOnPassed: true }
  where
    testCases = A.fromFoldable $ flip map inputs \i ->
      { data: { inputs: i, expected: eval model i }
      , outcome: Nothing
      }

slot = Proxy :: Proxy "testRunner"

_testCases :: Lens' State (Array TestCase)
_testCases = prop (Proxy :: Proxy "testCases")

_runNextTestOnPassed :: Lens' State Boolean
_runNextTestOnPassed = prop (Proxy :: Proxy "runNextTestOnPassed")


data TestRunnerStage
  = ReadyToRunTests
  | RunningTests
  | RetryCurrentTest
  | RetryingCurrentTest

--testRunnerStage :: State -> TestRunnerStage
--testRunnerStage = 