module Component.Feedback where

import Prelude

import Component.CardStack as CardStack
import Data.Array ((!!))
import Data.Array as A
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Foldable (for_, intercalate)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.String as String
import Data.Time.Duration (Milliseconds(..))
import Data.Tuple (Tuple(..))
import Effect.Aff (delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Game.Capacity (Capacity(..), toInt)
import Game.Capacity as Capacity
import Game.Direction (CardinalDirection)
import Game.Level.Completion (CompletionStatus(..), PortMismatch(..))
import Game.Piece (Piece, eval, getPorts)
import Game.Port (Port(..), PortType(..), portCapacity)
import Game.Signal (Base, Signal, SignalRepresentation(..), printSignal)
import Game.TestCase (TestCase, TestCaseData)
import Game.TestCase as TestCase
import Halogen (HalogenM, defaultEval, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Type.Proxy (Proxy(..))

-- | Everything the player needs feedback about: which of the puzzle's
-- | completion states it's in, plus what's needed to build test cards
-- | once it's `ReadyForTesting`. Sidebar owns the canonical copy of
-- | `completionStatus` (from `Level`); this just mirrors it in, rather than
-- | Sidebar deciding whether to mount this at all -- so every state gets a
-- | card, not only `ReadyForTesting`.
type Input =
  { completionStatus :: CompletionStatus
  , base :: Base
  , goal :: Piece
  , testInputs :: NonEmptyArray (Map CardinalDirection Signal)
  }

type State =
  { completionStatus :: CompletionStatus
  , base :: Base
  , goal :: Piece
  , testCases :: Array TestCase
  , currentIndex :: Int
  , testSuiteFailed :: Boolean
  }

testCasesFor :: Piece -> NonEmptyArray (Map CardinalDirection Signal) -> Array TestCase
testCasesFor goal testInputs =
  A.fromFoldable $ testInputs <#> \i ->
    { data: { inputs: i, expected: eval goal i }
    , status: TestCase.NotStarted
    }

initialState :: Input -> State
initialState { completionStatus, base, goal, testInputs } =
  { completionStatus
  , base
  , goal
  , testCases: testCasesFor goal testInputs
  , currentIndex: 0
  , testSuiteFailed: false
  }

currentTestCase :: State -> Maybe TestCase
currentTestCase state = state.testCases !! state.currentIndex

data Query a
  = TestCaseOutcome TestCase.TestCaseOutcome a
  -- | Starts (or, after a failure, restarts) the test run. Nothing calls
  -- | this yet -- it's the entry point a future "run tests"/"retry" card
  -- | action will hit once CardStack grows buttons again.
  | RunTests a

data Action
  = Initialize
  | Receive Input

data Output
  = TestCaseData TestCaseData
  | AllTestsPassed
  | PushCard CardStack.CardContent

slot = Proxy :: Proxy "feedback"

delayBetweenTests :: Milliseconds
delayBetweenTests = Milliseconds 1000.0

-- | Held before `Initialize` does anything else, so the player gets a beat
-- | to see the empty board before feedback appears. Halogen runs one action
-- | to completion before starting the next, so this also holds back
-- | whatever `Receive` would otherwise fire almost immediately after mount
-- | (typically the initial port-mismatch card) -- it just queues behind
-- | `Initialize` and runs right after this delay elapses.
firstCardDelay :: Milliseconds
firstCardDelay = Milliseconds 2000.0

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render: \_ -> HH.text "" }
  where
    eval = mkEval (defaultEval
      { handleAction = handleAction
      , handleQuery = handleQuery
      , receive = Just <<< Receive
      , initialize = Just Initialize
      })

    handleAction :: Action -> HalogenM State Action () Output m Unit
    handleAction = case _ of
      Initialize -> do
        liftAff (delay firstCardDelay)
        pushStatusCard

      Receive input -> do
        previousStatus <- H.gets _.completionStatus
        let entering = input.completionStatus == ReadyForTesting && previousStatus /= ReadyForTesting
        H.modify_ \s -> s
          { completionStatus = input.completionStatus
          , base = input.base
          , goal = input.goal
          , testCases = if entering then testCasesFor input.goal input.testInputs else s.testCases
          , currentIndex = if entering then 0 else s.currentIndex
          , testSuiteFailed = if entering then false else s.testSuiteFailed
          }
        when (input.completionStatus /= previousStatus) pushStatusCard

    handleQuery :: forall a. Query a -> HalogenM State Action () Output m (Maybe a)
    handleQuery = case _ of
      RunTests next -> do
        state <- H.get
        when (state.completionStatus == ReadyForTesting) do
          when state.testSuiteFailed do
            H.modify_ _
              { testCases = map (_ { status = TestCase.NotStarted }) state.testCases
              , currentIndex = 0
              , testSuiteFailed = false
              }
          runCurrentTest
        pure (Just next)

      TestCaseOutcome outcome next -> do
        liftAff (delay delayBetweenTests)
        setCurrentTestStatus (TestCase.Completed outcome)
        pushStatusCard

        case outcome of
          TestCase.Passed -> do
            testSuiteFailed <- H.gets _.testSuiteFailed
            unless testSuiteFailed do
              H.modify_ \s -> s { currentIndex = s.currentIndex + 1 }
              state <- H.get
              case currentTestCase state of
                Just _ -> runCurrentTest
                Nothing -> H.raise AllTestsPassed
          TestCase.Failed _ ->
            H.modify_ _ { testSuiteFailed = true }

        pure (Just next)

    -- Marks the current test in progress, shows its card, and asks
    -- whoever's listening (eventually `Level`, via `Board`) to actually run
    -- it -- this component has no access to the board itself.
    runCurrentTest :: HalogenM State Action () Output m Unit
    runCurrentTest = do
      state <- H.get
      case currentTestCase state of
        Nothing -> H.raise AllTestsPassed
        Just testCase -> do
          setCurrentTestStatus TestCase.InProgress
          pushStatusCard
          H.raise (TestCaseData testCase.data)

    setCurrentTestStatus :: TestCase.TestCaseStatus -> HalogenM State Action () Output m Unit
    setCurrentTestStatus status = H.modify_ \s -> fromMaybe s do
      testCase <- currentTestCase s
      updated <- A.updateAt s.currentIndex (testCase { status = status }) s.testCases
      pure (s { testCases = updated })

    -- The single place a card gets pushed from: whatever `completionStatus`
    -- currently is, keyed on the same rule for both the test-running case
    -- (which test) and every other case (there's only ever one card to
    -- show for those).
    pushStatusCard :: HalogenM State Action () Output m Unit
    pushStatusCard = do
      state <- H.get
      for_ (cardFor state) (H.raise <<< PushCard)

cardFor :: State -> Maybe CardStack.CardContent
cardFor state = case state.completionStatus of
  -- Nothing placed yet: CardStack's own `emptyCard` indentation already
  -- says "nothing to show" -- no need for a redundant card on top of it.
  NotStarted -> Nothing

  FailedRestriction restriction ->
    Just
      { title: "Restriction"
      , statusBar: Nothing
      , text: [ restriction.name, restriction.description ]
      }

  NotEvaluable boardError ->
    Just
      { title: "Not evaluable"
      , statusBar: Nothing
      , text: [ show boardError ]
      }

  PortMismatch mismatch ->
    Just
      { title: "Port mismatch"
      , statusBar: Nothing
      , text: [ describeMismatch mismatch ]
      }

  ReadyForTesting -> testCardFor state <$> currentTestCase state

  Completed ->
    Just
      { title: "Level complete"
      , statusBar: Just { status: CardStack.Success, text: "Solved" }
      , text: [ show (A.length state.testCases) <> " / " <> show (A.length state.testCases) <> " tests passed" ]
      }

describeMismatch :: PortMismatch -> String
describeMismatch = case _ of
  PortExpected { direction, expected } ->
    "You need " <> describePort expected <> " in the " <> show direction <> " direction"
  NoPortExpected { direction } ->
    "Remove the port in the " <> show direction <> " direction"
  IncorrectPortType { direction, expected } ->
    "Port in the " <> show direction <> " direction should be an " <> show expected
  IncorrectCapacity { direction, expected } ->
    "Port in the " <> show direction <> " direction should have capacity " <> show (toInt expected)
  where
    -- simplify description if the capacity is one bit
    describePort :: Port -> String
    describePort (Port { portType, capacity }) =
      if capacity == Capacity.OneBit
        then "an " <> (if portType == Input then "input" else "output")
        else "an " <> (if portType == Input then "input" else "output") <> " of capacity " <> show (toInt capacity)
      

-- | Same shape TestRunner's `cardContentFor` built -- one card per test,
-- | its status pill/lines driven by that test's `TestCaseStatus`.
testCardFor :: State -> TestCase -> CardStack.CardContent
testCardFor state testCase =
  { title: "Test " <> show (state.currentIndex + 1) <> " of " <> show (A.length state.testCases)
  , statusBar: Just { status: cardStatus, text: cardStatusLabel }
  , text: [ "In: " <> formatSignals testCase.data.inputs, "Expected: " <> formatSignals testCase.data.expected ] <> receivedLine <> mismatchLine
  }
  where
  ports = getPorts state.goal
  rep dir = SignalRepresentation state.base (maybe EightBit portCapacity (M.lookup dir ports))

  formatSignals :: Map CardinalDirection Signal -> String
  formatSignals signals =
    intercalate "  " $
      (M.toUnfoldable signals :: Array (Tuple CardinalDirection Signal)) <#> \(Tuple dir signal) ->
        String.take 1 (show dir) <> ": " <> printSignal (rep dir) signal

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
    TestCase.Completed TestCase.Passed -> [ "Received: " <> formatSignals testCase.data.expected ]
    TestCase.Completed (TestCase.Failed { received }) -> [ "Received: " <> formatSignals received ]
    TestCase.NotStarted -> []
    TestCase.InProgress -> []

  mismatchLine = case testCase.status of
    TestCase.Completed (TestCase.Failed _) -> [ "Output does not match expected" ]
    _ -> []
