module Resources.LevelSuites.ShiftingSuite where

import Prelude

import Data.Map as M
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction as Direction
import Game.Level (mkLevel)
import Game.Level.Suite (LevelSuite, toLevelSuite)
import Game.Piece (fusePiece, idPiece, leftPiece, mkShiftLeftBy, rightPiece, severPiece)
import Game.Piece.Signal (Signal(..))

shiftingSuite :: LevelSuite
shiftingSuite = toLevelSuite "Shifting Suite"
  [ mkLevel
    { goal: mkShiftLeftBy 1 FourBit
    , name: "4 bit left shift"
    , description: "For each of the 4 bits in the input, shift them up towards the left by one place\n bluefdsajafdskl"
    , testCases: M.singleton Direction.Left <$> [ Signal 0, Signal 1, Signal 2, Signal 3, Signal 8, Signal 9, Signal 15]
    , requiresAutomaticTesting: false
    , availablePieces: [ severPiece, fusePiece, idPiece, leftPiece, rightPiece ]
    , otherRestrictions: []
    }
  ]


    --, "Exclusive Or": defaultLevel
    --  { problem =
    --    { goal: xorPiece
    --    , title: "Exclusive Or"
    --    , description: "Output true when EXACTLY one input is true. If both inputs are true, output false"
    --    , testCases: binaryTestInputs [ Direction.Left, Direction.Up ]
    --    , requiresAutomaticTesting: false
    --    , availablePieces: [ idPiece, notPiece, orPiece, andPiece, crossPiece ]
    --    , otherRestrictions: []
    --    }
    --  }