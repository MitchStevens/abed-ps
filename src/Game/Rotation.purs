module Game.Rotation where

import Prelude

import Data.Enum (class BoundedEnum, class Enum, Cardinality(..), fromEnum, toEnum)
import Data.Group (class Group)
import Data.Maybe (Maybe(..), fromMaybe)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction

newtype Rotation = Rotation Int
derive instance Eq Rotation 
derive instance Ord Rotation 

instance Show Rotation where
  show (Rotation n) = "Rotation " <> show (n * 90) <> "°"

instance Enum Rotation where
  succ (Rotation 3) = Nothing
  succ (Rotation n) = Just $ rotation (n + 1)
  pred (Rotation 0) = Nothing
  pred (Rotation n) = Just $ rotation (n - 1)

instance Bounded Rotation where
  bottom = rotation 0
  top = rotation 3

instance BoundedEnum Rotation where
  cardinality = Cardinality 4
  fromEnum (Rotation n) = n
  toEnum = Just <<< Rotation

instance Semigroup Rotation where
  append (Rotation a) (Rotation b) = rotation (a+b)

instance Monoid Rotation where
  mempty = rotation 0

instance Group Rotation where
  ginverse (Rotation n) = rotation (-n)

allRotations :: Array Rotation
allRotations = Rotation <$> [0, 1, 2, 3]

rotation :: Int -> Rotation
rotation n = Rotation (n `mod` 4)

rotateDirection :: CardinalDirection -> Rotation -> CardinalDirection
rotateDirection dir rot = fromMaybe Direction.Up $ toEnum ((fromEnum dir + fromEnum rot) `mod` 4)

clockwiseRotation :: CardinalDirection -> CardinalDirection -> Rotation
clockwiseRotation d1 d2 = rotation (fromEnum d2 - fromEnum d1 `mod` 4)