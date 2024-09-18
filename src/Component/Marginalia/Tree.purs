module Component.Marginalia.Tree where

import Prelude

import Control.Monad.Writer (Writer)
import Data.Map (Map)

data Event

type Marginalium = String
newtype Tree = Tree
  { start :: Event
  , abort :: Event
  , tree :: Map Marginalium Tree
  }
type RoseTree = Array Tree
