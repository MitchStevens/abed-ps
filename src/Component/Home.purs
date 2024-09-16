module Component.Home where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Component.Layout.DefaultLayout (defaultLayout)
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
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS
import Type.Proxy (Proxy(..))

type State =
  { titleText :: String
  }

data Action
  = NavigateTo Route

type Slots = ( title :: forall q o. Slot q o Unit)

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ =
    { titleText: "" } 

  render state = defaultLayout $
    HH.div [ HP.id "home-component" ]
      [ --HH.slot_ (Proxy :: Proxy "title") unit Title.component { typeTitle: true }
      --, HH.br_
      HH.a 
        [ HE.onClick (\_ -> NavigateTo LevelSelect)
        , HP.class_ (ClassName "link")
        ]
        [ HH.text "Choose a level" ]
      , HH.br_
      , HH.a
        [ HE.onClick (\_ -> NavigateTo Instructions)
        , HP.class_ (ClassName "link")
        ]
        [ HH.text "How to play" ]
      , HH.br_
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
    , initialize = Nothing
    }



