module IO.Puzzles where

import Prelude

import Component.Chat as Chat
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Set as S
import Data.Time.Duration (Seconds(..))
import Data.Tuple (Tuple(..))
import Foreign.Object (Object, fromHomogeneous)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection)
import Game.Location as Direction
import Game.Piece (mkPiece)
import Game.Piece.BasicPiece (andPiece, idPiece, notPiece, orPiece, truePiece)
import Game.ProblemDescription (ProblemDescription, countPiecesOfType)
import IO.Conversations (conversation1, conversation2)

{-
all puzzles
  - suites
    - individul puzzles

-}
allPuzzles :: Object PuzzleSuite
allPuzzles = fromHomogeneous
  { "Tutorial Suite": tutorialSuite
  , "Identity Suite": identitySuite
  , "Intermediate Suite": intermediateSuite
  }


type PuzzleSuite = Object
  { problemDescription :: ProblemDescription
  , conversation :: Array (Chat.Message ( delayBy :: Seconds ))
  }

basicTestCases :: Array (Map CardinalDirection Signal)
basicTestCases = do
  x <- [ff, tt]
  y <- [ff, tt]
  --z <- [ff, tt]
  pure $ M.fromFoldable
    [ Tuple Direction.Up x
    , Tuple Direction.Left y
    ]


-- intros id, not, and, or, true, false
tutorialSuite :: PuzzleSuite
tutorialSuite = fromHomogeneous
  { "From A to B":
    { problemDescription:
      { goal: mkPiece idPiece
      , title: "From A to B"
      , description: "Propagate the signal inputed on the Left to the Right"
      , testCases: basicTestCases
      , requiresAutomaticTesting: false
      , pieceSet: S.fromFoldable [ mkPiece idPiece ]
      , otherRestrictions: []
      }
    , conversation: []
    }
  , "Negation":
    { problemDescription:
      { goal: mkPiece notPiece
      , title: "Negation"
      , description: "Negate the signal inputed on the Left and output it on the Right"
      , testCases: basicTestCases
      , requiresAutomaticTesting: false
      , pieceSet: S.fromFoldable [ mkPiece idPiece ]
      , otherRestrictions: []
      }
    , conversation: []
    }
  , "Disjunction":
    { problemDescription:
      { goal: mkPiece orPiece
      , title: "Disjunction"
      , description: "dijunction"
      , testCases: basicTestCases
      , requiresAutomaticTesting: false
      , pieceSet: S.fromFoldable [ mkPiece idPiece, mkPiece orPiece ]
      , otherRestrictions: []
      }
    , conversation: []
    }
  , "Conjugation":
    { problemDescription:
      { goal: mkPiece andPiece
      , title: "Conjugation"
      , description: "conj"
      , testCases: basicTestCases
      , requiresAutomaticTesting: false
      , pieceSet: S.fromFoldable [ mkPiece idPiece, mkPiece andPiece ]
      , otherRestrictions: []
      }
    , conversation: []
    }
  , "Constant True":
    { problemDescription:
      { goal: mkPiece truePiece
      , title: "True"
      , description: "const true"
      , testCases: basicTestCases
      , requiresAutomaticTesting: false
      , pieceSet: S.fromFoldable
          [ mkPiece idPiece, mkPiece notPiece, mkPiece orPiece, mkPiece andPiece ]
      , otherRestrictions: []
      }
    , conversation: []
    }
  , "Constant False":
    { problemDescription:
      { goal: mkPiece notPiece
      , title: "Constant False"
      , description: ""
      , testCases: basicTestCases
      , requiresAutomaticTesting: false
      , pieceSet: S.fromFoldable
          [ mkPiece idPiece, mkPiece notPiece, mkPiece orPiece, mkPiece andPiece ]
      , otherRestrictions: []
      }
    , conversation: []
    }
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
