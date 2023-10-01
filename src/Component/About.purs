module Component.About where

import Prelude

import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP


type State = {}

data Action


component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render state =  
    HH.div [ HP.class_ (ClassName "about-component") ]
      [ HH.h1_ [ HH.text "about page" ]
      , HH.text "info goes here"
      ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval