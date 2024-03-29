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
  { "Tutorial Suite": tutorialSuite
  , "Intermediate Suite": intermediateSuite
  , "Two Bit Suite": twoBitSuite
  , "Shifting Suite": shiftingSuite
  }

getAllLevelProgress :: forall m. MonadEffect m => m (Map LevelId LevelProgress)
getAllLevelProgress = map (join >>> M.fromFoldable >>> M.catMaybes) $
  for (O.toUnfoldable allLevelSuites :: Array _) \(Tuple suiteName suite) ->
    for (O.toUnfoldable suite :: Array _) \(Tuple levelName _) ->
      Tuple {suiteName, levelName} <$> getLevelProgress { suiteName, levelName}

identitySuite :: LevelSuite
identitySuite = fromHomogeneous {}
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
