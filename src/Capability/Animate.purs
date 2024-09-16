module Capability.Animate where

import Prelude

import Data.Foldable (for_)
import Data.Time.Duration (Milliseconds(..))
import Effect.Aff (delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Web.DOM.DOMTokenList as DOMTokenList
import Web.DOM.Element (classList, fromEventTarget, toEventTarget)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.Event.Event (EventType(..))
import Web.Event.EventTarget (addEventListener, addEventListenerWithOptions, eventListener)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.Window (document)

type Radians = Number

data Animation
  = HeadShake
  | ClockwiseRotation


headShake :: forall m. MonadAff m => QuerySelector -> m Unit
headShake selector = do
  htmlDocument <- liftEffect $ window >>= document
  maybeElement <- liftEffect $ querySelector selector (toParentNode htmlDocument)
  for_ maybeElement \element -> do
    tokenList <- liftEffect $ classList element
    liftEffect $ DOMTokenList.add tokenList "head-shake"
    --removeAnimationClass <- eventListener \_ -> log "removed!!" *> DOMTokenList.remove tokenList "head-shake"
    --addEventListenerWithOptions (EventType "transitionend") removeAnimationClass { capture: true, once: true, passive: true } (toEventTarget element)
    liftAff $ delay (Milliseconds 1000.0)
    liftEffect $ DOMTokenList.remove tokenList "head-shake"
  


-- addevent with optiosn :: EventType -> EventListener -> { capture :: Boolean, once :: Boolean, passive :: Boolean } -> EventTarget -> Effect Unit
--clockwiseRotation