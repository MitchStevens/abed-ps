module Component.Title where

import Prelude

import Data.Array (intercalate)
import Data.Array as A
import Data.Array.Partial (head)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String as String
import Data.String.CodeUnits (singleton, toCharArray)
import Effect.Aff (Aff, Milliseconds(..), delay, forkAff)
import Effect.Aff.Class (class MonadAff)
import Halogen (Component, ComponentHTML, gets, liftEffect, modify_)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS

type Input = { typeTitle :: Boolean }

type State = { typeTitle :: Boolean, text :: String }

data Action
  = Initialise
  | AppendCharToTitle Char


component :: forall q o m. MonadAff m => Component q Input o m
component = H.mkComponent { eval, initialState, render }
  where
    initialState { typeTitle } = { typeTitle, text: "" }

    render :: forall s. State -> ComponentHTML Action s m
    render state = makeTitle state.text

    eval = H.mkEval H.defaultEval 
      { handleAction = case _ of 
          Initialise -> do
            whenM (gets (_.typeTitle)) do
              emitter <- H.liftAff titleCharEmitter
              _ <- H.subscribe (AppendCharToTitle <$> emitter)
              pure unit
          AppendCharToTitle c ->
            modify_ $ \s -> s { text = s.text <> singleton c }
      , initialize = Just Initialise
      }

html :: forall p i. HTML p i
html = makeTitle (intercalate "\n" abedTitleText)

makeTitle :: forall p i. String -> HTML p i
makeTitle titleText =
  HH.textarea
    [ HP.id "title"
    , HP.value titleText
    , HP.readOnly true
    , HP.cols (fromMaybe 100 (String.length <$> A.head abedTitleText) - 4) -- we take away 4 because textareas are weird, todo: fix this properly later
    , HP.rows (A.length abedTitleText)
    ]

titleCharEmitter :: Aff (Emitter Char)
titleCharEmitter = do
  { listener, emitter } <- liftEffect HS.create 
  _ <- forkAff $
    for_ (toCharArray $ intercalate "\n" abedTitleText) \c -> do
      liftEffect $ HS.notify listener c
      delay (Milliseconds 1.0)
  pure emitter

abedTitleText :: Array String
abedTitleText =
  [ "    :::     :::::::::  :::::::::: ::::::::: "
  , "  :+: :+:   :+:    :+: :+:        :+:    :+:"
  , " +:+   +:+  +:+    +:+ +:+        +:+    +:+"
  , "+#++:++#++: +#++:++#+  +#++:++#   +#+    +:+"
  , "+#+     +#+ +#+    +#+ +#+        +#+    +#+"
  , "#+#     #+# #+#    #+# #+#        #+#    #+#"
  , "###     ### #########  ########## ######### "
  ]