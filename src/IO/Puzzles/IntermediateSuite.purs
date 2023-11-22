module IO.Puzzles.IntermediateSuite where

import Prelude

import Component.DataAttribute (nullSelector, selector)
import Component.DataAttribute as DataAttr
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.GameEvent (count, firstTime, latest, pieceAdded, pieceMovedTo, secondTime)
import Game.Location (location)
import Game.Location as Direction
import Game.Message (addDelay, message)
import Game.Piece (name)
import Game.Piece.BasicPiece (allBasicPieces, crossPiece, xorPiece)
import Game.Puzzle (PuzzleSuite, binaryTestInputs, defaultPuzzle)
import Game.RulesEngine (Rule(..))

intermediateSuite :: PuzzleSuite
intermediateSuite = fromHomogeneous
  { "Criss(t) cross":
    defaultPuzzle
      { problem =
        { goal: crossPiece
        , title: "Cross over"
        , description: "Propogate the signal on the left to the right, and the top to the bottom"
        , testCases: binaryTestInputs [ Direction.Left, Direction.Up ]
        , requiresAutomaticTesting: false
        , pieceSet: S.fromFoldable (map name allBasicPieces)
        , otherRestrictions: []
        }
      , boardDeltaRulesEngine = []
        --let l1 = location 2 1
        --    l2 = location 0 1
        --    l3 = location 1 1
        --in
        --  [ Rule (firstTime pieceAdded) $
        --    guiding "move this piece to location (2,1)" $
        --      selector DataAttr.location l1
        --  , Rule (firstTime (pieceMovedTo l1)) $
        --    guiding "add another piece" $
        --      selector DataAttr.availablePiece (name idPiece)
        --  , Rule (secondTime pieceAdded) $
        --    guiding "move piece to (0, 1)" $
        --      selector DataAttr.location l2
        --  , Rule (firstTime (pieceMovedTo l2)) $
        --    guiding "add one more final id piece" $
        --      selector DataAttr.availablePiece (name idPiece)
        --  , Rule ((count eq 3 && latest) pieceAdded) $
        --    guiding "move piece to (1, 1)" $
        --      selector DataAttr.location l3
        --  ]
      , conversation = addDelay <$>
        [ message "mitch" "criss cross" ]
      }
  --, "Negation":
  --  { problemDescription:
  --    { goal: mkPiece notPiece
  --    , title: "Negation"
  --    , description: "Negate the signal inputed on the Left and output it on the Right"
  --    , testCases: basicTestCases
  --    , requiresAutomaticTesting: false
  --    , pieceSet: S.fromFoldable [ mkPiece idPiece ]
  --    , otherRestrictions: []
  --    }
  --  , conversation: []
  --  }
  --, "Disjunction":
  --  { problemDescription:
  --    { goal: mkPiece orPiece
  --    , title: "Disjunction"
  --    , description: "dijunction"
  --    , testCases: basicTestCases
  --    , requiresAutomaticTesting: false
  --    , pieceSet: S.fromFoldable [ mkPiece idPiece, mkPiece orPiece ]
  --    , otherRestrictions: []
  --    }
  --  , conversation: []
  --  }
  --, "Conjugation":
  --  { problemDescription:
  --    { goal: mkPiece andPiece
  --    , title: "Conjugation"
  --    , description: "conj"
  --    , testCases: basicTestCases
  --    , requiresAutomaticTesting: false
  --    , pieceSet: S.fromFoldable [ mkPiece idPiece, mkPiece andPiece ]
  --    , otherRestrictions: []
  --    }
  --  , conversation: []
  --  }
  --, "Constant True":
  --  { problemDescription:
  --    { goal: mkPiece truePiece
  --    , title: "True"
  --    , description: "const true"
  --    , testCases: basicTestCases
  --    , requiresAutomaticTesting: false
  --    , pieceSet: S.fromFoldable
  --        [ mkPiece idPiece, mkPiece notPiece, mkPiece orPiece, mkPiece andPiece ]
  --    , otherRestrictions: []
  --    }
  --  , conversation: []
  --  }
  --, "Constant False":
  --  { problemDescription:
  --    { goal: mkPiece notPiece
  --    , title: "Constant False"
  --    , description: ""
  --    , testCases: basicTestCases
  --    , requiresAutomaticTesting: false
  --    , pieceSet: S.fromFoldable
  --        [ mkPiece idPiece, mkPiece notPiece, mkPiece orPiece, mkPiece andPiece ]
  --    , otherRestrictions: []
  --    }
  --  , conversation: []
  --  }
    }