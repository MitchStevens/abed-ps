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
import Capability.Animate (headShake)
import Capability.Animate as Animate
import Capability.Navigate (Route(..), navigateTo)
import Component.DataAttribute as DA
import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Component.Sidebar.Render (render)
import Component.TestRunner as TestRunner
import Control.Monad.State (modify_, put)
import Data.Foldable (for_, traverse_)
import Data.Int as Int
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class.Console (log)
import Game.Level.Completion (CompletionStatus(..))
import Halogen (Component, HalogenM, HalogenQ, liftEffect, mkComponent, mkEval)
import Halogen as H
import Web.DOM.ParentNode (QuerySelector(..))
import Web.Event.Event (Event)
import Web.Event.Event as Event
import Web.HTML.HTMLInputElement as HTMLInputElement

component :: Component Query Input Output AppM
component = mkComponent { eval , initialState , render }
  where

  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output AppM
  eval = mkEval
    { finalize: Nothing
    , handleAction: case _ of
        Receive input -> do
          put (initialState input)
          H.tell BoardSizeSlider.slot unit (BoardSizeSlider.AmendBoardSizeSlider input.boardSize)

          case input.completionStatus of
            FailedValidation { description, locations } ->
              for_ locations \loc -> do
                Animate.headShake (DA.selector DA.location loc) 
            _ -> pure unit

        PieceOnDrop piece _ -> do
          H.raise (PieceDropped piece)
        ButtonClicked button _ -> 
          H.raise (ButtonOutput button)
        BoardSizeSliderAction (BoardSizeSlider.BoardSizeChange { boardSize }) ->
          H.raise (InputFieldOutput (BoardSize boardSize))
        TestRunnerAction output -> H.raise (TestRunnerOutput output)
        DoNothing -> pure unit
    , handleQuery: case _ of
        AmendBoardSizeSlider size next -> do
          modify_ (_ { boardSize = size })
          headShake (QuerySelector "#sidebar-component .board-size h3")
          pure (Just next)
        TestCaseResponse outcome next -> do
          H.tell TestRunner.slot unit (TestRunner.TestCaseOutcome outcome)
          pure (Just next)
    , initialize: Nothing
    , receive: Just <<< Receive
    }

getValueFromEvent :: Event -> Effect (Maybe Number)
getValueFromEvent = 
    (Event.target >=> HTMLInputElement.fromEventTarget) 
      >>> traverse HTMLInputElement.valueAsNumber
--
--      , initialize: Nothing
--      , receive: Just <<< Initialise
--      }
-- >>>>>>> 23f884ca6d049f83b197a624058326ab47ad69b3
