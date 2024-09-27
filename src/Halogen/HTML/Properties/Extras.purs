module Halogen.HTML.Properties.Extras where

import Prelude

import Halogen.HTML (HTML, IProp, PropName(..), prop)

contentEditable :: forall r i. Boolean -> IProp ( contentEditable :: Boolean | r ) i
contentEditable = prop (PropName "contentEditable")

