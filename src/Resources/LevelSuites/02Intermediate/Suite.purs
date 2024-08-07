module Resources.LevelSuites.Intermediate.Suite where

import Prelude

import Game.Piece.Direction as Direction
import Game.Level (binaryTestInputs, mkLevel)
import Game.Level.Suite (LevelSuite, toLevelSuite)
import Game.Piece (andPiece, crossPiece, idPiece, leftPiece, notPiece, orPiece, rightPiece, superPiece, xorPiece)


intermediateSuite :: LevelSuite
intermediateSuite = toLevelSuite "Intermediate Suite"
  [ mkLevel
    { goal: crossPiece
    , name: "Tangled"
    , description: "Propogate the signal on the left to the right, and the top to the bottom"
    , testCases: binaryTestInputs [ Direction.Left, Direction.Up ]
    , requiresAutomaticTesting: false
    , availablePieces: [idPiece, superPiece, leftPiece, rightPiece, xorPiece]
    , otherRestrictions: []
    }
  , mkLevel
    { goal: andPiece
    , name: "DeMorgoofs"
    , description: "Create an and-piece using only or-piece and not-piece"
    , testCases: binaryTestInputs [ Direction.Left, Direction.Up ]
    , availablePieces: [ orPiece, notPiece ]
    } 
  , mkLevel
    { goal: xorPiece
    , name: "Fancy Or"
    , description: "Output true when EXACTLY one input is true. If both inputs are true, output false"
    , testCases: binaryTestInputs [ Direction.Left, Direction.Up ]
    , requiresAutomaticTesting: false
    , availablePieces: [ idPiece, notPiece, orPiece, andPiece, crossPiece ]
    , otherRestrictions: []
    }
  ]