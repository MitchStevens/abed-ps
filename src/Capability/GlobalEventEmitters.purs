module Capability.GlobalEventEmmiters where

import Prelude

import Effect (Effect)
import Halogen.Query.Event (eventListener)
import Halogen.Subscription (Emitter)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toEventTarget)
import Web.HTML.Window (document)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.KeyboardEvent as KeyboardEvent
import Web.UIEvent.KeyboardEvent.EventTypes as KeyboardEvent
import Web.UIEvent.MouseEvent (MouseEvent)
import Web.UIEvent.MouseEvent as MouseEvent
import Web.UIEvent.MouseEvent.EventTypes as MouseEvent

globalKeyDownEventEmitter :: Effect (Emitter KeyboardEvent)
globalKeyDownEventEmitter = do
  htmlDocument <- window >>= document
  let target = toEventTarget htmlDocument
  pure $ eventListener KeyboardEvent.keydown target KeyboardEvent.fromEvent

globalMouseMoveEventEmitter :: Effect (Emitter MouseEvent)
globalMouseMoveEventEmitter = do
  htmlDocument <- window >>= document
  let target = toEventTarget htmlDocument
  pure $ eventListener MouseEvent.mousemove target MouseEvent.fromEvent