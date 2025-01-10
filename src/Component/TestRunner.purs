module Component.TestRunner
  ( component
  , module Component.TestRunner.Types
  ) where

import Component.TestRunner.Render
import Component.TestRunner.Types
import Prelude

import AppM (AppM)
import Control.Monad.State.Class (get, gets, modify_)
import Data.Array as A
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens (_Just, use, (%=), (.=))
import Data.Lens.Index (ix)
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
import Effect.Aff.Class (class MonadAff)
import Effect.Class.Console (log, logShow)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Level.Completion (TestCaseOutcome)
import Game.Port (Port(..), isInput, isOutput, portCapacity)
import Game.Signal (Base, Signal, SignalRepresentation(..), printSignal)
import Game.TestCase as TestCase
import Halogen (ComponentHTML, HalogenM, defaultEval, lift, liftAff, mkEval)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where
    eval = mkEval (defaultEval
      { handleAction = handleAction
      , handleQuery = handleQuery
      , receive = Just <<< Receive
      })

    handleAction  :: Action -> HalogenM State Action () Output m Unit
    handleAction = case _ of
      Receive input -> do
        modify_ (_ { base = input.base })

      RunAllTests -> do
        whenM (gets (_.testSuiteFailed)) do
          modify_ resetTestRunner
        handleAction RunCurrentTest

      RunCurrentTest -> do
        gets currentTestCase >>= case _ of
          Nothing -> H.raise AllTestsPassed
          Just testCase -> do
            _currentTestCase <<< _Just %= (_ { status = TestCase.InProgress})
            H.raise (TestCaseData testCase.data)
      

    handleQuery :: forall a. Query a -> HalogenM State Action () Output m (Maybe a)
    handleQuery = case _ of
      TestCaseOutcome outcome next -> do
        liftAff (delay delayBetweenTests)
        _currentTestCase <<< _Just %= (_ { status = TestCase.Completed outcome })
        --use _currentTestCase >>= logShow

        case outcome of
          TestCase.Passed -> do
            testSuiteFailed <- gets (_.testSuiteFailed)
            when (not testSuiteFailed) do
              modify_ (\s -> s { currentIndex = s.currentIndex + 1 })
              gets currentTestCase >>= case _ of
                Just testCases' -> do
                  handleAction RunCurrentTest
                Nothing ->
                  H.raise AllTestsPassed
          TestCase.Failed _ -> do
            modify_ (_ { testSuiteFailed = true } )
        
        pure (Just next)