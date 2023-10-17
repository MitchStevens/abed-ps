module Capability.Progress where

import Prelude

import Control.Bind (bindFlipped)
import Data.Lens (Prism', preview, prism', review)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Traversable (for, traverse)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (class MonadEffect, liftEffect)
import Foreign.Object as O
import Game.Puzzle (PuzzleId)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (clear, getItem, setItem)


--storing puzzle progress
data PuzzleProgress = Incomplete | Completed
derive instance Eq PuzzleProgress

puzzleProgress :: Prism' String PuzzleProgress
puzzleProgress = prism' toStr fromStr
  where
    toStr = case _ of
      Incomplete -> "Incomplete"
      Completed -> "Completed"
    fromStr = case _ of
      "Incomplete" -> Just Incomplete
      "Completed" -> Just Completed
      _ -> Nothing

instance Show PuzzleProgress where
  show = case _ of
      Incomplete -> "Incomplete"
      Completed -> "Completed"


savePuzzleProgress :: forall m. MonadEffect m => PuzzleId -> PuzzleProgress -> m Unit
savePuzzleProgress id progress = liftEffect $
  window >>= localStorage >>= setItem (show id) (review puzzleProgress progress)

getPuzzleProgress :: forall m. MonadEffect m => PuzzleId -> m (Maybe PuzzleProgress)
getPuzzleProgress id = liftEffect $
  window >>= localStorage >>= getItem (show id) <#> bindFlipped (preview puzzleProgress)

deleteProgress :: forall m. MonadEffect m => m Unit
deleteProgress = liftEffect $ window >>= localStorage >>= clear