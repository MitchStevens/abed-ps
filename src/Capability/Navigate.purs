module Capability.Navigate
  ( Route(..)
  , Underscore
  , about
  , fromUnderscore
  , home
  , instructions
  , level
  , levelSelect
  , navigateTo
  , routeCodec
  , toUnderscore
  )
  where

import Prelude hiding ((/))

import Data.Either (Either(..))
import Data.Generic.Rep (class Generic, Argument(..), Product(..))
import Data.Profunctor (dimap)
import Data.Show.Generic (genericShow)
import Control.Alt ((<|>))
import Data.String (Pattern(..), Replacement(..))
import Data.String as String
import Effect.Class (class MonadEffect, liftEffect)
import Game.Level (LevelId)
import Routing.Duplex (RouteDuplex(..), RouteDuplex', as, default, params, parse, print, root, segment, string)
import Routing.Duplex.Generic (noArgs, sum)
import Routing.Duplex.Generic.Syntax ((/), (?))
import Routing.Duplex.Parser (RouteParser(..), take)
import Routing.Duplex.Printer (RoutePrinter(..))
import Routing.Hash (setHash)

data Route
  = Home
  | About
  | Instructions
  | LevelSelect
  | Level { suiteName :: Underscore, levelName :: Underscore}
derive instance Generic Route _
derive instance Eq Route
derive instance Ord Route
instance Show Route where
  show = genericShow

newtype Underscore = Underscore String
--derive instance Generic Underscore _
derive instance Eq Underscore
derive instance Ord Underscore
instance Show Underscore where
  show (Underscore str) = "Underscore " <> str

home :: Route
home = Home

about :: Route
about = About

instructions :: Route
instructions = Instructions

levelSelect :: Route
levelSelect = LevelSelect

level :: LevelId -> Route
level {suiteName, levelName } = Level { suiteName: toUnderscore suiteName, levelName: toUnderscore levelName }

toUnderscore :: String -> Underscore
toUnderscore s = Underscore (String.replaceAll (Pattern " ") (Replacement "_") s)

fromUnderscore :: Underscore  -> String
fromUnderscore (Underscore s) =
  String.replaceAll (Pattern "_") (Replacement " ") s

routeCodec :: RouteDuplex' Route
routeCodec = default Home $ root $ sum
  { "Home": "home" / noArgs
  , "About": "about" / noArgs
  , "Instructions": "how-to-play" / noArgs
  , "LevelSelect": "level-select" / noArgs
  , "Level": "level" ? { suiteName: underscore, levelName: underscore }
  }

underscore :: RouteDuplex' String -> RouteDuplex' Underscore
underscore = as (\(Underscore str) -> str) hasUnderscore
  where
    hasUnderscore :: String -> Either String Underscore
    hasUnderscore str = 
      if String.contains (Pattern " ") str
        then Left str
        else Right (toUnderscore str)





navigateTo :: forall m. MonadEffect m => Route -> m Unit
navigateTo route = liftEffect (setHash (print routeCodec route))