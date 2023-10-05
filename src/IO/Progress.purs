module IO.Progress where

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
import IO.Puzzles (allPuzzles)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (getItem, setItem)


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

type PuzzleId = { suiteName :: String, puzzleName :: String }

savePuzzleProgress :: forall m. MonadEffect m => PuzzleId -> PuzzleProgress -> m Unit
savePuzzleProgress id progress = liftEffect $
  window >>= localStorage >>= setItem (show id) (review puzzleProgress progress)

getAllPuzzleProgress :: forall m. MonadEffect m => m (Map PuzzleId PuzzleProgress)
getAllPuzzleProgress = map (join >>> M.fromFoldable >>> M.catMaybes) $
  for (O.toUnfoldable allPuzzles :: Array _) \(Tuple suiteName suite) ->
    for (O.toUnfoldable suite :: Array _) \(Tuple puzzleName _) ->
      Tuple {suiteName, puzzleName} <$> getPuzzleProgress { suiteName, puzzleName}

getPuzzleProgress :: forall m. MonadEffect m => PuzzleId -> m (Maybe PuzzleProgress)
getPuzzleProgress id = liftEffect $
  window >>= localStorage >>= getItem (show id) <#> bindFlipped (preview puzzleProgress)
  

