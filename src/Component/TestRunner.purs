module Component.TestRunner
  ( component
  , module Component.TestRunner.Types
  ) where

import Component.TestRunner.Render
import Component.TestRunner.Types
import Prelude

import AppM (AppM)
import Control.Monad.State.Class (gets, modify_)
import Data.Array as A
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens (use, (%=), (.=))
import Data.LimitQueue (LimitQueue)
import Data.LimitQueue as LQ
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Data.Zipper (_head)
import Data.Zipper as Z
import Effect.Aff (delay)
import Effect.Class.Console (log, logShow)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Level.Completion (TestCaseOutcome)
import Game.Port (Port(..), isInput, isOutput, portCapacity)
import Game.Signal (Base, Signal, SignalRepresentation(..), printSignal)
import Halogen (ComponentHTML, HalogenM, defaultEval, lift, liftAff, mkEval)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

component :: H.Component Query Input Output AppM
component = H.mkComponent { eval, initialState, render }
  where
    eval = mkEval (defaultEval
      { handleAction = handleAction
      , handleQuery = handleQuery
      })

    handleAction  :: Action -> HalogenM State Action () Output AppM Unit
    handleAction = case _ of
      RunCurrentTest -> do
        _runNextTestOnPassed .= false
        testCase <- gets (_.testCases >>> Z.head)
        H.raise (TestCaseData testCase.data)
      RunAllTests ->  do
        testCase <- gets (_.testCases >>> Z.head)
        H.raise (TestCaseData testCase.data)
        log "testrunner: run curent test"
      

    handleQuery :: forall a. Query a -> HalogenM State Action () Output AppM (Maybe a)
    handleQuery = case _ of
      TestCaseOutcome outcome next -> do
        _testCases <<< _head %=  (_ { outcome = Just outcome })
        use (_testCases <<< _head) >>= logShow

        when (not outcome.passed) do
          _runNextTestOnPassed .= false
        runNextTestOnPassed <- use _runNextTestOnPassed

        when runNextTestOnPassed do
          liftAff (delay delayBetweenTests)
          gets (_.testCases >>> Z.moveRight) >>= case _ of
            Just testCases' -> do
              _testCases .= testCases'
              handleAction RunAllTests
            Nothing ->
              H.raise AllTestsPassed

        pure (Just next)
          

