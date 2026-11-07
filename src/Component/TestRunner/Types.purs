module Component.TestRunner.Types where

import Game.TestCase
import Prelude

import Component.CardStack as CardStack
import Data.Array ((!!))
import Data.Array as A
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NE
import Data.Foldable (intercalate)
import Data.Generic.Rep (class Generic)
import Data.Lens (Lens', _Just, lens, lens')
import Data.Lens.Record (prop)
import Data.LimitQueue (LimitQueue)
import Data.List (List)
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Show.Generic (genericShow)
import Data.String as String
import Data.Time.Duration (Milliseconds(..))
import Data.Tuple (Tuple(..), snd)
import Data.Zipper (currentIndex)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection, allDirections)
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Piece (Piece(..), eval, getPorts)
import Game.Port (Port, hasPort, isInput, isOutput, portCapacity)
import Game.Signal (Base, Signal, SignalRepresentation(..), printSignal)
import Game.TestCase as TestCase
import Halogen (Slot)
import Type.Proxy (Proxy(..))

maxRows = 5
delayBetweenTests = Milliseconds 1000.0

type Input =
  { base :: Base
  , inputs :: NonEmptyArray (Frame Signal)
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
  | CardActionTriggered String a

data Action
  = Initialize
  | Receive Input
  | RunCurrentTest
  | RunAllTests

-- | TestRunner is now render-less (see `Render.render`) -- `CardStack` is
-- | slotted directly into `Sidebar` instead, so what used to be an internal
-- | `H.tell` to a child is now a raised `Output` that `Sidebar` forwards on.
data Output
  = TestCaseData TestCaseData
  | AllTestsPassed
  | PushCard CardStack.CardContent

-- Card action ids TestRunner hands to CardStack and interprets back via
-- `CardActionTriggered` -- opaque to CardStack itself.
--
-- NOTE: CardStack no longer renders any buttons on its cards (its Action
-- is just ViewPreviousCard/ViewNextCard, and Output carries nothing), so
-- nothing currently triggers a `CardActionTriggered` query -- this id/query
-- plumbing is dead until CardStack grows a way to raise these back up.
runAllTestsActionId :: String
runAllTestsActionId = "run-all"

rerunCurrentTestActionId :: String
rerunCurrentTestActionId = "rerun-current"

retryAllTestsActionId :: String
retryAllTestsActionId = "retry-all"

-- | The `CardStack` sees only what's needed to draw the current test as a
-- | card; keying on `currentIndex` means pushing the same index again (a
-- | status change within one test) patches in place, while a new index
-- | mounts fresh and replays the fade-in.
cardContentFor :: State -> TestCase -> CardStack.CardContent
cardContentFor state testCase =
  { title: "Test " <> show (state.currentIndex + 1) <> " of " <> show (A.length state.testCases)
  , statusBar: Just { status: cardStatus, text: cardStatusLabel }
  , text: [ "In: " <> formatSignals isInput testCase.data.inputs, "Expected: " <> formatSignals isOutput testCase.data.expected ] <> receivedLine <> mismatchLine
  , diagram: Nothing
  , demonstration: Nothing
  }
  where
    ports = getPorts state.model
    rep dir = SignalRepresentation state.base (maybe EightBit portCapacity (Frame.lookupWhere hasPort dir ports))

    -- a `Frame` has a signal on every side, so which sides to show comes
    -- from the model's ports: its inputs for a test's `inputs`, the sides it
    -- writes for `expected`/`received`.
    formatSignals :: (Port -> Boolean) -> Frame Signal -> String
    formatSignals shown signals =
      intercalate "  " $
        (A.filter (\dir -> shown (Frame.index dir ports)) allDirections) <#> \dir ->
          String.take 1 (show dir) <> ": " <> printSignal (rep dir) (Frame.index dir signals)

    cardStatus = case testCase.status of
      TestCase.NotStarted -> CardStack.Pending
      TestCase.InProgress -> CardStack.Active
      TestCase.Completed TestCase.Passed -> CardStack.Success
      TestCase.Completed (TestCase.Failed _) -> CardStack.Failure

    cardStatusLabel = case testCase.status of
      TestCase.NotStarted -> "Pending"
      TestCase.InProgress -> "Running..."
      TestCase.Completed TestCase.Passed -> "Passed"
      TestCase.Completed (TestCase.Failed _) -> "Failed"

    receivedLine = case testCase.status of
      TestCase.Completed TestCase.Passed -> [ "Received: " <> formatSignals isOutput testCase.data.expected ]
      TestCase.Completed (TestCase.Failed { received }) -> [ "Received: " <> formatSignals isOutput received ]
      _ -> []

    mismatchLine = case testCase.status of
      TestCase.Completed (TestCase.Failed _) -> [ "Output does not match expected" ]
      _ -> []

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