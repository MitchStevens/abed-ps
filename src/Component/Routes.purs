module Component.Routes where

import Prelude

import Capability.Navigate (Route(..))
import Component.About as About
import Component.Home as Home
import Component.Instructions as Instructions
import Component.Level as Level
import Component.LevelSelect as LevelSelect
import Control.Monad.Logger.Class (class MonadLogger, debug)
import Control.Monad.Reader (class MonadAsk, lift)
import Data.Foldable (oneOf)
import Data.Log.Tag (tag)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Debug (trace)
import Effect.Aff.Class (class MonadAff)
import Effect.Class.Console (log)
import Foreign.Object as Object
import Game.GameEvent (GameEvent, GameEventStore)
import GlobalState (GlobalState)
import Halogen (Component, Slot, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Record as Record
import Resources.LevelSuites (allLevelSuites)
import Routing.Match (Match, lit, str)
import Type.Proxy (Proxy(..))
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

route :: Match Route
route = oneOf
  [ Home <$ lit "home"
  , About <$ lit "about"
  , Instructions <$ lit "how-to-play"
  , LevelSelect <$ lit "level-select"
  , Level <$> (lit "level" *> str) <*> str
  ]

type Input = {}

type State = 
  { route :: Route }

data Query a
  = Navigate Route a

data Action


data Output

type Slots =
  ( home          :: forall q. Slot q Void Unit
  , about         :: forall q. Slot q Void Unit
  , instructions  :: forall q. Slot q Void Unit
  , levelSelect   :: forall q. Slot q Void Unit
  , level         :: forall q. Slot q Void Unit
  )

component 
  :: forall m
   . MonadAff m
  => MonadAsk GlobalState m
  => MonadLogger m
  => Component Query Unit Void m
component = H.mkComponent { eval, initialState, render }
  where
  initialState _ = { route: Home }
  
  render :: State -> H.ComponentHTML Action Slots m
  render { route } = case route of
      Home ->
        HH.slot_ (Proxy :: _ "home") unit Home.component unit
      About ->
        HH.slot_ (Proxy :: _ "about") unit About.component unit
      Instructions ->
        HH.slot_ (Proxy :: _ "instructions") unit Instructions.component unit
      LevelSelect ->
        HH.slot_ (Proxy :: _ "levelSelect") unit LevelSelect.component unit
      Level suiteName levelName -> fromMaybe (HH.text "coublent find tht roblem" ) do
        levelSuite <- Object.lookup suiteName allLevelSuites
        level <- Object.lookup levelName levelSuite
        pure $ HH.slot_ (Proxy :: _ "level") unit Level.component $
          { levelId: { suiteName, levelName }, level }

  eval = mkEval 
    { finalize: Nothing 
    , handleAction: case _ of
        _ -> pure unit
    , handleQuery: case _ of
        Navigate dest a -> do
          { route } <- H.get
          when (route /= dest) do
            lift $ debug M.empty ("Navigated to " <> show dest)
            H.modify_ (_ { route = dest })
          pure (Just a)
    , initialize: Nothing
    , receive: \_ -> Nothing
    }