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
import Game.Level (LevelId)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (clear, getItem, setItem)


--storing puzzle progress
data LevelProgress = Incomplete | Completed
derive instance Eq LevelProgress

levelProgress :: Prism' String LevelProgress
levelProgress = prism' toStr fromStr
  where
    toStr = case _ of
      Incomplete -> "Incomplete"
      Completed -> "Completed"
    fromStr = case _ of
      "Incomplete" -> Just Incomplete
      "Completed" -> Just Completed
      _ -> Nothing

instance Show LevelProgress where
  show = case _ of
      Incomplete -> "Incomplete"
      Completed -> "Completed"


saveLevelProgress :: forall m. MonadEffect m => LevelId -> LevelProgress -> m Unit
saveLevelProgress id progress = liftEffect $
  window >>= localStorage >>= setItem (show id) (review levelProgress progress)

getLevelProgress :: forall m. MonadEffect m => LevelId -> m (Maybe LevelProgress)
getLevelProgress id = liftEffect $
  window >>= localStorage >>= getItem (show id) <#> bindFlipped (preview levelProgress)

deleteProgress :: forall m. MonadEffect m => m Unit
deleteProgress = liftEffect $ window >>= localStorage >>= clear