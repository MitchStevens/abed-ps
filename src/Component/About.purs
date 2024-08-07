module Component.About where

import Prelude

import Capability.LocalStorage (deleteProgress)
import Capability.LocalStorage.LevelProgress (LevelProgress(..))
import Capability.Navigate (navigateTo, routeSlug)
import Component.Layout.DefaultLayout (defaultLayout)
import Control.Monad.Reader (class MonadAsk)
import Data.Foldable (for_)
import Data.Log.Level (LogLevel(..))
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Game.Level (Level(..))
import Game.Level.Suite (LevelId(..))
import GlobalState (GlobalState)
import GlobalState as GlobalState
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (navigationLink)
import Halogen.HTML.Properties as HP
import Resources.LevelSuites (allLevelSuites)
import Web.HTML (window)
import Web.HTML.Window (confirm, localStorage)
import Web.Storage.Storage (clear)


type State = { logLevel :: LogLevel }

data Action
  = DeleteProgress
  | UnlockAll

component :: forall q i o m. MonadAsk GlobalState m => MonadAff m =>
  H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { logLevel: Debug } 

  render { logLevel } =  
    defaultLayout $
      HH.div [ HP.class_ (ClassName "about-component") ]
        [ HH.h1_ [ HH.text "About" ]
        , HH.h2_ [ HH.text "This game created by Mitch Stevens" ]
        , HH.br_
        , HH.text "email me at "
        , HH.b_ [ HH.text "mitchstevens 95 at gmail dot com" ]
        , HH.br_
        , HH.text "Source Code: "
        , HH.a
          [ HP.href "github.com/MitchStevens/abed-ps" ]
          [ HH.text "https://github.com/MitchStevens/abed-ps" ]
        , HH.br_
        , HH.button
          [ HE.onClick (\_ -> DeleteProgress ) ]
          [ HH.text "Delete all progress" ] 

        , if logLevel <= Debug
            then debugOptions
            else HH.text ""

        , HH.h2_ [ HH.text "Attributions" ]
        , fromPlainHTML attributions
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        DeleteProgress -> liftEffect do
          confirmDelete <- window >>= confirm "Really delete all progress?"
          when confirmDelete do
            deleteProgress
        UnlockAll -> do
          for_ allLevelSuites \{ suiteName, levels } ->
            for_ levels \(Level l) -> do
               let levelId = LevelId {suiteName, levelName: l.name}
               GlobalState.setLevelProgress levelId Unlocked
          GlobalState.reload


    }

debugOptions :: forall w. HTML w Action
debugOptions = HH.div_
  [ HH.h2_ [ HH.text "Debug Options" ]
  , HH.button
    [ HE.onClick (\_ -> UnlockAll ) ]
    [ HH.text "Unlock all levels" ] 
  ]

attributions :: PlainHTML
attributions = HH.div_
  [ HH.span_
    [ HH.text "grid by Victor from "
    , HH.a
      [ HP.href "https://thenounproject.com/browse/icons/term/grid/"
      , HP.target "_blank"
      , HP.title "grid Icons"
      ]
      [ HH.text "Noun Project" ]
    , HH.text " (CC BY 3.0)"
    ]
  ]