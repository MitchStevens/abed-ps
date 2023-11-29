module Game.Piece.APiece
  ( APiece
  , mkPiece
  , unPiece
  )
  where

import Prelude

import Data.Function (on)
import Game.Piece.Class (class Piece, eval, getCapacity, getPorts, name, updateCapacity, updatePort)

{-
  An `APiece` is an abstract piece. Specific piece types (`BasicPiece`, `WirePiece`, etc) are converted to `APiece`s so they can be stored in a board.


  data Piece =
    WirePiece ...
    BasicPiece ...




  ```
  interface Piece { ...

  class WirePiece implements Piece
  class BasicPiece implements Piece
  
  ```

-}
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
  getCapacity = unPiece getCapacity
  updateCapacity capacity (APiece piece) = piece (\p -> map mkPiece (updateCapacity capacity p))
  eval = unPiece eval
  getPorts = unPiece getPorts
  updatePort dir port (APiece piece) = piece (\p -> map mkPiece (updatePort dir port p))

