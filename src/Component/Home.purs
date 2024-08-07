module Component.Home where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Component.Layout.DefaultLayout (defaultLayout, defaultLayoutHome)
import Component.Title (abedTitleText)
import Component.Title as Title
import Data.Array (intercalate)
import Data.Array as A
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String.CodeUnits (toCharArray)
import Data.String.CodeUnits as String
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Data.Traversable (foldMap, for, for_)
import Effect (Effect)
import Effect.Aff (Aff, delay, forkAff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Halogen (ClassName(..), HalogenM, HalogenQ, Slot, defaultEval, lift, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (navigationLink)
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS
import Type.Proxy (Proxy(..))

type State =
  { titleText :: String
  }

data Action

type Slots = ( title :: forall q o. Slot q o Unit)

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ =
    { titleText: "" } 

  render _ = defaultLayoutHome $
    HH.h1_
      [ HH.div [ HP.id "home-component" ]
        [ navigationLink "Choose a level" LevelSelect
        , HH.br_
        , navigationLink "How to play" Instructions
        , HH.br_
        , navigationLink "About" About
        ]
      ]


  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval 



