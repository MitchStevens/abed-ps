module Game.Location where

import Prelude

import Data.Array (find)
import Data.Maybe (Maybe(..), fromMaybe)
import Game.Direction (CardinalDirection(..), allDirections)
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

-- used for CSS creation
locationId :: Location -> String
locationId (Location {x, y}) = "position-" <> show x <> "-" <> show y

directionTo :: Location -> Location -> Maybe CardinalDirection
directionTo l1 l2 = find (\d -> followDirection l1 d == l2) allDirections

followDirection :: Location -> CardinalDirection -> Location
followDirection (Location {x, y}) = case _ of
  Up    -> location x (y-1)
  Right -> location (x+1) y
  Down  -> location x (y+1)
  Left  -> location (x-1) y