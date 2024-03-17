module Guide.Event where

import Prelude

import Control.Monad.Rec.Class (forever)
import Control.Monad.Trans.Class (lift)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe')
import Data.Nullable (toMaybe)
import Data.Time.Duration (Milliseconds(..))
import Effect (Effect)
import Effect.Aff (Aff, error, forkAff, joinFiber, killFiber, launchAff_, never, suspendAff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Game.Location (Location(..))
import Guide.DOMElements as DOMElements
import Halogen.Subscription as HS
import Web.DOM (Element, Node)
import Web.DOM.DOMTokenList as DOMTokenList
import Web.DOM.Element (classList)
import Web.DOM.Element as Element
import Web.DOM.MutationObserver (disconnect, mutationObserver, observe)
import Web.DOM.MutationRecord (addedNodes, removedNodes)
import Web.DOM.NodeList as NodeList

levelStartedEvent :: Aff Unit
levelStartedEvent = pure unit

nodeIsPiece :: Node -> Effect Boolean
nodeIsPiece node = case Element.fromNode node of
  Just element -> do
    tokenList <- classList element
    DOMTokenList.contains tokenList "piece-component"
  Nothing -> pure false


nodeAddedEvent :: (Node -> Effect Boolean) -> Element -> Aff Unit
nodeAddedEvent predicate element = do
  fiber <- suspendAff never -- unsuspend this when event is triggered
  observer <- liftEffect $ mutationObserver \records ob -> do
    for_ records \record -> do
      nodes <- addedNodes record >>= NodeList.toArray
      for_ nodes \node -> do
        whenM (predicate node) do
          launchAff_ $ killFiber (error "finished") fiber
          disconnect ob
  liftEffect $ observe (Element.toNode element) {} observer
  joinFiber fiber
  
nodeRemovedEvent :: (Node -> Effect Boolean) -> Element -> Aff Unit
nodeRemovedEvent predicate element = do
  fiber <- suspendAff never -- unsuspend this when event is triggered
  observer <- liftEffect $ mutationObserver \records ob -> do
    for_ records \record -> do
      nodes <- removedNodes record >>= NodeList.toArray
      for_ nodes \node -> do
        whenM (predicate node) do
          launchAff_ $ killFiber (error "finished") fiber
          disconnect ob
  liftEffect $ observe (Element.toNode element) {} observer
  joinFiber fiber

pieceAddedEvent :: Location -> Aff Unit
pieceAddedEvent loc = do
  element <- DOMElements.location loc
  nodeAddedEvent nodeIsPiece element

pieceRemovedEvent :: Location -> Aff Unit
pieceRemovedEvent loc = do
  element <- DOMElements.location loc
  nodeRemovedEvent nodeIsPiece element



--pieceRemovedEvent :: Location -> DomNavigation Unit
--pieceRemovedEvent loc = do
--  element <- DOMElements.location loc
--  lift $ nodeRemovedEvent nodeIsPiece element

--pieceExistsEvent :: Location -> DomNavigation Unit
--pieceExistsEvent loc = do
--
--
--
--  maybePieceId <- liftEffect $ toMaybe <$> pieceAt loc
--  case maybePieceId of
--    Nothing -> pieceAddedEvent loc
--    Just _ -> pure unit


--completionStatusEvent :: CompletionStatus -> DomNavigation Unit 
--completionStatusEvent completionStatus = do
--  mutationObserver


--const completionStatusEvent = (completionStatus) => (onError, onSuccess) => {
--  const observer = new MutationObserver((mutationList, ob) => {
--    for (const mutation of mutationList) {
--      const status = mutation.target.getAttribute("data-completion-status")
--      if (status == completionStatus) {
--        onSuccess()
--        ob.disconnect()
--      }
--    }
--  })
--
--  observer.observe(element.completionStatus(), {attributes: true})
--
--  return function (cancelError, onCancelerError, onCancelerSuccess) {
--    observer.disconnect()
--    onCancelerSuccess()
--  };
--}



--foreign import portMismatch :: EffectFnAff Unit
--portMismatchEvent :: Aff Unit
--portMismatchEvent = fromEffectFnAff portMismatch
--
--foreign import readyForTesting :: EffectFnAff Unit
--readyForTestingEvent :: Aff Unit
--readyForTestingEvent = fromEffectFnAff readyForTesting
--
--foreign import runningTest :: EffectFnAff Unit
--runningTestEvent :: Aff Unit
--runningTestEvent = fromEffectFnAff readyForTesting
--
--foreign import failedTestCase :: EffectFnAff Unit
--failedTestCaseEvent :: Aff Unit
--failedTestCaseEvent = fromEffectFnAff failedTestCase
--
--foreign import completed :: EffectFnAff Unit
--completedEvent :: Aff Unit
--completedEvent = fromEffectFnAff completed


