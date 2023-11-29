module Component.Home where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
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
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, lift, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS

type State =
  { titleText :: String
  }

data Action
  = Initialise
  | NavigateTo Route
  | AppendCharToTitle Char

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ =
    { titleText: "" } 

  render state =  
    HH.div [ HP.id "home-component" ]
      [ HH.textarea
        [ HP.id "title"
        , HP.value state.titleText
        , HP.cols (fromMaybe 100 (String.length <$> A.head abedTitle) - 4) -- we take away 4 because textareas are weird, todo: fix this properly later
        , HP.rows (A.length abedTitle)
        ]
      , HH.br_
      , HH.a 
        [ HE.onClick (\_ -> NavigateTo LevelSelect)
        , HP.class_ (ClassName "link")
        ]
        [ HH.text "Puzzle Select" ]
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
        Initialise -> do
          emitter <- liftAff titleCharEmitter
          _ <- H.subscribe (AppendCharToTitle <$> emitter)
          pure unit
        NavigateTo route -> do 
          navigateTo route 
        AppendCharToTitle c ->
          modify_ $ \s -> s { titleText = s.titleText <> String.singleton c}
    , initialize = Just Initialise
    }



titleCharEmitter :: Aff (Emitter Char)
titleCharEmitter = do
  { listener, emitter } <- liftEffect HS.create 
  _ <- forkAff $
    for_ (toCharArray $ intercalate "\n" abedTitle) \c -> do
      liftEffect $ HS.notify listener c
      delay (Milliseconds 1.0)
  pure emitter




abedTitle :: Array String
--abedTitle =
--  [ "          __               __"
--  , "  ____ _ / /_   ___   ____/ /"
--  , " / __ `// __ \\ / _ \\ / __  / "
--  , "/ /_/ // /_/ //  __// /_/ /  "
--  , "\\__,_//_.___/ \\___/ \\__,_/   "
--  ]
abedTitle =
  [ "    :::     :::::::::  :::::::::: ::::::::: "
  , "  :+: :+:   :+:    :+: :+:        :+:    :+:"
  , " +:+   +:+  +:+    +:+ +:+        +:+    +:+"
  , "+#++:++#++: +#++:++#+  +#++:++#   +#+    +:+"
  , "+#+     +#+ +#+    +#+ +#+        +#+    +#+"
  , "#+#     #+# #+#    #+# #+#        #+#    #+#"
  , "###     ### #########  ########## ######### "
  ]

--links =
--  { puzzleSelect: "Puzzle Select"
--  , instructions: "How to play"
--  , about: "About"
--  }