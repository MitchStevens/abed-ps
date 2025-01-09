module GlobalState where

import Prelude

import Game.GameEvent (BoardEvent, GameEvent(..))
import Halogen.Store.Monad (updateStore)

data GlobalStateAction =
  NewGameEvent GameEvent

type GlobalState = 
  { lastGameEvent :: GameEvent
  , enableDemonstrations :: Boolean
  }

initialGlobalState :: GlobalState
initialGlobalState = { lastGameEvent: GameStarted, enableDemonstrations: true }

reduce :: GlobalState -> GlobalStateAction -> GlobalState
reduce state = case _ of
   NewGameEvent gameEvent -> state { lastGameEvent = gameEvent }

newBoardEvent :: BoardEvent -> GlobalStateAction
newBoardEvent boardEvent = NewGameEvent (BoardEvent boardEvent)