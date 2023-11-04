module Capability.Spotlight where

import Prelude

import Control.Monad.Trans.Class (lift)
import Data.Foldable (for_, traverse_)
import Effect (Effect)
import Effect.Aff (Milliseconds(..), delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Halogen (AttrName(..), HalogenM)
import Web.DOM (Element)
import Web.DOM.DOMTokenList as DOMTokenList
import Web.DOM.Element (classList, fromNode, localName)
import Web.DOM.Node (nodeName)
import Web.DOM.NodeList (toArray)
import Web.DOM.ParentNode (QuerySelector(..), querySelectorAll)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.Window (document)

-- different spotlight effects?
spotlight
  :: forall m
   . MonadAff m
   => QuerySelector -> m Unit
spotlight selector = do
  log "starting spotlight"
  htmlDocument <- liftEffect $ window >>= document
  nodeList <- liftEffect $ querySelectorAll selector (toParentNode htmlDocument)
  liftEffect (toArray nodeList) >>= traverse_ \node ->
    for_ (fromNode node) \element -> do
      log ("spotlighting " <> nodeName node <> " with local name " <> localName element)
      tokenList <- liftEffect $ classList element
      liftEffect $ DOMTokenList.add tokenList "spotlight"
      liftAff $ delay (Milliseconds 1000.0)
      liftEffect $ DOMTokenList.remove tokenList "spotlight"