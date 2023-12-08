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
import Game.Piece (idPiece, name, notPiece, severPiece, twoBitCrossOver, xorPiece)
import Game.Piece.Arithmetic (succPiece)
import Game.Piece.BasicPiece (allBasicPieces, crossPiece, xorPiece)
import Game.Piece.FusePiece (fusePiece)
import Game.Signal (Signal(..))

twoBitSuite :: LevelSuite
twoBitSuite = fromHomogeneous
  { "Lovers Lake": defaultLevel
    { problem = defaultProblem
      { goal = fusePiece
      , title = "Lovers Lake"
      , description = "Use a multiplexer to combine the inputs from the top and left, output the result to the right"
      , pieceSet = S.fromFoldable (map name [fusePiece, idPiece])
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
      , description = "Sever the input on the left, cross over the signals, fuse them back together"
      , pieceSet = S.fromFoldable (map name [severPiece, fusePiece, idPiece])
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
      , pieceSet = S.fromFoldable (map name [xorPiece, notPiece, fusePiece, severPiece])
      , testCases =
        [ M.singleton Direction.Left (Signal 0)
        , M.singleton Direction.Left (Signal 1)
        , M.singleton Direction.Left (Signal 2)
        , M.singleton Direction.Left (Signal 3)
        ]
      }
    }
  }