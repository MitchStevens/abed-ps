module Resources.LevelSuites.IntermediateSuite (intermediateSuite) where

import Prelude

import Component.DataAttribute as DataAttr
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Foldable (all)
import Data.Set as S
import Foreign.Object (fromHomogeneous)
import Game.Board (Board(..))
import Game.Direction as Direction
import Game.Level (LevelSuite, binaryTestInputs, defaultLevel, toLevelSuite)
import Game.Piece (andPiece, crossPiece, idPiece, leftPiece, name, notPiece, orPiece, rightPiece, superPiece, xorPiece)

intermediateSuite :: LevelSuite
intermediateSuite = toLevelSuite
  [ crissCrossLevel
  , xorLevel
  ]
  where
    crissCrossLevel = defaultLevel
      { goal = crossPiece
      , title = "Cross over"
      , description = "Propogate the signal on the left to the right, and the top to the bottom"
      , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
      , availablePieces = S.fromFoldable [ xorPiece ]
      --, otherRestrictions =
      --  [ { name: "Prohibited Piece"
      --    , description: "You can't use the CrossOver piece in this level"
      --    , restriction: \(Board b) -> flip all b.pieces (\info -> info.piece /= crossPiece)
      --  }
      --  ]
      }

    xorLevel = defaultLevel
      { goal = xorPiece
      , title = "Exclusive Or: Pick One"
      , description = "Output true when EXACTLY one input is true. If both inputs are true, output false"
      , testCases = binaryTestInputs [ Direction.Left, Direction.Up ]
      , availablePieces = S.fromFoldable [ idPiece, notPiece, orPiece, andPiece, crossPiece ]
      }