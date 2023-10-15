module Store where

import Prelude

import Data.Time.Duration (Seconds(..))
import Effect.Ref (Ref)
import Game.Message (Message)
import Halogen.Subscription (Emitter, Listener, SubscribeIO)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

type ChatServerStore = 
  { queuedMessages :: Ref (Array Message)
  , emitter :: Emitter Message
  , listener :: Listener Message
  }

type Store =
  { keyDownEmitter :: Emitter KeyboardEvent
  , chatServer :: ChatServerStore
  }