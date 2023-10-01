module IO.Puzzles where

import Prelude

import Component.Puzzle as Puzzle
import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Set as S
import Data.Tuple (Tuple(..))
import Foreign.Object (Object, fromHomogeneous)
import Game.Location as Direction
import Game.Piece (mkPiece)
import Game.Piece.BasicPiece (andPiece, idPiece, notPiece, orPiece)
import Game.ProblemDescription (countPiecesOfType)
import IO.Conversations (conversation1, conversation2)

{-
all puzzles
  - suites
    - individul puzzles

-}



puzzles :: Object Puzzle.Input
puzzles = fromHomogeneous
  { doubleNegation: 
    { problemDescription:
      { goal: mkPiece idPiece
      , title: "Double negation"
      , description: "create an idenity from not gate"
      , testCases: [ M.singleton Direction.Left ff, M.singleton Direction.Left tt ]
      , requiresAutomaticTesting: false
      , pieceSet: S.fromFoldable [ mkPiece idPiece, mkPiece notPiece]
      , otherRestrictions:
        [ { name: "only one id",
            description: "only one id in t board is allowed", 
            restriction: \b -> countPiecesOfType b idPiece <= 1
          }
        ]
      }
    , conversation: conversation1
    }
  , orProblem:
      { problemDescription:
        { goal: mkPiece orPiece
        , title: "or problem"
        , description: "create or from and an not"
        , testCases: [ testCase ff ff, testCase ff tt, testCase tt tt ]
        , requiresAutomaticTesting: false
        , pieceSet: S.fromFoldable [ mkPiece notPiece, mkPiece andPiece, mkPiece idPiece ]
        , otherRestrictions: []
        }
      , conversation: conversation2

      }
    }
  where
    testCase x y = M.fromFoldable [ Tuple Direction.Up x, Tuple Direction.Left y ]
