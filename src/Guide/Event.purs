module Guide.Event where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe')
import Data.Nullable (toMaybe)
import Data.Time.Duration (Milliseconds(..))
import Effect.Aff (Aff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Exception (throw)
import Game.Location (Location(..))
import Guide.Element (pieceAt)
import Web.DOM.MutationObserver (disconnect, mutationObserver)
import Web.DOM.MutationRecord (addedNodes)
import Web.DOM.NodeList as NodeList

levelStartedEvent :: Aff Unit
levelStartedEvent = pure unit

foreign import pieceAdded :: Location -> EffectFnAff Unit
pieceAddedEvent :: Location -> Aff Unit
pieceAddedEvent loc = fromEffectFnAff (pieceAdded loc)

foreign import pieceRemoved :: Location -> EffectFnAff Unit
pieceRemovedEvent :: Location -> Aff Unit
pieceRemovedEvent loc = fromEffectFnAff (pieceRemoved loc)

--pieceExistsEvent :: Location -> Aff Unit
--pieceExistsEvent loc = do
--  pieceAt loc >>= case _ of
--    Nothing -> pieceAddedEvent loc
--    Just _ -> pure unit

foreign import portMismatch :: EffectFnAff Unit
portMismatchEvent :: Aff Unit
portMismatchEvent = fromEffectFnAff portMismatch

foreign import readyForTesting :: EffectFnAff Unit
readyForTestingEvent :: Aff Unit
readyForTestingEvent = fromEffectFnAff readyForTesting

foreign import runningTest :: EffectFnAff Unit
runningTestEvent :: Aff Unit
runningTestEvent = fromEffectFnAff readyForTesting

foreign import failedTestCase :: EffectFnAff Unit
failedTestCaseEvent :: Aff Unit
failedTestCaseEvent = fromEffectFnAff failedTestCase

foreign import completed :: EffectFnAff Unit
completedEvent :: Aff Unit
completedEvent = fromEffectFnAff completed


