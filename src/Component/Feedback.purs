module Component.Feedback where

import Prelude

import Component.CardStack as CardStack
import Component.TestCard as TestCard
import Data.Array ((!!))
import Data.Array as A
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Time.Duration (Milliseconds(..))
import Data.Tuple (Tuple(..))
import Effect.Aff (delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Game.Capacity (toInt)
import Game.Capacity as Capacity
import Game.Direction (CardinalDirection)
import Game.Level.Completion (CompletionStatus(..), PortMismatch(..))
import Game.Level.MismatchDemonstration (mismatchDemonstration)
import Game.Piece (Piece, eval)
import Game.Port (Port(..), PortType(..))
import Game.Signal (Base, Signal)
import Game.TestCase (TestCase, TestCaseData)
import Game.TestCase as TestCase
import Halogen (ClassName(..), ComponentHTML, HalogenM, defaultEval, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Elements.Keyed as HK
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
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
  -- | Which test's card is currently on screen, if any -- `Nothing` for a
  -- | non-test card (restriction/mismatch/complete) or nothing shown yet.
  -- | `statusCard` compares this against the test it's about to show to
  -- | decide `ReplaceCard` (same test, further along) vs `PushCard`
  -- | (anything else) -- see its comment.
  , shownTestIndex :: Maybe Int
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
  , shownTestIndex: Nothing
  }

currentTestCase :: State -> Maybe TestCase
currentTestCase state = state.testCases !! state.currentIndex

-- | True once the suite is sitting at its very start, untouched -- the
-- | state in which the button below the cards reads "Start testing"
-- | rather than "Retry all".
notYetStarted :: State -> Boolean
notYetStarted state =
  state.currentIndex == 0 && A.all (\tc -> tc.status == TestCase.NotStarted) state.testCases

data Query a
  = TestCaseOutcome TestCase.TestCaseOutcome a

-- | `RunAllTests` drives both the initial "Start testing" button and the
-- | post-failure "Retry all" button -- resetting every test back to
-- | `NotStarted` is a no-op the first time round, so one action covers
-- | both.  `RetryCurrentTest` only clears the failure flag and reruns the
-- | test sitting at `currentIndex`, leaving earlier passes alone; if it
-- | passes this time the usual `TestCaseOutcome` handling chains on into
-- | whatever tests are left.
data Action
  = Initialize
  | Receive Input
  | RunAllTests
  | RetryCurrentTest
  | GoToLevelSelect

data Output
  = TestCaseData TestCaseData
  | AllTestsPassed
  | PushCard CardStack.CardContent
  -- | Same shape as `PushCard`, for a card that's the same test further
  -- | along rather than something new -- see `statusCard`.
  | ReplaceCard CardStack.CardContent
  -- | Raised when the player clicks the post-completion "back to level
  -- | select" button -- `Level` owns navigation, so this just asks for it.
  | ReturnToLevelSelect

slot = Proxy :: Proxy "feedback"

delayBetweenTests :: Milliseconds
delayBetweenTests = Milliseconds 1000.0

-- | Held after a test resolves to a pass, on top of `delayBetweenTests`
-- | above, before the suite moves on -- without it the verdict seal
-- | (`Component.TestCard`) lands and the next test's card replaces it in
-- | the same tick, so the very thing meant to make a pass obvious never
-- | actually gets seen. Longer than the seal's own 450ms entrance
-- | (`test-seal-slam`) so the suite doesn't move on right as it settles --
-- | there needs to be a beat where it's actually just sitting there passed.
resultHoldDelay :: Milliseconds
resultHoldDelay = Milliseconds 900.0

-- | Held before `Initialize` does anything else, so the player gets a beat
-- | to see the empty board before feedback appears. Halogen runs one action
-- | to completion before starting the next, so this also holds back
-- | whatever `Receive` would otherwise fire almost immediately after mount
-- | (typically the initial port-mismatch card) -- it just queues behind
-- | `Initialize` and runs right after this delay elapses.
firstCardDelay :: Milliseconds
firstCardDelay = Milliseconds 2000.0

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
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
        -- _ <- H.fork (liftAff (delay firstCardDelay) *> pushStatusCard)
        pure unit

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
          , shownTestIndex = if entering then Nothing else s.shownTestIndex
          }
        when (input.completionStatus /= previousStatus) statusCard

      RunAllTests -> do
        state <- H.get
        when (state.completionStatus == ReadyForTesting) do
          H.modify_ _
            { testCases = map (_ { status = TestCase.NotStarted }) state.testCases
            , currentIndex = 0
            , testSuiteFailed = false
            }
          runCurrentTest

      RetryCurrentTest -> do
        state <- H.get
        when (state.completionStatus == ReadyForTesting) do
          H.modify_ _ { testSuiteFailed = false }
          runCurrentTest

      GoToLevelSelect ->
        H.raise ReturnToLevelSelect

    handleQuery :: forall a. Query a -> HalogenM State Action () Output m (Maybe a)
    handleQuery = case _ of
      TestCaseOutcome outcome next -> do
        liftAff (delay delayBetweenTests)
        setCurrentTestStatus (TestCase.Completed outcome)
        statusCard

        case outcome of
          TestCase.Passed -> do
            testSuiteFailed <- H.gets _.testSuiteFailed
            unless testSuiteFailed do
              liftAff (delay resultHoldDelay)
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
          statusCard
          H.raise (TestCaseData testCase.data)

    setCurrentTestStatus :: TestCase.TestCaseStatus -> HalogenM State Action () Output m Unit
    setCurrentTestStatus status = H.modify_ \s -> fromMaybe s do
      testCase <- currentTestCase s
      updated <- A.updateAt s.currentIndex (testCase { status = status }) s.testCases
      pure (s { testCases = updated })

    -- The single place a card gets shown from: whatever `completionStatus`
    -- currently is, keyed on the same rule for both the test-running case
    -- (which test) and every other case (there's only ever one card to
    -- show for those). Also decides `PushCard` vs `ReplaceCard` itself,
    -- rather than trusting each call site to know which applies: compares
    -- the test (if any) the on-screen card already belongs to against the
    -- one about to be shown. Same test means "further along" (pending ->
    -- running -> passed/failed), so it replaces in place; anything else --
    -- a different test, no test at all, or nothing shown yet -- pushes a
    -- new card. This is what makes "Retry all" correctly push a fresh card
    -- for test 1 instead of overwriting whatever later test's failure card
    -- happened to be on screen, while "Retry test N" or a test simply
    -- finishing both replace the same card they already showed.
    statusCard :: HalogenM State Action () Output m Unit
    statusCard = do
      state <- H.get
      for_ (cardFor state) \content -> do
        let targetIndex = if state.completionStatus == ReadyForTesting then Just state.currentIndex else Nothing
        H.raise (if state.shownTestIndex == targetIndex then ReplaceCard content else PushCard content)
        H.modify_ _ { shownTestIndex = targetIndex }

-- | The only thing this component actually renders: whatever buttons
-- | belong below the card stack for the current state -- nothing while a
-- | test is in flight, "start"/"retry" while the player has work to
-- | trigger, and a way back to level select once the suite's done. The
-- | cards themselves are pushed into `Sidebar`'s own `CardStack` slot (see
-- | `pushStatusCard`), not rendered here.
-- |
-- | Keyed on each button's label (see `.test-control-button`'s CSS entrance
-- | animation, timed to land alongside the card's own): a button going
-- | from absent to present -- the only time it should play that animation
-- | -- is always a fresh key appearing, since the label it had last time
-- | around (if any) was already removed from the keyed list by whatever
-- | in-between render made this row empty (a test running, or a fresh
-- | card taking over). Reusing the same label across two renders that are
-- | both non-empty patches the existing node in place instead, correctly
-- | skipping the animation when nothing actually changed.
render :: forall m. State -> ComponentHTML Action () m
render state =
  HK.div
    [ HP.class_ (ClassName "test-controls") ]
    (buttonsFor state)
  where
  buttonsFor s = case s.completionStatus of
    ReadyForTesting -> case currentTestCase s of
      Nothing -> []
      Just testCase
        | testCase.status == TestCase.InProgress -> []
        | s.testSuiteFailed ->
            [ button RetryCurrentTest ("Retry test " <> show (s.currentIndex + 1))
            , button RunAllTests "Retry all"
            ]
        | notYetStarted s -> [ button RunAllTests "Start testing" ]
        | otherwise -> []
    Completed -> [ button GoToLevelSelect "Back to level select" ]
    _ -> []

  button action label =
    Tuple label $
      HH.button
        [ HP.class_ (ClassName "test-control-button")
        , HE.onClick (\_ -> action)
        ]
        [ HH.text label ]

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
      , diagram: Nothing
      , demonstration: Nothing
      }

  NotEvaluable boardError ->
    Just
      { title: "Not evaluable"
      , statusBar: Nothing
      , text: [ show boardError ]
      , diagram: Nothing
      , demonstration: Nothing
      }

  PortMismatch mismatch ->
    Just
      { title: "Port mismatch"
      , statusBar: Nothing
      , text: [ describeMismatch mismatch ]
      , diagram: Nothing
      , demonstration: mismatchDemonstration mismatch
      }

  ReadyForTesting -> testCardFor state <$> currentTestCase state

  Completed ->
    Just
      { title: "Level complete"
      , statusBar: Just { status: CardStack.Success, text: "Solved" }
      , text: [ show (A.length state.testCases) <> " / " <> show (A.length state.testCases) <> " tests passed" ]
      , diagram: Nothing
      , demonstration: Nothing
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
      

-- | The card's diagram + read-out (see `Component.TestCard`) instead of
-- | plain text rows. `instanceKey` is the test's own 1-based number --
-- | stable across its whole pending -> running -> passed/failed lifecycle
-- | (see `statusCard`, which replaces this same card in place through all
-- | of that), and distinct from whatever other test cards happen to be
-- | mounted alongside it in the stack's history.
testCardFor :: State -> TestCase -> CardStack.CardContent
testCardFor state testCase =
  TestCard.testCardContent
    { instanceKey: show (state.currentIndex + 1)
    , base: state.base
    , goal: state.goal
    , testCase
    , index: state.currentIndex + 1
    , total: A.length state.testCases
    }
