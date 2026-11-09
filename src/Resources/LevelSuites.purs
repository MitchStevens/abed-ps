module Resources.LevelSuites where

import Prelude

import AppM (currentLogLevel)
import Capability.Progress (LevelProgress, getLevelProgress)
import Data.HeytingAlgebra (ff, tt)
import Data.Log.Level (LogLevel(..))
import Data.Map (Map)
import Data.Map as M
import Data.Time.Duration (Seconds(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Foreign.Object (Object, fromHomogeneous)
import Foreign.Object as O
import Game.Level (LevelId, LevelSuite)
import Resources.LevelSuites.DebugSuite (debugSuite)
import Resources.LevelSuites.IntermediateSuite (intermediateSuite)
import Resources.LevelSuites.ShiftingSuite (shiftingSuite)
import Resources.LevelSuites.TutorialSuite.Suite (tutorialSuite)
import Resources.LevelSuites.TwoBitSuite (twoBitSuite)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))


releasedLevelSuites :: Object LevelSuite
releasedLevelSuites = fromHomogeneous
  { "Tutorial": tutorialSuite
  , "Intermediate": intermediateSuite
--  , "Two Bit": twoBitSuite
--  , "Shifting": shiftingSuite
  }

-- | The released suites, plus the debug suite when running at Debug or below.
allLevelSuites :: Effect (Object LevelSuite)
allLevelSuites = do
  logLevel <- currentLogLevel
  pure if logLevel <= Debug
    then O.insert "Debug" debugSuite releasedLevelSuites
    else releasedLevelSuites

getAllLevelProgress :: forall m. MonadEffect m => m (Map LevelId LevelProgress)
getAllLevelProgress = do
  suites <- liftEffect allLevelSuites
  map (join >>> M.fromFoldable >>> M.catMaybes) $
    for (O.toUnfoldable suites :: Array _) \(Tuple suiteName suite) ->
      for (O.toUnfoldable suite :: Array _) \(Tuple levelName _) ->
        Tuple {suiteName, levelName} <$> getLevelProgress { suiteName, levelName}