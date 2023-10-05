module Capability.Navigate where

import Prelude hiding ((/))

import Data.Generic.Rep (class Generic)
import Halogen (HalogenM, lift)
import Routing.Duplex (RouteDuplex', as, parse, print, root, segment)
import Routing.Duplex.Generic (noArgs, sum)
import Routing.Duplex.Generic.Syntax ((/))

data Route
  = Home
  | About
  | PuzzleSelect
  | Puzzle String String
derive instance Generic Route _
derive instance Eq Route
derive instance Ord Route

instance Show Route where
  show = print routeCodec

routeCodec :: RouteDuplex' Route
routeCodec = root $ sum
  { "Home": noArgs
  , "About": "about" / noArgs
  , "PuzzleSelect": "puzzleSelect" / noArgs
  , "Puzzle": "puzzle" / segment / segment
  }

class Monad m <= Navigate m where
  navigateTo :: Route -> m  Unit

instance Navigate m => Navigate (HalogenM st act slots msg m) where
  navigateTo = lift <<< navigateTo