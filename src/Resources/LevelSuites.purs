module Resources.LevelSuites where

import Prelude

import Capability.LocalStorage (getProgress, saveProgress)
import Capability.LocalStorage.LevelProgress (LevelProgress)
import Capability.LocalStorage.LevelProgress as LevelProgress
import Component.Chat as Chat
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Seconds(..))
import Data.Traversable (all, any, for)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Class (class MonadEffect)
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Level (levelName)
import Game.Level.Suite (LevelId(..), LevelSuite)
import Resources.LevelSuites.Intermediate.Suite (intermediateSuite)
import Resources.LevelSuites.ShiftingSuite (shiftingSuite)
import Resources.LevelSuites.TutorialSuite.Suite (firstLevel, tutorialSuite)
import Resources.LevelSuites.TwoBitSuite (twoBitSuite)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

allLevelSuites :: Object LevelSuite
allLevelSuites = O.fromFoldable $
  map (\suite -> Tuple suite.suiteName suite)
    [ tutorialSuite, intermediateSuite, twoBitSuite, shiftingSuite ]

--getAllLevelProgress :: Effect (Map LevelId LevelProgress)
--getAllLevelProgress = map (join >>> M.fromFoldable >>> M.catMaybes) $
--  for (O.toUnfoldable allLevelSuites :: Array _) \(Tuple suiteName suite) ->
--    for (O.toUnfoldable suite.levels :: Array _) \(Tuple levelName _) -> do
--      let levelId = LevelId { suiteName, levelName }
--      Tuple levelId <$> getProgress levelId

getAllLevelProgress :: Effect (Object (Object (Maybe LevelProgress)))
getAllLevelProgress = do
  unlockedLevels <-
    forWithIndex allLevelSuites \suiteName suite ->
      forWithIndex suite.levels \levelName _ -> 
        (getProgress (LevelId { suiteName, levelName }) :: Effect (Maybe LevelProgress))

  if all O.isEmpty unlockedLevels
    then do
      saveProgress (LevelId { suiteName: firstSuiteName, levelName: firstLevelName }) LevelProgress.Unlocked
      pure $ O.singleton firstSuiteName (O.singleton firstLevelName (Just LevelProgress.Unlocked))
    else 
      pure unlockedLevels

  where
    firstSuiteName = tutorialSuite.suiteName
    firstLevelName = levelName firstLevel
      
    



--identitySuite :: LevelSuite
--identitySuite = toLevelSuite "Identity Suite" []
  --{ "Double Negation":
  --  { problemDescription:
  --    { goal: mkPiece idPiece
  --    , title: "Double negation"
  --    , description: "create an idenity from not gate"
  --    , testCases: [ M.singleton Direction.Left ff, M.singleton Direction.Left tt ]
  --    , requiresAutomaticTesting: false
  --    , pieceSet: S.fromFoldable [ mkPiece idPiece, mkPiece notPiece]
  --    , otherRestrictions:
  --      [ { name: "only one id",
  --          description: "only one id in t board is allowed", 
  --          restriction: \b -> countPiecesOfType b idPiece <= 1
  --        }
  --      ]
  --    }
  --  , conversation: []
  --  }
  --, "Chained Or Identity":
  --, "Chained And Identity":
  --, "Signal Duplication":
  --, "Starburst":
  --}

--intermediateSuite :: PuzzleSuite
--intermediateSuite = fromHomogeneous {}
  --{ "Inverted Or":
  --  { problemDescription:
  --    { goal: mkPiece orPiece
  --    , title: "or problem"
  --    , description: "create or from and an not"
  --    , testCases: basicTestCases
  --    , requiresAutomaticTesting: false
  --    , pieceSet: S.fromFoldable [ mkPiece notPiece, mkPiece andPiece, mkPiece idPiece ]
  --    , otherRestrictions: []
  --    }
  --  , conversation: conversation2
  --  }
  ----, "Exclusive Or":
  ----, "Over-Under":
  --}
