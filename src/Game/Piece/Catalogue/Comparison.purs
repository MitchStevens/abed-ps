module Game.Piece.Catalogue.Comparison where

import Prelude

import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..))
import Game.Port (inputPort, noPort, outputPort)

allComparisonPieces :: Array Piece
allComparisonPieces =
  [ mkEqualPiece OneBit
  , mkGreaterThanPiece OneBit
  , mkLessThanPiece OneBit
  ]

type ComparisonPiece =
  { op :: PieceOperation
  , capacity :: Capacity
  }

mkComparisonPiece :: ComparisonPiece -> Piece
mkComparisonPiece { op, capacity } = Piece
  { op
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort OneBit)
      , Tuple Direction.Left (inputPort capacity)
      ]
  }

mkEqualPiece :: Capacity -> Piece
mkEqualPiece capacity = mkComparisonPiece { op: Operation.Equal, capacity }

mkGreaterThanPiece :: Capacity -> Piece
mkGreaterThanPiece capacity = mkComparisonPiece { op: Operation.GreaterThan, capacity }

mkLessThanPiece :: Capacity -> Piece
mkLessThanPiece capacity = mkComparisonPiece { op: Operation.LessThan, capacity }
