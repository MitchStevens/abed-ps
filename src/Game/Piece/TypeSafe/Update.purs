module Game.Piece.TypeSafe.Update where

import Prelude

import Game.Piece as Piece

type HasUpdateCapacity r = ( updateCapacity :: Piece.Direction -> Piece.Capacity -> Piece )


-- dir -> capacity -> Piece
updateCapacity :: 
updatecapa