module Component.Sidebar.Segment where

import Prelude

import Component (toCssSelectorString)
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP


segmentWithTitle :: forall a sl m. String -> ComponentHTML a sl m -> ComponentHTML a sl m
segmentWithTitle segmentTitle html =
  segment (ClassName (toCssSelectorString segmentTitle)) (HH.text segmentTitle) html

segment :: forall a sl m. ClassName -> ComponentHTML a sl m -> ComponentHTML a sl m -> ComponentHTML a sl m
segment className segmentTitle html = 
  HH.div
    [ HP.class_ className ]
    [ HH.h2_ [ segmentTitle ], html ]
