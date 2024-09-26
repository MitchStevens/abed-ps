module Component.Sidebar 
  ( component
  , module Component.Sidebar.Types 
  ) 
where
{-
  responsible for:
  - description of level
  - confirming that piece fits the port spec
  - starting single tests
  - running randomised tests 
  - exiting level
-}

import Component.Sidebar.Types
import Prelude

import AppM (AppM)
import Component.DataAttribute (completionStatus)
import Component.Sidebar.Render (render)
import Component.TestRunner as TestRunner
import Control.Monad.State (modify_, put)
import Data.Lens ((.=))
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Game.Level.Completion (CompletionStatus(..))
import Halogen (Component, HalogenM, HalogenQ, mkComponent, mkEval)
import Halogen as H

component :: Component Query Input Output AppM
component = mkComponent { eval , initialState , render }
  where
    eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output AppM
    eval = mkEval
      { finalize: Nothing
      , handleAction: case _ of
          Initialise input -> put (initialState input)
          PieceOnDrop piece _ -> do
            H.raise (PieceDropped piece)
          ButtonClicked button _ -> do
            when (button == RunTests) do
              _completionStatus .= ReadyForTesting
            H.raise (ButtonOutput button)
          TestRunnerOutput testRunnerOutput -> case testRunnerOutput of
            TestRunner.TestCaseData testCaseData ->
              H.raise (RunTestCase testCaseData)
            TestRunner.AllTestsPassed -> do
              modify_ $ _ { completionStatus = Completed }
          DoNothing -> pure unit
      , handleQuery: case _ of
          TestCaseOutcome testCaseOutcome next -> do
            H.tell TestRunner.slot unit (TestRunner.TestCaseOutcome testCaseOutcome)
            pure (Just next)

      , initialize: Nothing
      , receive: Just <<< Initialise
      }