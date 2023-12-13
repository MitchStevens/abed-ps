module Game.Piece.APiece
  ( APiece
  , mkPiece
  , unPiece
  )
  where

import Prelude

import Data.Function (on)
import Game.Piece.Class (class Piece, eval, getCapacity, getPorts, name, complexity, shouldRipple, updateCapacity, updatePort)

-- abstract piece
newtype APiece = APiece (forall r. (forall p. Piece p => p -> r) -> r)

instance Eq APiece where
  eq = eq `on` name
instance Ord APiece where
  compare = compare `on` name
instance Show APiece where
  show p = "Piece " <> (show (name p))

mkPiece :: forall p. Piece p => p -> APiece
mkPiece piece = APiece (_ $ piece)

unPiece :: forall r. (forall p. Piece p => p -> r) -> APiece -> r
unPiece f (APiece piece) = piece f

instance Piece APiece where
  name = unPiece name
  eval = unPiece eval
  complexity = unPiece complexity

  shouldRipple = unPiece shouldRipple
  getCapacity = unPiece getCapacity
  updateCapacity dir capacity (APiece piece) = piece (\p -> mkPiece <$> updateCapacity dir capacity p)

  getPorts = unPiece getPorts
  updatePort dir port (APiece piece) = piece (\p -> mkPiece <$> updatePort dir port p)

