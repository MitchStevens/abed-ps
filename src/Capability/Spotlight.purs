module Capability.Spotlight where

import Prelude

import Control.Monad.Trans.Class (lift)
import Effect (Effect)
import Halogen (HalogenM)
import Web.DOM (Element)


class Monad m <= Spotlight m where
  spotlightElement :: Element -> m Unit

instance Spotlight m => Spotlight (HalogenM s a sl o m) where
  spotlightElement = spotlightElement >>> lift

