module Capability.Navigate
  ( InstructionPage(..)
  , Route(..)
  , Underscore
  , about
  , fromUnderscore
  , home
  , howToPlay
  , instructions
  , level
  , levelSelect
  , navigateTo
  , routeCodec
  , toUnderscore
  )
  where

import Prelude hiding ((/))

import Control.Alt ((<|>))
import Control.Monad.Logger.Class (class MonadLogger, trace)
import Control.Plus (empty)
import Data.Bounded.Generic (genericBottom, genericTop)
import Data.Either (Either(..), note)
import Data.Enum (class BoundedEnum, class Enum, cardinality, toEnum)
import Data.Enum.Generic (genericCardinality, genericFromEnum, genericPred, genericSucc, genericToEnum)
import Data.Extra.Enum (inverseMap)
import Data.Generic.Rep (class Generic, Argument(..), Product(..))
import Data.Map as M
import Data.Profunctor (dimap)
import Data.Show.Generic (genericShow)
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

data InstructionPage = Wire
derive instance Generic InstructionPage _
derive instance Eq InstructionPage
derive instance Ord InstructionPage
instance Show InstructionPage where
  show = case _ of
    Wire -> "wire"

instance Enum InstructionPage where
  succ = genericSucc  
  pred = genericPred
instance Bounded InstructionPage where
  top = genericTop
  bottom = genericBottom
instance BoundedEnum InstructionPage where
  cardinality = genericCardinality
  toEnum = genericToEnum
  fromEnum = genericFromEnum



data Route
  = Home
  | About
  | HowToPlay
  | Instructions InstructionPage
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

howToPlay :: Route
howToPlay = HowToPlay

instructions :: InstructionPage -> Route
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

-- data RouteDuplex i o = RouteDuplex (i -> RoutePrinter) (RouteParser o)


instructionPageCodec :: RouteDuplex InstructionPage InstructionPage
instructionPageCodec = as show (inverseMap show >>> note "no-instruction-found") segment

routeCodec :: RouteDuplex' Route
routeCodec = default Home $ root $ sum
  { "Home": "home" / noArgs
  , "About": "about" / noArgs
  , "HowToPlay": "how-to-play" / noArgs
  , "Instructions": "how-to-play" / instructionPageCodec
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

navigateTo :: forall m. MonadEffect m => MonadLogger m => Route -> m Unit
navigateTo route = do
  trace M.empty ("Navigating to " <> print routeCodec route)
  liftEffect (setHash (print routeCodec route))