module Resources.LevelSuites.DebugSuite where

import Prelude

import Data.Lens (set)
import Data.Maybe (Maybe(..))
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Direction as Direction
import Game.Board (Board, Cell(..), _wormhole, leafCells, standardBoard)
import Game.Direction (CardinalDirection)
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel)
import Game.Level.Problem (defaultProblem)
import Game.Piece (allBasicPieces, allFusePieces, idPiece)

-- | Levels for trying things out while developing. Only listed when the log
-- | level is Debug or below, see `Resources.LevelSuites.allLevelSuites`.
debugSuite :: LevelSuite
debugSuite = fromHomogeneous
  { "test01": defaultLevel
    { problem = defaultProblem
      { goal = idPiece
      , title = "test01"
      , description = "Testing level with every non-wire piece and the wormhole boards available"
      , availablePieces = leafCells (allBasicPieces <> allFusePieces)
          <> S.fromFoldable (Nested <$> wormholeBoards)
      , testCases = binaryTestInputs [ Direction.Left ]
      }
    }
  }

-- | Blank boards, one for each shape of wormhole up to rotation.
wormholeBoards :: Array Board
wormholeBoards =
  [ wormholeBoard Direction.Up Direction.Down
  , wormholeBoard Direction.Up Direction.Right
  , wormholeBoard Direction.Right Direction.Up
  ]

wormholeBoard :: CardinalDirection -> CardinalDirection -> Board
wormholeBoard wormholeIn wormholeOut =
  set _wormhole (Just { wormholeIn, wormholeOut }) standardBoard
