module Component.Home where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type State = {}

data Action = NavigateTo Route

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render state =  
    HH.div [ HP.class_ (ClassName "home-component") ]
      [ HH.h1_ [ HH.text "abed" ]
      , HH.ul
        []
        [ HH.li_
          [ HH.a
            [ HE.onClick (\_ -> NavigateTo PuzzleSelect) ]
            [ HH.text "puzzle select" ]
          ]
        , HH.li_
          [ HH.a
            [ HE.onClick (\_ -> NavigateTo Instructions) ]
            [ HH.text "how to play" ]
          ]
        , HH.li_
          [ HH.a
            [ HE.onClick (\_ -> NavigateTo About) ]
            [ HH.text "about" ]
          ]
        ]

      ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval 
    { handleAction = case _ of 
        NavigateTo route -> do 
          navigateTo route
    }