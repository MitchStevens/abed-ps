module Game.Location where

import Prelude

import Data.Array (find)
import Data.Enum (class BoundedEnum, class Enum, Cardinality(..), cardinality, enumFromTo, fromEnum, toEnum)
import Data.Group (class Group, ginverse)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Web.HTML.Common (ClassName(..))


newtype Location = Location { x :: Int, y :: Int }
derive instance Eq Location
derive instance Ord Location
instance Show Location where
  show (Location {x, y}) = "(" <> show x <> "," <> show y <> ")"
--instance Semigroup Location where
--  Location a <> Location b = location 

location :: Int -> Int -> Location
location x y = Location { x, y }

-- used for CSS creation, todo: move this somwhere else, maybe data attributes
-- is this even being used??
locationId :: Location -> String
locationId (Location {x, y}) = "position-" <> show x <> "-" <> show y

followDirection :: Location -> CardinalDirection -> Location
followDirection (Location {x, y}) = case _ of
  Direction.Up    -> location x (y-1)
  Direction.Right -> location (x+1) y
  Direction.Down  -> location x (y+1)
  Direction.Left  -> location (x-1) y


directionTo :: Location -> Location -> Maybe CardinalDirection
directionTo l1 l2 = find (\d -> followDirection l1 d == l2) allDirections


