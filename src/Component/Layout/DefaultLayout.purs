module Component.Layout.DefaultLayout where

import Prelude

import Component.Title as Title
import Halogen.HTML (ClassName(..), HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))



defaultLayout :: forall p i. HTML p i -> HTML p i
defaultLayout inner =
  HH.div
    [ HP.id "default-layout" ]
    [ HH.div [ HP.id "title" ] [ HH.text "A.B.E.D." ]
    , HH.div [ HP.class_ (ClassName "inner") ] [ inner ]
    ]