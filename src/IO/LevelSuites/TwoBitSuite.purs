module IO.LevelSuites.TwoBitSuite where

import Prelude

import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Direction as Direction
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Piece (idPiece, muxPiece)

twoBitSuite :: LevelSuite
twoBitSuite = fromHomogeneous
  { "Multiplexer":
    defaultLevel
      { problem =
        { goal: muxPiece
        , title: "Multiplexer"
        , description: "Use the multiplexer to combine the inputs on the top and left into one 2 bit output on the right"
        , testCases: binaryTestInputs [ Direction.Left, Direction.Up ]
        , requiresAutomaticTesting: false
        , pieceSet: S.fromFoldable [ idPiece, muxPiece ]
        , otherRestrictions: []
        }
      }
  }