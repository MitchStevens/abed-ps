module Component.Instructions where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Component.Layout.DefaultLayout (defaultLayout)
import Effect.Aff.Class (class MonadAff)
import Halogen (ClassName(..), Component, HalogenM, HalogenQ)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type State = {}

data Action =
  NavigateTo Route

component :: forall q i o m. MonadAff m => Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render state = 
    defaultLayout $
      HH.div_ 
        [ HH.h1_ [ HH.text "How to play"]
        , HH.h2_ [ HH.text "UNDER CONSTRUCTION!" ]
        , HH.a
          [ HE.onClick (\_ -> NavigateTo About) 
          , HP.class_ (ClassName "link")
          ]
          [ HH.text "About" ]
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval 
    { handleAction = case _ of 
        NavigateTo route -> do 
          navigateTo route 
    }
