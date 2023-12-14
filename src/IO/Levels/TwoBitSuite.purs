module IO.Levels.TwoBitSuite where

import Prelude

import Component.DataAttribute (nullSelector, selector)
import Component.DataAttribute as DataAttr
import Data.Map as M
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Direction as Direction
import Game.GameEvent (count, firstTime, latest, pieceAdded, pieceMovedTo, secondTime)
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Level.Problem (defaultProblem)
import Game.Message (addDelay, message)
import Game.Piece (fusePiece, idPiece, notPiece, severPiece, succPiece, twoBitCrossOver, xorPiece)
import Game.Signal (Signal(..))

twoBitSuite :: LevelSuite
twoBitSuite = fromHomogeneous
  { "Lovers Lake": defaultLevel
    { problem = defaultProblem
      { goal = fusePiece
      , title = "Lovers Lake"
      , description = "Use a fuse-piece to combine the inputs from the top and left, output the result to the right"
      , availablePieces = [fusePiece, idPiece]
      , testCases =
        [ M.singleton Direction.Left (Signal 0)
        , M.singleton Direction.Left (Signal 1)
        , M.singleton Direction.Left (Signal 2)
        , M.singleton Direction.Left (Signal 3)
        ]
      }
    }
  , "Two bit criss cross": defaultLevel
    { problem = defaultProblem
      { goal = twoBitCrossOver
      , title = "Two bit criss cross"
      , description = "Sever the input on the left with a sever-piece, cross over the signals, fuse them back together"
      , availablePieces = [severPiece, fusePiece, idPiece]
      , testCases =
        [ M.singleton Direction.Left (Signal 0)
        , M.singleton Direction.Left (Signal 1)
        , M.singleton Direction.Left (Signal 2)
        , M.singleton Direction.Left (Signal 3)
        ]
      }
    }
  , "Increment": defaultLevel
    { problem = defaultProblem
      { goal = succPiece
      , title = "Increment"
      , description = "Add one to the two bit input signal. if the input is 3 (which has no successor), output signal 0"
      , availablePieces = [xorPiece, notPiece, fusePiece, severPiece]
      , testCases =
        [ M.singleton Direction.Left (Signal 0)
        , M.singleton Direction.Left (Signal 1)
        , M.singleton Direction.Left (Signal 2)
        , M.singleton Direction.Left (Signal 3)
        ]
      }
    }
  }