module Game.Piece.Direction where

import Prelude

import Ansi.Codes (EscapeCode(..))
import Data.Array as Array
import Data.Either (Either(..))
import Data.Enum (class BoundedEnum, class Enum, Cardinality(..), enumFromTo, fromEnum, toEnum)
import Data.Foldable (class Foldable, foldMap, foldl, foldr)
import Data.FoldableWithIndex (class FoldableWithIndex, foldlWithIndex, foldrWithIndex)
import Data.FunctorWithIndex (class FunctorWithIndex)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Traversable (class Traversable)
import Data.TraversableWithIndex (class TraversableWithIndex, traverseWithIndex)
import Game.Piece.Rotation (Rotation(..), rotation)

data CardinalDirection = Up | Right | Down | Left 
derive instance Eq CardinalDirection
derive instance Ord CardinalDirection

instance Show CardinalDirection where
  show = case _ of
    Up    -> "Up"
    Right -> "Right"
    Down  -> "Down"
    Left  -> "Left"

instance Enum CardinalDirection where
  succ = case _ of
    Up -> Just Right 
    Right -> Just Down
    Down -> Just Left
    Left -> Nothing
  pred = case _ of
    Up -> Nothing
    Right -> Just Up
    Down -> Just Right
    Left -> Just Down

instance Bounded CardinalDirection where
  bottom = Up
  top = Left

instance BoundedEnum CardinalDirection where
  cardinality = Cardinality 4
  fromEnum = case _ of
    Up -> 0
    Right -> 1
    Down -> 2
    Left -> 3
  toEnum = case _ of
    0 -> Just Up
    1 -> Just Right
    2 -> Just Down
    3 -> Just Left
    _ -> Nothing

allDirections :: Array CardinalDirection
allDirections = enumFromTo Up Left

oppositeDirection :: CardinalDirection -> CardinalDirection
oppositeDirection = case _ of
  Up    -> Down
  Right -> Left
  Down  -> Up
  Left  -> Right


rotateDirection :: CardinalDirection -> Rotation -> CardinalDirection
rotateDirection dir rot = fromMaybe Up $ toEnum ((fromEnum dir + fromEnum rot) `mod` 4)

clockwiseRotation :: CardinalDirection -> CardinalDirection -> Rotation
clockwiseRotation d1 d2 = rotation (fromEnum d2 - fromEnum d1)


type DirectionalRow :: Type -> Row Type
type DirectionalRow a = ( u :: a, r :: a, d :: a, l :: a )

newtype Directional a = Directional (Record (DirectionalRow a))

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