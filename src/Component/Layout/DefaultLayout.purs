module Component.Layout.DefaultLayout where

import Prelude

import Capability.Navigate (Route(..), routeCodec)
import Component.Title as Title
import Halogen.HTML (ClassName(..), HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Routing.Duplex (print)
import Type.Proxy (Proxy(..))



defaultLayout :: forall p i. HTML p i -> HTML p i
defaultLayout inner =
  HH.div
    [ HP.id "default-layout" ]
    [ HH.a [ HP.id "title", HP.href ("#" <> print routeCodec Home) ] [ HH.text "A.B.E.D." ]
    , HH.div [ HP.class_ (ClassName "inner") ] [ inner ]
    ]