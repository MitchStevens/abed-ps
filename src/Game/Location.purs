module Game.Location where

import Prelude

import Data.Enum (class BoundedEnum, class Enum, Cardinality(..), cardinality, enumFromTo, fromEnum, toEnum)
import Data.Group (class Group, ginverse)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..))
import Web.HTML.Common (ClassName(..))

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


newtype Location = Location { x :: Int, y :: Int }
derive instance Eq Location
derive instance Ord Location
instance Show Location where
  show (Location {x, y}) = "(" <> show x <> "," <> show y <> ")"
--instance Semigroup Location where
--  Location a <> Location b = location 

location :: Int -> Int -> Location
location x y = Location { x, y }

-- used for CSS creation
locationId :: Location -> String
locationId (Location {x, y}) = "position-" <> show x <> "-" <> show y

newtype Edge = Edge { loc :: Location, dir :: CardinalDirection }
derive instance Newtype Edge _
derive instance Eq Edge
instance Show Edge where
  show (Edge { loc, dir }) = "Edge " <> show loc <> " " <> show dir

-- do not derive Ord, needed for `mapKeys` function
instance Ord Edge where
  compare (Edge e) (Edge f) = compare e.loc f.loc <> compare e.dir f.dir 

edge :: Location -> CardinalDirection -> Edge
edge loc dir = Edge { loc, dir }

edgeLocation :: Edge -> Location
edgeLocation (Edge {loc, dir}) = loc

edgeDirection :: Edge -> CardinalDirection
edgeDirection (Edge {loc, dir}) = dir

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

rotation :: Int -> Rotation
rotation n = Rotation (n `mod` 4)

followDirection :: Location -> CardinalDirection -> Location
followDirection (Location {x, y}) = case _ of
  Up    -> location x (y-1)
  Right -> location (x+1) y
  Down  -> location x (y+1)
  Left  -> location (x-1) y

rotateDirection :: CardinalDirection -> Rotation -> CardinalDirection
rotateDirection dir rot = fromMaybe Up $ toEnum ((fromEnum dir + fromEnum rot) `mod` 4)

oppositeDirection :: CardinalDirection -> CardinalDirection
oppositeDirection = case _ of
  Up    -> Down
  Right -> Left
  Down  -> Up
  Left  -> Right

matchEdge :: Edge -> Edge
matchEdge (Edge { loc, dir }) = edge (followDirection loc dir) (oppositeDirection dir)

