module Component.Marginalia.Events where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff (Aff, error, forkAff, joinFiber, killFiber, launchAff_, never, suspendAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Web.DOM.Element (toEventTarget)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.Event.Event (EventType(..))
import Web.Event.EventTarget (addEventListener, addEventListenerWithOptions, eventListener)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.Window (document)

type Event a = Aff a

onStart :: Aff Unit
onStart = pure unit

onEvent :: EventType -> QuerySelector -> Aff Unit
onEvent eventType selector = do
  fiber <- forkAff never
  liftEffect do
    parentNode <- toParentNode <$> (window >>= document)
    querySelector selector parentNode >>= case _ of
      Just element -> do
        listener <- eventListener (\_ -> launchAff_ (killFiber (error "") fiber))
        addEventListenerWithOptions eventType listener  { capture: true, passive: true, once: true } (toEventTarget element)
      Nothing -> do
        log ("Couldn't find element with selector: " <> show selector) 
        launchAff_ (killFiber (error "") fiber)
  joinFiber fiber


onClick :: QuerySelector -> Aff Unit
onClick = add
