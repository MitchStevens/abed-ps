module Game.Piece.ComparisonPiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Foldable (fold)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece (Piece(..), PieceId(..), mkPieceNoAdapt)
import Game.Piece as Complexity
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Port (inputPort, noPort, outputPort)

allComparisonPieces :: Array Piece
allComparisonPieces =
  [ mkEqualPiece OneBit
  , mkGreaterThanPiece OneBit
  , mkLessThanPiece OneBit
  ]

type ComparisonPiece =
  { name :: PieceId
  , op :: PieceOperation
  , capacity :: Capacity
  }

mkComparisonPiece :: ComparisonPiece -> Piece
mkComparisonPiece piece@{ name, op, capacity } = mkPieceNoAdapt
  { name
  , op
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort OneBit)
      , Tuple Direction.Left (inputPort capacity)
      ]
  , complexity: Complexity.space 0.0

  , shouldRipple: false
  , updateCapacity: \dir capacity' -> do
      guard (dir `elem` [Direction.Left, Direction.Up])
      pure $ mkComparisonPiece (piece {capacity = capacity'})
  , isSimplifiable: Nothing
  }

mkEqualPiece :: Capacity -> Piece
mkEqualPiece capacity = mkComparisonPiece { name: PieceId "equal-piece", op: Operation.Equal, capacity }

mkGreaterThanPiece :: Capacity -> Piece
mkGreaterThanPiece capacity = mkComparisonPiece { name: PieceId "greater-than-piece", op: Operation.GreaterThan, capacity }

mkLessThanPiece :: Capacity -> Piece
mkLessThanPiece capacity = mkComparisonPiece { name: PieceId "less-than-piece", op: Operation.LessThan, capacity }
