module Capability.Animate where

import Prelude

import Data.Foldable (for_)
import Data.Time.Duration (Milliseconds(..))
import Effect.Aff (delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (liftEffect)
import Web.DOM.DOMTokenList as DOMTokenList
import Web.DOM.Element (classList)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.Window (document)


data Animation
  = HeadShake

headShake :: forall m. MonadAff m => QuerySelector -> m Unit
headShake selector = do
  htmlDocument <- liftEffect $ window >>= document
  maybeElement <- liftEffect $ querySelector selector (toParentNode htmlDocument)
  for_ maybeElement \element -> do
    tokenList <- liftEffect $ classList element
    liftEffect $ DOMTokenList.add tokenList "head-shake"
    liftAff $ delay (Milliseconds 1000.0)
    liftEffect $ DOMTokenList.remove tokenList "head-shake"