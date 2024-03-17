module Guide.Overlay where

import Prelude

import Component.DataAttribute (DataAttribute)
import Component.DataAttribute as DA
import Control.Alt (alt)
import Control.Alternative (class Alternative)
import Control.Monad.Except (ExceptT, lift)
import Control.Monad.Fork.Class (class MonadFork, class MonadKill, fork, join, kill)
import Control.Monad.Morph (hoist)
import Control.Monad.State (StateT)
import Control.Parallel (class Parallel, parOneOfMap)
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Foldable (class Foldable, oneOf, traverse_)
import Data.Map (lookupLE)
import Data.Maybe (Maybe(..), isJust, maybe')
import Effect (Effect)
import Effect.Aff (Aff, Canceler(..), Error, Milliseconds(..), bracket, cancelWith, delay, error, forkAff, joinFiber, killFiber)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throw)
import Game.Location (Location(..), location)
import Game.Piece (PieceId(..), idPiece, name)
import Guide.DOMElements as DomElements
import Guide.DOMNavigation (getElementByDataAttribute, getElementByQuerySelector)
import Guide.Event (levelStartedEvent, pieceAddedEvent)
import Partial.Unsafe (unsafeCrashWith)
import RoughNotation (Annotation, annotate, removeAnnotation, showAnnotation, withAnnotation)
import RoughNotation.Config (RoughPadding(..))
import RoughNotation.Config as RoughAnnotation
import Web.DOM.Element (Element, toParentNode)
import Web.DOM.Element as Element
import Web.DOM.NonElementParentNode (getElementById)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.Event.EventTarget (eventListener)
import Web.HTML.Common (ClassName(..))


killOn :: forall a. Aff a -> Aff a -> Aff a
killOn action interuption = do
  actionFiber <- forkAff action
  haltFiber <- forkAff $
    interuption <* killFiber (error "") actionFiber
  parOneOfMap joinFiber [actionFiber, haltFiber]

clickHereAnnotation :: Element -> Aff Annotation
clickHereAnnotation element = annotate element RoughAnnotation.Box { color: "blue", iterations: 1 }

lookHereAnnotation :: Element -> Aff Annotation
lookHereAnnotation element = annotate element RoughAnnotation.Circle { color: "red", padding: Padding 15.0, iterations: 4 }

foreign import delayUntilClicked_ :: Element -> EffectFnAff Unit
delayUntilClicked :: Element -> Aff Unit
delayUntilClicked element = fromEffectFnAff (delayUntilClicked_ element)


{-
  prereqs:
    - location 0 0 is empty
    - `pieceId` is an avilable piece
-}
addPieceAnimation :: { idPiece :: Element, location00 :: Element } -> Aff Unit
addPieceAnimation { idPiece, location00 } = do
  withAnnotation (clickHereAnnotation idPiece) \annotation -> do
    log "start annotation"
    showAnnotation annotation
    log "finished annotation"
    delayUntilClicked idPiece
  withAnnotation (lookHereAnnotation location00) \annotation -> do
    showAnnotation annotation

addPieceOverlay :: PieceId -> Aff Unit
addPieceOverlay pieceId = do
  idPiece <- DomElements.availablePiece pieceId
  location00 <- DomElements.location (location 0 0)

  let
    overlay = do
      levelStartedEvent
      --delay (Milliseconds 2000.0)
      addPieceAnimation { idPiece, location00 }

  overlay `killOn` (pieceAddedEvent (location 0 0) *> log "added piece :(")

{-
  prereqs:
    - `from` location contains a piece
    - `to` location is empty
  
-}
movePieceAnimation :: { from :: Element, to :: Element } -> Aff Unit
movePieceAnimation { from, to } = do
  fromAnnotation <- clickHereAnnotation from
  toAnnotation <- lookHereAnnotation to

  showAnnotation fromAnnotation
  delayUntilClicked from
  removeAnnotation fromAnnotation
  showAnnotation toAnnotation
  delay (Milliseconds 3500.0)
  removeAnnotation toAnnotation



movePieceFromToOverlay :: { from :: Location, to :: Location } -> Aff Unit
movePieceFromToOverlay { from, to } = do
  fromElement <- DomElements.location from
  toElement <- DomElements.location to

  let
    overlay = do
      pieceAddedEvent from
      delay (Milliseconds 1000.0)
      movePieceAnimation { from: fromElement, to: toElement }

  --hoist killOn `embe`
  
  --overlay pieceAddedEvent to
  pure unit


{-
  prereq: current completion state is "ready-for-testing"
-}
runTestsAnimation :: { runTestsButton :: Element } -> Aff Unit
runTestsAnimation { runTestsButton } =
  withAnnotation (clickHereAnnotation runTestsButton) \annotation -> do
    showAnnotation annotation
    delayUntilClicked runTestsButton

--clickElementAnimation :: { element :: Element } -> Aff Unit
--clickElementAnimation { element } =
--  withAnnotation (clickHereAnnotation element) \annotation
--
--  annotation <- clickHereAnnotation element
--  let cancel = cancelAnnotations [ annotation ]
--
--  let
--    animation = do
--      showAnnotation annotation
--      delayUntilClicked element
--      removeAnnotation annotation
--
--  pure { run: animation `cancelWith` cancel, cancel }



--foreign import runTests :: EffectFnAff Unit
--runTestsOverlay :: Aff Unit
--runTestsOverlay = do
--  readyForTestingEvent
--  runOverlay <- parOneOf
--    [ runningTestEvent  $> false
--    , delay (Milliseconds 3000.0) $> true
--    ]
--  when runOverlay do
--    fromEffectFnAff runTests
--
--foreign import backToLevelSelect :: EffectFnAff Unit
--backToLevelSelectOverlay :: Aff Unit
--backToLevelSelectOverlay = do
--  completed
--  runOverlay <- parOneOf 
--    [ delay (Milliseconds 3000.0) $> true ]
--  when runOverlay do
--    fromEffectFnAff backToLevelSelect