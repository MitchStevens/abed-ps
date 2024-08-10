module Game.Piece.TypeSafe.Direction where

import Prelude

import Game.Piece as Piece

class DirectionValue (symbol :: Symbol) where
  getDirectionValue :: Piece.CardinalDirection

instance DirectionValue "u" where getDirectionValue = Piece.Up
instance DirectionValue "r" where getDirectionValue = Piece.Right
instance DirectionValue "d" where getDirectionValue = Piece.Down
instance DirectionValue "l" where getDirectionValue = Piece.Left

type Up = "u"
type Right = "r"
type Down = "d"
type Left = "l"
