module Guide.Overlay where

import Prelude

import Control.Alt (alt)
import Control.Parallel (parOneOf)
import Data.Foldable (oneOf)
import Effect (Effect)
import Effect.Aff (Aff, Milliseconds(..), delay)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Game.Location (Location(..), location)
import Guide.Event (completedEvent, levelStartedEvent, pieceAddedEvent, pieceRemovedEvent, readyForTestingEvent, runningTestEvent)


--foreign import addPiece :: EffectFnAff Unit
--addPieceOverlay :: Aff Unit
--addPieceOverlay = do
--  levelStartedEvent
--  runOverlay <- parOneOf
--    [ pieceAddedEvent (location 0 0) $> false
--    , delay (Milliseconds 3000.0) $> true
--    ]
--  when runOverlay do
--    fromEffectFnAff addPiece)

foreign import movePieceFromTo :: Location -> Location -> EffectFnAff Unit
movePieceFromToOverlay :: Location -> Location -> Aff Unit
movePieceFromToOverlay src dst = do
  pieceAddedEvent (location 0 0)
  runOverlay <- parOneOf
    [ pieceRemovedEvent (location 0 0) $> false
    , delay (Milliseconds 3000.0) $> true
    ]
  when runOverlay do
    fromEffectFnAff $ movePieceFromTo src dst

foreign import runTests :: EffectFnAff Unit
runTestsOverlay :: Aff Unit
runTestsOverlay = do
  readyForTestingEvent
  runOverlay <- parOneOf
    [ runningTestEvent  $> false
    , delay (Milliseconds 3000.0) $> true
    ]
  when runOverlay do
    fromEffectFnAff runTests

foreign import backToLevelSelect :: EffectFnAff Unit
backToLevelSelectOverlay :: Aff Unit
backToLevelSelectOverlay = do
  completedEvent
  runOverlay <- parOneOf 
    [ delay (Milliseconds 3000.0) $> true ]
  when runOverlay do
    fromEffectFnAff backToLevelSelect