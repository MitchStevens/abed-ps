module IO.Puzzles where

import Prelude

import Capability.Progress (PuzzleProgress, getPuzzleProgress)
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
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, location)
import Game.Location as Direction
import Game.Message (Message, guiding)
import Game.Piece (mkPiece, name)
import Game.Piece.BasicPiece (andPiece, idPiece, notPiece, orPiece, truePiece)
import Game.ProblemDescription (ProblemDescription, countPiecesOfType)
import Game.Puzzle (PuzzleSuite, PuzzleId)
import Game.RulesEngine (Rule(..))
import IO.Puzzles.IntermediateSuite (intermediateSuite)
import IO.Puzzles.TutorialSuite (tutorialSuite)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))


allPuzzles :: Object PuzzleSuite
allPuzzles = fromHomogeneous
  { "Tutorial Suite": tutorialSuite
  , "Identity Suite": identitySuite
  , "Intermediate Suite": intermediateSuite
  }

getAllPuzzleProgress :: forall m. MonadEffect m => m (Map PuzzleId PuzzleProgress)
getAllPuzzleProgress = map (join >>> M.fromFoldable >>> M.catMaybes) $
  for (O.toUnfoldable allPuzzles :: Array _) \(Tuple suiteName suite) ->
    for (O.toUnfoldable suite :: Array _) \(Tuple puzzleName _) ->
      Tuple {suiteName, puzzleName} <$> getPuzzleProgress { suiteName, puzzleName}

identitySuite :: PuzzleSuite
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
