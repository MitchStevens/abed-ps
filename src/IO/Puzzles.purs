module IO.Puzzles where

import Prelude

import Component.Chat as Chat
import Data.HeytingAlgebra (ff, tt)
import Data.Time.Duration (Seconds(..))
import Data.Tuple (Tuple(..))
import Foreign.Object (Object, fromHomogeneous)
import Game.Board.BoardDelta (BoardDelta(..))
import Game.Board.BoardDeltaStore (BoardDeltaStore, count, firstTime, latest, pieceAdded, pieceMovedTo, secondTime)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, location)
import Game.Location as Direction
import Game.Message (Message, guiding)
import Game.Piece (mkPiece, name)
import Game.Piece.BasicPiece (andPiece, idPiece, notPiece, orPiece, truePiece)
import Game.ProblemDescription (ProblemDescription, countPiecesOfType)
import Game.PuzzleSuite (PuzzleSuite)
import Game.RulesEngine (Rule(..))
import IO.Puzzles.TutorialSuite (tutorialSuite)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))


allPuzzles :: Object PuzzleSuite
allPuzzles = fromHomogeneous
  { "Tutorial Suite": tutorialSuite
  , "Identity Suite": identitySuite
  , "Intermediate Suite": intermediateSuite
  }

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

intermediateSuite :: PuzzleSuite
intermediateSuite = fromHomogeneous {}
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
