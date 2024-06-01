module Resources.LevelSuites.TwoBitSuite where

import Prelude

import Component.DataAttribute as DA
import Data.Map as M
import Data.Set as S
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction as Direction
import Game.Level (mkLevel)
import Game.Level.Suite (LevelSuite, toLevelSuite)
import Game.Piece (fusePiece, idPiece, notPiece, severPiece, succPiece, xorPiece, mkConnectionPiece)
import Game.Piece.Signal (Signal(..))
import Resources.LevelSuites.TwoBit.Pieces (twoBitCrossOver)

twoBitSuite :: LevelSuite
twoBitSuite = toLevelSuite "Two Bit"
  [ mkLevel
    { name: "From 2A to 2B"
    , goal: mkConnectionPiece { capacity: TwoBit, outputs: S.singleton Direction.Right }
    , description: "This looks familiar, but the input and output ports have a capacity of 2 bits! Build a path between the left and the right, then use the '2' key to increase the capacity of the path. The capacity of each port is colour coded, only ports with the same capacity can connect!"
    , availablePieces: [ idPiece ]
    , testCases:
      [ M.singleton Direction.Left (Signal 0)
      , M.singleton Direction.Left (Signal 1)
      , M.singleton Direction.Left (Signal 2)
      , M.singleton Direction.Left (Signal 3)
      ]
    }
  , mkLevel
    { name: "Lovers Lake"
    , goal: fusePiece
    , description: "Use a fuse-piece to combine the inputs from the top and left, output the result to the right"
    , availablePieces: [fusePiece, idPiece]
    , testCases:
      [ M.singleton Direction.Left (Signal 0)
      , M.singleton Direction.Left (Signal 1)
      , M.singleton Direction.Left (Signal 2)
      , M.singleton Direction.Left (Signal 3)
      ]
    }
  , mkLevel
    { name: "Two bit criss cross"
    , goal: twoBitCrossOver
    , description: "Sever the input on the left with a sever-piece, cross over the signals, fuse them back together"
    , availablePieces: [severPiece, fusePiece, idPiece]
    , testCases:
      [ M.singleton Direction.Left (Signal 0)
      , M.singleton Direction.Left (Signal 1)
      , M.singleton Direction.Left (Signal 2)
      , M.singleton Direction.Left (Signal 3)
      ]
    }
  , mkLevel
    { name: "Increment"
    , goal: succPiece
    , description: "Add one to the two bit input signal. if the input is 3 (which has no successor), output signal 0"
    , availablePieces: [xorPiece, notPiece, fusePiece, severPiece]
    , testCases:
      [ M.singleton Direction.Left (Signal 0)
      , M.singleton Direction.Left (Signal 1)
      , M.singleton Direction.Left (Signal 2)
      , M.singleton Direction.Left (Signal 3)
      ]
    }
  ]