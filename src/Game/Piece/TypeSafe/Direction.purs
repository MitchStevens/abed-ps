module Game.Piece.TypeSafe.Direction where

import Prelude

import Game.Piece as Piece
import Partial.Unsafe (unsafeCrashWith)
import Prim.RowList (Cons, RowList)

class DirectionValue (symbol :: Symbol) where
  getDirectionValue :: Piece.CardinalDirection

instance DirectionValue "u" where getDirectionValue = Piece.Up
instance DirectionValue "r" where getDirectionValue = Piece.Right
instance DirectionValue "d" where getDirectionValue = Piece.Down
instance DirectionValue "l" where getDirectionValue = Piece.Left

type DirectionalRow :: Type -> Row Type
type DirectionalRow a = ( u :: a, r :: a, d :: a, l :: a )









newtype Directional a = Directional (Record (DirectionalRow a))

class Directed f a where
  fromDirectional :: Directional a -> f
  toDirectional :: f -> Directional a

class DirectedRecord :: RowList Type -> Type -> Constraint
class DirectedRecord f a where
  fromDirectional :: Directional a -> f
  toDirectional :: f -> Directional a

instance 
  ( DirectedRecord rest

  ) => DirectedRecord (Cons dir x rest directed) Signal



instance Directed (Record ()) a where
  fromDirectional 


instance Directed (Record (u :: a)) a where
  fromDirectional = unsafeCrashWith ""
  toDirectional = unsafeCrashWith ""

instance (Directed f, Directed g) => Union


toArray ::forall a. Directional a -> Array a
toArray (Directional { u, r, d, l }) = [ u, r, d, l ]

instance Functor Directional where
  map f (Directional { u, r, d, l }) =
    Directional { u: f u, r: f r, d: f d, l: f l }

instance Foldable Directional where
  foldr f z = toArray >>> foldr f z
  foldl f z = toArray >>> foldl f z
  foldMap f = toArray >>> foldMap f

instance Traversable Directional where
  traverse f (Directional x) = ado
    u <- f x.u
    r <- f x.r
    d <- f x.d
    l <- f x.l
    pure $ Directional { u, r, d, l }

  sequence directional = ado
    Directional x <- directional
    u <- f x.u
    r <- f x.r
    d <- f x.d
    l <- f x.l
    pure $ Directional { u, r, d, l }

instance FunctorWithIndex Direction Directional where
  mapWithIndex f (Directional { u, r, d, l }) =
    Directional { u: f Up u, r: f Right r, d: f Down d l: f Left l }

instance FoldableWithIndex Direction Directional where
  foldrWithIndex f z (Directional { u, r, d, l }) =
    f Left l $ f Down d $ f Right r $ f Up u z
  foldlWithIndex f z (Directional { u, r, d, l }) =
    f Up (f Right (f Down (f Left z l) d) r) u
  foldMap f directions = Array.fold (zipWith allDirections (toArray directional))

instance TraversableWithIndex Direction Directional where
  traverseWithIndex f (Directional x) = ado
    u <- f Up     x.u
    r <- f Right  x.r
    d <- f Down   x.d
    l <- f Left   x.l
    pure $ Directional { u, r, d, l }

  sequence directional = ado
    Directional x <- directional
    u <- f Up     x.u
    r <- f Right  x.r
    d <- f Down   x.d
    l <- f Left   x.l
    pure $ Directional { u, r, d, l }