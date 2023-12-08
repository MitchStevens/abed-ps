module Component.About where

import Prelude

import Capability.Progress (deleteProgress)
import Component.Layout.DefaultLayout (defaultLayout)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Web.HTML (window)
import Web.HTML.Window (confirm, localStorage)
import Web.Storage.Storage (clear)


type State = {}

data Action
  = DeleteProgress
  -- | NavigateTo Route

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render state =  
    defaultLayout $
      HH.div [ HP.class_ (ClassName "about-component") ]
        [ HH.h1_ [ HH.text "about page" ]
        , HH.h2_ [ HH.text "This game created by Mitch Stevens" ]
        , HH.br_
        , HH.text "email here"
        , HH.br_
        , HH.text "Source Code: "
        , HH.a
          [ HP.href "https://github.com/MitchStevens/abed-ps" ]
          [ HH.text "https://github.com/MitchStevens/abed-ps" ]
        , HH.br_
        , HH.button
          [ HE.onClick (\_ -> DeleteProgress ) ]
          [ HH.text "Delete all progress" ] 
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        DeleteProgress -> liftEffect do
          confirmDelete <- window >>= confirm "Really delete all progress?"
          when confirmDelete do
            deleteProgress
    }