module Capability.GlobalKeyDown where

import Prelude

import Effect (Effect)
import Halogen.Query.Event (eventListener)
import Halogen.Subscription (Emitter)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toEventTarget)
import Web.HTML.Window (document)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.KeyboardEvent as KeyboardEvent
import Web.UIEvent.KeyboardEvent.EventTypes as EventTypes

globalKeyDownEventEmitter :: Effect (Emitter KeyboardEvent)
globalKeyDownEventEmitter = do
  htmlDocument <- window >>= document
  let target = toEventTarget htmlDocument
  pure $ eventListener EventTypes.keydown target KeyboardEvent.fromEvent