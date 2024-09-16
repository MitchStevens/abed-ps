module Game.Piece.Complexity where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Monoid.Additive (Additive(..))

type Complexity = 
  { space :: Additive Number
  , time :: Additive Number
  }

space :: Number -> Complexity
space = { space: _, time: mempty } <<< Additive

time :: Number -> Complexity
time = { space: mempty, time: _ } <<< Additive

