-- | Everything about pieces, re-exported.
-- |
-- | - `Types`, `Operation`, `PieceId`: what a piece is
-- | - `Catalogue.*`: the pieces themselves
-- | - `Property.*`: facts derived from a piece
-- | - `Transform.*`: turning one piece into another
module Game.Piece
  ( module Game.Piece.Catalogue
  , module Game.Piece.Catalogue.Arithmetic
  , module Game.Piece.Catalogue.Basic
  , module Game.Piece.Catalogue.Fuse
  , module Game.Piece.Catalogue.Unary
  , module Game.Piece.Catalogue.Wire
  , module Game.Piece.PieceId
  , module Game.Piece.Property.Complexity
  , module Game.Piece.Property.Ripple
  , module Game.Piece.Property.Simplify
  , module Game.Piece.Transform.Adapt
  , module Game.Piece.Transform.UpdateCapacity
  , module Game.Piece.Types
  ) where

import Game.Piece.Catalogue
import Game.Piece.Catalogue.Arithmetic
import Game.Piece.Catalogue.Basic
import Game.Piece.Catalogue.Fuse
import Game.Piece.Catalogue.Unary
import Game.Piece.Catalogue.Wire
import Game.Piece.PieceId
import Game.Piece.Property.Complexity
import Game.Piece.Property.Ripple
import Game.Piece.Property.Simplify
import Game.Piece.Transform.Adapt
import Game.Piece.Transform.UpdateCapacity
import Game.Piece.Types
