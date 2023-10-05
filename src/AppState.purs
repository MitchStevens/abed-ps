module AppState where

import Prelude

import Halogen.Subscription (Emitter, SubscribeIO)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

type AppState =
  { keyDownEmitter :: Emitter KeyboardEvent
  }
