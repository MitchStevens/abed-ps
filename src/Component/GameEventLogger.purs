module Component.GameEventLogger where

import Prelude

import AppM (AppM)
import Control.Monad.Logger.Class as Log
import Data.Foldable (for_)
import Data.Log.Tag (tag)
import Data.Maybe (Maybe(..))
import Effect.Class.Console (log)
import Game.GameEvent (GameEvent)
import GlobalState (GlobalState)
import Halogen (Component, defaultEval, lift, mkComponent, mkEval)
import Halogen.HTML as HH
import Halogen.Hooks as Hooks
import Halogen.Store.Connect (subscribe)
import Halogen.Store.Select (Selector(..), select)
import Halogen.Store.UseSelector (useSelector)
import Type.Proxy (Proxy(..))

data Action
  = Initialise
  | GameEvent GameEvent

slot = Proxy :: Proxy "gameEventLogger"

selectGameEvents :: Selector GlobalState GameEvent
selectGameEvents = select eq (_.lastGameEvent)

component :: forall q i. Component q i Void AppM
component = mkComponent { render, eval, initialState }
  where
    render _ = HH.text ""
    initialState = identity
    eval = mkEval (defaultEval
      { handleAction = case _ of
          Initialise -> do
            subscribe selectGameEvents GameEvent
          GameEvent gameEvent -> do
            lift $ Log.info (tag "game event" (show gameEvent)) "New GameEvent"
      , initialize = Just Initialise
      }
    )



