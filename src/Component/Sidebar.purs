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

import Capability.Navigate (Route(..), navigateTo)
import Component.Sidebar.Render (render)
import Control.Monad.State (put)
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Halogen (Component, HalogenM, HalogenQ, mkComponent, mkEval)
import Halogen as H

component :: forall m. MonadAff m => Component Query Input Output m
component = mkComponent { eval , initialState , render }
  where
  initialState = identity

  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = mkEval
    { finalize: Nothing
    , handleAction: case _ of
        Initialise input -> put (initialState input)
        PieceOnDrop piece _ -> do
          H.raise (PieceDropped piece)
        ButtonClicked button _ -> H.raise (ButtonOutput button)
        DoNothing -> pure unit
    , handleQuery: \_ -> pure Nothing
    , initialize: Nothing
    , receive: Just <<< Initialise
    }