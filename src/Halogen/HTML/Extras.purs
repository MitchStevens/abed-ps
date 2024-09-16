module Halogen.HTML.Extras where

import Prelude

import Data.Bifunctor (bimap)
import Halogen (ComponentHTML)


mapActionOverHTML :: forall a a' s m. (a -> a') -> ComponentHTML a s m -> ComponentHTML a' s m 
mapActionOverHTML f = bimap (map f) f

--todo: toPlainHTML :: ComponentHTML action s m -> PlainHTML
