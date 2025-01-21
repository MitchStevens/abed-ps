module Resources.LevelSuites where

import Prelude

import Capability.Progress (LevelProgress, getLevelProgress)
import Component.Chat as Chat
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Time.Duration (Seconds(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Effect.Class (class MonadEffect)
import Foreign.Object (Object, fromHomogeneous)
import Foreign.Object as O
import Game.Level (LevelId, LevelSuite)
import Resources.LevelSuites.IntermediateSuite (intermediateSuite)
import Resources.LevelSuites.ShiftingSuite (shiftingSuite)
import Resources.LevelSuites.TutorialSuite.Suite (tutorialSuite)
import Resources.LevelSuites.TwoBitSuite (twoBitSuite)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))


allLevelSuites :: Object LevelSuite
allLevelSuites = fromHomogeneous
  { "Tutorial": tutorialSuite
  , "Intermediate": intermediateSuite
--  , "Two Bit": twoBitSuite
--  , "Shifting": shiftingSuite
  }

getAllLevelProgress :: forall m. MonadEffect m => m (Map LevelId LevelProgress)
getAllLevelProgress = map (join >>> M.fromFoldable >>> M.catMaybes) $
  for (O.toUnfoldable allLevelSuites :: Array _) \(Tuple suiteName suite) ->
    for (O.toUnfoldable suite :: Array _) \(Tuple levelName _) ->
      Tuple {suiteName, levelName} <$> getLevelProgress { suiteName, levelName}