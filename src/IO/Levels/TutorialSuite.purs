module IO.Levels.TutorialSuite where

import Prelude

import Component.DataAttribute (nullSelector, selector)
import Component.DataAttribute as DataAttr
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens ((.~))
import Data.Maybe (Maybe(..))
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Direction as Direction
import Game.GameEvent (count, firstTime, latest, pieceAdded, pieceMovedTo, secondTime)
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Level.RulesEngine (Rule(..))
import Game.Location (location)
import Game.Message (_selector, addDelay, fromGuide)
import Game.Piece (idPiece, notPiece)

tutorialSuite :: LevelSuite
tutorialSuite = fromHomogeneous
  { "From A to B":
    defaultLevel
      { problem =
        { goal: idPiece
        , title: "From A to B"
        , description: "Propagate the signal inputed on the Left to the Right"
        , testCases: binaryTestInputs [ Direction.Left ]
        , requiresAutomaticTesting: false
        , availablePieces: [ idPiece ]
        , otherRestrictions: []
        }
      , boardDeltaRulesEngine =
        let l1 = location 2 1
            l2 = location 0 1
            l3 = location 1 1
        in
          [ Rule (firstTime pieceAdded) $
            fromGuide "move this piece to location (2,1)" #
              _selector .~ Just (selector DataAttr.location l1)
          , Rule (firstTime (pieceMovedTo l1)) $
            fromGuide "add another piece" #
              _selector .~ Just (selector DataAttr.availablePiece idPiece)
          --, Rule (secondTime pieceAdded) $
          --  guiding "move piece to (0, 1)" $
          --    selector DataAttr.location l2
          --, Rule (firstTime (pieceMovedTo l2)) $
          --  guiding "add one more final id piece" $
          --    selector DataAttr.availablePiece (name idPiece)
          --, Rule ((count eq 3 && latest) pieceAdded) $
          --  guiding "move piece to (1, 1)" $
          --    selector DataAttr.location l3
          ]
      , conversation = mapWithIndex (\i m -> if i == 0 then m else addDelay m) $
        []
        --[ fromGuide "welcome to ABED! click 'id' to get started adding pieces!" #
        --  _selector .~ Just (selector DataAttr.availablePiece (name idPiece))
        --]
      }
  , "Negation":
    defaultLevel
      { problem =
        { goal: notPiece
        , title: "Negation"
        , description: "Negate the signal inputed on the Left and output it on the Right"
        , testCases: binaryTestInputs [Direction.Left]
        , requiresAutomaticTesting: false
        , availablePieces: [ idPiece, notPiece ]
        , otherRestrictions: []
        }
      }
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