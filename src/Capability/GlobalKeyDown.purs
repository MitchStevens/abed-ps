module Capability.GlobalKeyDown where

import Prelude

import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Halogen (HalogenM, lift)
import Halogen.Query.Event (eventListener)
import Halogen.Subscription (Emitter, Listener, SubscribeIO)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toEventTarget)
import Web.HTML.Window (document)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.KeyboardEvent as KeyboardEvent
import Web.UIEvent.KeyboardEvent.EventTypes as EventTypes

class Monad m <= GlobalKeyDown m where
  getKeyDownEmitter :: m (Emitter KeyboardEvent)

instance GlobalKeyDown m => GlobalKeyDown (HalogenM st act slots msg m) where
  getKeyDownEmitter = lift getKeyDownEmitter

globalKeyDownEventEmitter :: Effect (Emitter KeyboardEvent)
globalKeyDownEventEmitter = do
  htmlDocument <- window >>= document
  let target = toEventTarget htmlDocument
  pure $ eventListener EventTypes.keydown target KeyboardEvent.fromEvent