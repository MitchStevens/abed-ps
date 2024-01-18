module IO.Levels.ShiftingSuite where

import Prelude

import Component.DataAttribute (availablePiece, nullSelector, selector)
import Component.DataAttribute as DataAttr
import Data.Map as M
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.GameEvent (count, firstTime, latest, pieceAdded, pieceMovedTo, secondTime)
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Piece (fusePiece, idPiece, leftPiece, mkShiftLeft, rightPiece, severPiece)
import Game.Signal (Signal(..))

shiftingSuite :: LevelSuite
shiftingSuite = fromHomogeneous
  { "4 bit left shift":
    defaultLevel
      { problem =
        { goal: mkShiftLeft FourBit
        , title: "4 bit left shift"
        , description: "For each of the 4 bits in the input, shift them up towards the left by one place\n bluefdsajafdskl"
        , testCases: M.singleton Direction.Left <$> [ Signal 0, Signal 1, Signal 2, Signal 3, Signal 8, Signal 9, Signal 15]
        , requiresAutomaticTesting: false
        , availablePieces: [ severPiece, fusePiece, idPiece, leftPiece, rightPiece ]
        , otherRestrictions: []
        }
      }
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
    }