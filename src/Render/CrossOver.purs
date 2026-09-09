module Render.CrossOver
  ( crossOverLegPairs
  ) where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece (Piece, chickenPiece, cornerCutPiece, crossPiece, name, reverseChickenPiece)

-- | The two independent input/output direction pairs making up a
-- | dual-input/dual-output crossover piece -- one pair per wire loop through
-- | the piece, each rendered (and animated) independently of the other.
-- | `Nothing` for any piece that isn't one of the four crossover pieces.
crossOverLegPairs
  :: Piece
  -> Maybe (Tuple (Tuple CardinalDirection CardinalDirection) (Tuple CardinalDirection CardinalDirection))
crossOverLegPairs piece
  | name piece == name crossPiece =
      Just (Tuple (Tuple Direction.Left Direction.Right) (Tuple Direction.Up Direction.Down))
  | name piece == name cornerCutPiece =
      Just (Tuple (Tuple Direction.Left Direction.Down) (Tuple Direction.Up Direction.Right))
  | name piece == name chickenPiece =
      Just (Tuple (Tuple Direction.Left Direction.Down) (Tuple Direction.Right Direction.Up))
  | name piece == name reverseChickenPiece =
      Just (Tuple (Tuple Direction.Left Direction.Right) (Tuple Direction.Up Direction.Down))
  | otherwise = Nothing
