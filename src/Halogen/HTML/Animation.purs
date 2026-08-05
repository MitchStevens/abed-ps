module Halogen.HTML.Animation where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Class (class MonadEffect, liftEffect)
import Halogen (HalogenM, RefLabel, getRef)
import Web.Animation as Animation
import Web.Animation.Keyframe (Keyframe)

animate :: forall s q a o m. MonadEffect m => RefLabel -> Array Keyframe -> Int -> HalogenM s q a o m Unit
animate ref keyframes duration =
  getRef ref >>= case _ of
    Just element -> liftEffect $ void $ Animation.animate element keyframes duration
    Nothing -> pure unit
