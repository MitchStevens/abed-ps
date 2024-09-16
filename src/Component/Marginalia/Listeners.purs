module Component.Marginalia.Listeners where

import Prelude

import Data.Foldable (any, for_, or)
import Data.Maybe (maybe, maybe')
import Data.Traversable (for)
import Effect (Effect)
import Effect.Aff (Aff, error, forkAff, joinFiber, killFiber, launchAff_, never)
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Web.DOM (Element, Node)
import Web.DOM.Element (fromNode, toNode)
import Web.DOM.MutationObserver (MutationObserver, disconnect, mutationObserver, observe)
import Web.DOM.MutationRecord (MutationRecord, addedNodes, removedNodes)
import Web.DOM.NodeList as NodeList
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.Window (document)

--
lookup :: QuerySelector -> Effect Element
lookup selector = do
  parentNode <- toParentNode <$> (window >>= document)
  querySelector selector parentNode >>= maybe' (\_ -> throw "") pure

addMutationObserver :: Node -> (MutationRecord -> Effect Boolean) -> (MutationRecord -> Effect Unit) -> Effect Unit
addMutationObserver node predicate action = do
  observer <- mutationObserver $ \records this ->
    for_ records \record ->
      whenM (predicate record) do
        action record
        disconnect this
  observe node {} observer

onMutation :: QuerySelector -> (MutationRecord -> Effect Boolean) -> Aff Element
onMutation selector predicate = do
  fiber <- forkAff (never :: Aff Unit)
  element <- liftEffect (lookup selector)
  liftEffect $ addMutationObserver (toNode element) predicate (\_ -> launchAff_ (killFiber (error "") fiber))
  joinFiber fiber $> element

onChildAdded :: QuerySelector -> (Element -> Effect Boolean) -> Aff Element
onChildAdded selector predicate = onMutation selector \record -> do
  nodes <- addedNodes record >>= NodeList.toArray
  or <$> for nodes \node -> do
    maybe (pure false) predicate (fromNode node)

onChildRemoved :: QuerySelector -> (Element -> Effect Boolean) -> Aff Element
onChildRemoved selector predicate = onMutation selector \record -> do
  nodes <- removedNodes record >>= NodeList.toArray
  or <$> for nodes \node -> do
    maybe (pure false) predicate (fromNode node)

