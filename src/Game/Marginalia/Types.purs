module Game.Marginalia.Types where

import Prelude

import Component.Marginalia.Tree (Marginalium)

type Marginalium = String

data Tree = Cons { marginalium :: Marginalium, next :: Maybe { otherConditions :: GameEvent, marginalium :: Marginalium } }

GameEvent