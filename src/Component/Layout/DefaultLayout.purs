module Component.Layout.DefaultLayout where

import Prelude

import Component.Title as Title
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))



defaultLayout :: forall p i. HTML p i -> HTML p i
defaultLayout inner =
  HH.div
    [ HP.id "default-layout" ]
    [ Title.html
    , HH.br_
    , HH.a
      [ HP.href "" ]
      [ HH.text "<< Back to home" ]
    , HH.br_
    , HH.div_ [ inner ]
    ]