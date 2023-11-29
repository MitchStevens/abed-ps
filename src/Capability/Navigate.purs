module Capability.Navigate where

import Prelude hiding ((/))

import Data.Generic.Rep (class Generic)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen (HalogenM, lift)
import Routing.Duplex (RouteDuplex', as, parse, print, root, segment)
import Routing.Duplex.Generic (noArgs, sum)
import Routing.Duplex.Generic.Syntax ((/))
import Routing.Hash (setHash)

data Route
  = Home
  | About
  | Instructions
  | LevelSelect
  | Level String String
derive instance Generic Route _
derive instance Eq Route
derive instance Ord Route

instance Show Route where
  show = print routeCodec

routeCodec :: RouteDuplex' Route
routeCodec = root $ sum
  { "Home": noArgs
  , "About": "about" / noArgs
  , "Instructions": "how-to-play" / noArgs
  , "LevelSelect": "level-select" / noArgs
  , "Level": "level" / segment / segment
  }

navigateTo :: forall m. MonadEffect m => Route -> m Unit
navigateTo route = liftEffect (setHash (print routeCodec route))