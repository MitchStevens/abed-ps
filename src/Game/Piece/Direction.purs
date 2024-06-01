module Game.Piece.Direction where

import Prelude

import Data.Enum (class BoundedEnum, class Enum, Cardinality(..), enumFromTo, fromEnum, toEnum)
import Data.Maybe (Maybe(..), fromMaybe)
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