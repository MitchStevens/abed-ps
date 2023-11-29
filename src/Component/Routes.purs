module Component.Routes where

import Prelude

import Capability.Navigate (Route(..))
import Component.About as About
import Component.Home as Home
import Component.Instructions as Instructions
import Component.Level as Level
import Component.LevelSelect as LevelSelect
import Control.Monad.Reader (class MonadAsk)
import Data.Foldable (oneOf)
import Data.Maybe (Maybe(..), fromMaybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class.Console (log)
import Foreign.Object as Object
import Game.GameEvent (GameEvent, GameEventStore)
import GlobalState (GlobalState)
import Halogen (Component, Slot, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.Store.Monad (class MonadStore)
import Record as Record
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
  { route :: Maybe Route }

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
  => MonadStore GameEvent GameEventStore m
  => Component Query Unit Void m
component = H.mkComponent { eval, initialState, render }
  where
  initialState _ = { route: Just Home }
  
  render :: State -> H.ComponentHTML Action Slots m
  render { route } = case route of
    Just r -> case r of
      Home -> 
        HH.slot_ (Proxy :: _ "home") unit Home.component unit
      About ->
        HH.slot_ (Proxy :: _ "about") unit About.component unit
      Instructions ->
        HH.slot_ (Proxy :: _ "instructions") unit Instructions.component unit
      PuzzleSelect ->
        HH.slot_ (Proxy :: _ "levelSelect") unit PuzzleSelect.component unit
      Puzzle suiteName puzzleName -> fromMaybe (HH.text "coublent find tht roblem" ) do
        puzzleSuite <- Object.lookup suiteName allPuzzles
        puzzle <- Object.lookup puzzleName puzzleSuite
        pure $ HH.slot_ (Proxy :: _ "level") unit Puzzle.component $
           { puzzleId: { suiteName, puzzleName }, puzzle }
    Nothing ->
      HH.div_ [ HH.text "Oh no! That page wasn't found." ]

  eval = mkEval 
    { finalize: Nothing 
    , handleAction: case _ of
        _ -> pure unit
    , handleQuery: case _ of
        Navigate dest a -> do
          { route } <- H.get
          when (route /= Just dest) do
            log "navigate"
            H.modify_ (_ { route = Just dest })
          pure (Just a)
    , initialize: Nothing
    , receive: \_ -> Nothing
    }