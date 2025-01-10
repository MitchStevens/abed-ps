module Component.TestRunner.Types where

import Game.TestCase
import Prelude

import Data.Array ((!!))
import Data.Array as A
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NE
import Data.Generic.Rep (class Generic)
import Data.Lens (Lens', _Just, lens, lens')
import Data.Lens.Record (prop)
import Data.LimitQueue (LimitQueue)
import Data.List (List)
import Data.List as L
import Data.Map (Map)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Show.Generic (genericShow)
import Data.Time.Duration (Milliseconds(..))
import Data.Zipper (currentIndex)
import Game.Direction (CardinalDirection)
import Game.Piece (Piece(..), eval)
import Game.Port (Port(..))
import Game.Signal (Base, Signal)
import Game.TestCase as TestCase
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
  , testSuiteFailed :: Boolean
  }

currentTestCase :: State -> Maybe TestCase
currentTestCase state = state.testCases !! state.currentIndex

isRunning :: State -> Boolean
isRunning state = fromMaybe false do
  testCase <- currentTestCase state
  pure (testCase.status == TestCase.InProgress)

resetTestRunner :: State -> State
resetTestRunner state = 
  state 
    { testCases = map (_ { status = TestCase.NotStarted} ) state.testCases
    , currentIndex = 0
    , testSuiteFailed = false
    }

data Query a
  = TestCaseOutcome TestCaseOutcome a

data Action
  = Receive Input
  | RunCurrentTest
  | RunAllTests

data Output
  = TestCaseData TestCaseData
  | AllTestsPassed

initialState :: Input -> State
initialState { base, inputs, model } =
  { base, model, testCases, currentIndex: 0, testSuiteFailed: false }
  where
    testCases = A.fromFoldable $ flip map inputs \i ->
      { data: { inputs: i, expected: eval model i }
      , status: TestCase.NotStarted
      }

slot = Proxy :: Proxy "testRunner"

_testCases :: Lens' State (Array TestCase)
_testCases = prop (Proxy :: Proxy "testCases")

_currentTestCase :: Lens' State (Maybe TestCase)
_currentTestCase = lens currentTestCase $ \s maybeTestCase -> fromMaybe s do
  testCase <- maybeTestCase
  testCases <- A.updateAt s.currentIndex testCase s.testCases
  pure (s { testCases = testCases})

_testSuiteFailed :: Lens' State Boolean
_testSuiteFailed = prop (Proxy :: Proxy "testSuiteFailed")