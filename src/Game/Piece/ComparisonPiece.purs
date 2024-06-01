module Game.Piece.ComparisonPiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Foldable (fold)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Ord (greaterThan, lessThan)
import Data.Tuple (Tuple(..))
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction as Direction
import Game.Piece (Piece(..), PieceId(..))
import Game.Piece as Complexity
import Game.Piece.Port (inputPort, outputPort)
import Game.Piece.Signal (Signal(..))

allComparisonPieces :: Array Piece
allComparisonPieces =
  [ mkEqualPiece OneBit
  , mkGreaterThanPiece OneBit
  , mkLessThanPiece OneBit
  ]

type ComparisonPiece =
  { name :: PieceId
  , comparison :: Signal -> Signal -> Boolean
  , capacity :: Capacity
  }

mkComparisonPiece :: ComparisonPiece -> Piece
mkComparisonPiece piece@{ name, comparison, capacity } = Piece
  { name
  , eval: \inputs ->
      let a = fold (M.lookup Direction.Left inputs)
          b = fold (M.lookup Direction.Up inputs)
      in M.singleton Direction.Right (Signal (if comparison a b then 1 else 0))
  , complexity: Complexity.space 0.0

  , shouldRipple: false
  , updateCapacity: \dir capacity' -> do
      guard (dir `elem` [Direction.Left, Direction.Up])
      pure $ mkComparisonPiece (piece {capacity = capacity'})

  , ports: M.fromFoldable
      [ Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort OneBit)
      , Tuple Direction.Left (inputPort capacity)
      ]
  , updatePort: \_ _ -> Nothing

  , isSimplifiable: Nothing
  }

mkEqualPiece :: Capacity -> Piece
mkEqualPiece capacity = mkComparisonPiece { name: PieceId "equal-piece", comparison: eq, capacity }

mkGreaterThanPiece :: Capacity -> Piece
mkGreaterThanPiece capacity = mkComparisonPiece { name: PieceId "greater-than-piece", comparison: greaterThan, capacity }

mkLessThanPiece :: Capacity -> Piece
mkLessThanPiece capacity = mkComparisonPiece { name: PieceId "less-than-piece", comparison: lessThan, capacity }
