module Component.HowToPlay where

import Prelude

import AppM (AppM)
import Capability.Navigate (InstructionPage(..), Route(..), navigateTo)
import Capability.Navigate as Navigate
import Component.Layout.DefaultLayout (defaultLayout)
import Effect.Class (class MonadEffect)
import Halogen (ClassName(..), ComponentHTML, HalogenM, HalogenQ)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type State = Unit

data Action
  = NavigateTo Route

component :: forall q i o. H.Component q i o AppM
component = H.mkComponent { eval, initialState, render }
  where
  initialState _ = unit

  render :: forall s. State -> ComponentHTML Action s AppM
  render _ = defaultLayout $
    HH.div
      [ HP.id "how-to-play-component" ]
      [ HH.h1_ [ HH.text "How to play" ]
      , HH.nav
          [ HP.class_ (ClassName "menu") ]
          [ menuItem (Instructions Navigate.Wire) "Wire" "Carrying signals around the board" ]
      ]
    where
    menuItem route label description =
      HH.a
        [ HE.onClick (\_ -> NavigateTo route)
        , HP.class_ (ClassName "menu-item")
        ]
        [ HH.span [ HP.class_ (ClassName "menu-label") ] [ HH.text label ]
        , HH.span [ HP.class_ (ClassName "menu-description") ] [ HH.text description ]
        ]

  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o AppM
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        NavigateTo route -> H.lift $ navigateTo route
    }
