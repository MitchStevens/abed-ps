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

import Capability.Animate (headShake)
import Capability.Navigate (Route(..), navigateTo)
import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Component.Sidebar.Render (render)
import Control.Monad.State (modify_, put)
import Data.Foldable (for_)
import Data.Int as Int
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Effect.Class.Console (log)
import Halogen (Component, HalogenM, HalogenQ, liftEffect, mkComponent, mkEval)
import Halogen as H
import Web.DOM.ParentNode (QuerySelector(..))
import Web.Event.Event (Event)
import Web.Event.Event as Event
import Web.HTML.HTMLInputElement as HTMLInputElement

component :: forall m. MonadAff m => Component Query Input Output m
component = mkComponent { eval , initialState , render }
  where
  initialState = identity

  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output m
  eval = mkEval
    { finalize: Nothing
    , handleAction: case _ of
        Initialise input -> do
          put (initialState input)
          H.tell BoardSizeSlider.slot unit (BoardSizeSlider.AmendBoardSizeSlider input.boardSize)
        PieceOnDrop piece _ -> do
          H.raise (PieceDropped piece)
        ButtonClicked button _ -> 
          H.raise (ButtonOutput button)
        BoardSizeSliderOutput (BoardSizeSlider.BoardSizeChange { boardSize }) ->
          H.raise (InputFieldOutput (BoardSize boardSize))
        DoNothing -> pure unit
    , handleQuery: case _ of
        AmendBoardSizeSlider size next -> do
          modify_ (_ { boardSize = size })
          headShake (QuerySelector "#sidebar-component .board-size h3")
          pure (Just next)
    , initialize: Nothing
    , receive: Just <<< Initialise
    }

getValueFromEvent :: Event -> Effect (Maybe Number)
getValueFromEvent = 
    (Event.target >=> HTMLInputElement.fromEventTarget) 
      >>> traverse HTMLInputElement.valueAsNumber
