module Capability.LocalStorage.LevelProgress where

import Prelude

import Capability.LocalStorage (class LocalStorage)
import Data.Maybe (Maybe(..))
import Game.Level.Suite (LevelId(..))

data LevelProgress = Unlocked | Incomplete | Completed
derive instance Eq LevelProgress
derive instance Ord LevelProgress
instance Show LevelProgress where
  show = case _ of
      Unlocked -> "Unlocked"
      Incomplete -> "Incomplete"
      Completed -> "Completed"
instance Semigroup LevelProgress where
  append = max

instance LocalStorage LevelId LevelProgress where
  itemName = "level-progress"
  parseValue = case _ of
    "Unlocked" -> Just Unlocked
    "Incomplete" -> Just Incomplete
    "Completed" -> Just Completed
    _ -> Nothing