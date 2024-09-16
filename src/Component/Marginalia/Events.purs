module Component.Marginalia.Events where

import Prelude

import Component.DataAttribute as DA
import Component.Marginalia.Listeners (onChildAdded, onChildRemoved, onMutation)
import Control.Alt (alt)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff, Canceler(..), Milliseconds(..), delay, error, forkAff, joinFiber, killFiber, launchAff, launchAff_, makeAff, never, nonCanceler, suspendAff, throwError)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throw)
import Game.Level.Completion (CompletionStatus)
import Game.Location (Location(..))
import Halogen.HTML.Events (onMouseLeave)
import Web.DOM.Element (Element, toEventTarget)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.Event.Event (Event, EventType(..))
import Web.Event.EventTarget (addEventListener, addEventListenerWithOptions, eventListener)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.Window (document)

onStart :: Aff Unit
onStart = pure unit

onTimeout :: Milliseconds -> Aff Unit
onTimeout duration = delay duration

onEvent :: EventType -> QuerySelector -> Aff Element
onEvent eventType selector@(QuerySelector s) = do
  fiber <- forkAff (never :: Aff Unit)
  element <- liftEffect $ addEventListener (\_ -> launchAff_ (killFiber (error "") fiber))
  joinFiber fiber $> element

  where
    addEventListener :: (Event -> Effect Unit) -> Effect Element
    addEventListener callback = do
      parentNode <- toParentNode <$> (window >>= document)
      querySelector selector parentNode >>= case _ of
        Just element -> do
          listener <- eventListener callback
          addEventListenerWithOptions eventType listener  { capture: true, passive: true, once: true } (toEventTarget element)
          pure element
        Nothing -> do
          throw ("Couldn't find element with selector: " <> s) 

onClick :: QuerySelector -> Aff Element
onClick = onEvent (EventType "onclick")

onMouseEnter :: QuerySelector -> Aff Element
onMouseEnter = onEvent (EventType "mouseenter")

onMouseLeave :: QuerySelector -> Aff Element
onMouseLeave = onEvent (EventType "mouseleave")

cancelWhen :: forall a b. Aff a -> Aff b -> Aff a
cancelWhen action cancelOn = alt action
  (cancelOn *> throwError (error "cancelled"))




---
onPieceAdded :: Location -> Aff Element
onPieceAdded loc = onChildAdded (DA.selector DA.location loc) (DA.hasAttr DA.pieceId)

onPieceRemoved :: Location -> Aff Element
onPieceRemoved loc = onChildRemoved (DA.selector DA.location loc) (DA.hasAttr DA.pieceId)

onCompletionStatus :: CompletionStatus -> Aff Element
onCompletionStatus status = onMutation (DA.selector DA.completionStatus status) (\_ -> pure true)

