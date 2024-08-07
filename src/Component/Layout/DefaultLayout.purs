module Component.Layout.DefaultLayout where

import Prelude

import Capability.Navigate (Route(..))
import Component.Title as Title
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Extras (navigationLink)
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))

defaultLayoutElements :: forall p i. HTML p i -> Array (HTML p i)
defaultLayoutElements inner =
    [ Title.html
    --, HH.a
    --  [ HP.href "" ]
    --  [ HH.text "<< Back to home" ]
    --, HH.br_
    , HH.div_ [ inner ]
    ]


defaultLayout :: forall p i. HTML p i -> HTML p i
defaultLayout inner =
  HH.div [ HP.id "default-layout" ] $
    join
      [ defaultLayoutElements inner
      , [ HH.hr_ ]
      , [ navigationLink "Back to Home" Home ]
      ]

defaultLayoutHome :: forall p i. HTML p i -> HTML p i
defaultLayoutHome inner =
  HH.div [ HP.id "default-layout" ] (defaultLayoutElements inner)