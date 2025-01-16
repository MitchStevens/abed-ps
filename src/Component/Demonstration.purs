module Component.Demonstration where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Game.Level.Demonstration (Demonstration)
import Halogen (ClassName(..), Component, HalogenM, HalogenQ, ComponentHTML, defaultEval, mkComponent, mkEval, modify_)
import Halogen as H
import Halogen.HTML (fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))

type Input = Demonstration

type State =
  { demonstration :: Demonstration
  , isShowing :: Boolean
  }

data Query a = OpenDemonstration a | CloseDemonstration a

data Action = CloseButton

type Output = Void

component :: forall m. MonadAff m => Component Query Input Output m
component = mkComponent { initialState, eval, render }
  where
    initialState :: Input -> State
    initialState  demonstration = { demonstration, isShowing: false }

    eval :: HalogenQ Query Action Input ~> HalogenM State Action () Output m
    eval = mkEval $ defaultEval
      { handleQuery = case _ of
        OpenDemonstration next -> do
          modify_ (_ { isShowing = true}) 
          pure (Just next)
        CloseDemonstration next -> do
          modify_ (_ { isShowing = false}) 
          pure (Just next)
      , handleAction = case _ of
          CloseButton -> modify_ (_ { isShowing = false}) 
      }

    render :: State -> ComponentHTML Action () m
    render state =
      if state.isShowing
        then
          HH.div
            [ HP.id "demonstration-component" ]
            [ HH.div_
              [ HH.h2_ [ HH.text state.demonstration.title ]
              , fromPlainHTML state.demonstration.html 
              , HH.button
                [ HE.onClick (\_ -> CloseButton) ]
                [ HH.text "Close demonstration" ]
              ]
            , HH.div [ HP.class_ (ClassName "parchment")] []
            ]
        else HH.text ""

slot = Proxy :: Proxy "demonstration"