module Game.Piece.TypeSafe.Name where


import Data.Symbol (class IsSymbol, reflectSymbol)
import Game.Piece (PieceId(..))
import Game.Piece.TypeSafe.PieceSpec (PieceSpec, insert)
import Prim.Row (class Lacks)
import Type.Proxy (Proxy(..))

type HasName r = (name :: PieceId | r)

specName :: forall @name i o r
  .  IsSymbol name
  => Lacks "name" r
  => PieceSpec i o r (HasName r)
specName = insert @"name" (PieceId (reflectSymbol (Proxy :: Proxy name)))
