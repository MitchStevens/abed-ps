module Halogen.HTML.Extras where

import Prelude

import Capability.Navigate (Route, routeSlug)
import Data.Bifunctor (bimap)
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Web.UIEvent.MouseEvent (MouseEvent)


mapActionOverHTML :: forall a a' s m. (a -> a') -> ComponentHTML a s m -> ComponentHTML a' s m 
mapActionOverHTML f = bimap (map f) f

navigationLink :: forall p i. String -> Route -> HTML p i
navigationLink text route  =
  HH.a
    [ HP.class_ (ClassName "link")
    , HP.href ("#" <> routeSlug route) ]
    [ HH.text text ]