module Resources.LevelSuites.ShiftingSuite where

import Prelude

import Component.DataAttribute as DataAttr
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Map as M
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Piece (fusePiece, idPiece, leftPiece, mkShiftLeftBy, rightPiece, severPiece)
import Game.Signal (Signal(..), mkSignal)

shiftingSuite :: LevelSuite
shiftingSuite = fromHomogeneous
  { "4 bit left shift":
    defaultLevel
      { problem =
        { goal: mkShiftLeftBy 1 FourBit
        , title: "4 bit left shift"
        , description: "For each of the 4 bits in the input, shift them up towards the left by one place\n bluefdsajafdskl"
        , testCases: M.singleton Direction.Left <$> (map mkSignal [ 0, 1, 2, 3, 8, 9, 15] )
        , requiresAutomaticTesting: false
        , availablePieces: NonEmptyArray [ severPiece, fusePiece, idPiece, leftPiece, rightPiece ]
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