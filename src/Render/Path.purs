module Render.Path where

import Prelude

import Data.Tuple (Tuple(..))
import Game.Rotation (Rotation(..))
import Halogen.HTML (HTML, IProp, PlainHTML, fromPlainHTML)
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (Color(..), CommandPositionReference(..), PathCommand, l, m, q)
import Halogen.Svg.Attributes.StrokeLineCap (StrokeLineCap(..))
import Halogen.Svg.Attributes.StrokeLineJoin (StrokeLineJoin(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Unsafe.Coerce (unsafeCoerce)


type Path = Array PathCommand

renderPath :: forall w i. Path -> HTML w i
renderPath = renderPathWithFill (Named "none")

renderPathWithFill :: forall w i. Color -> Path -> HTML w i
renderPathWithFill fill path =
  SE.g []
    [ SE.path $
        [ SA.fill fill
        , SA.stroke (Named "black")
        , SA.strokeWidth 1.0
        , SA.strokeLineJoin LineJoinRound
        , SA.strokeLineCap LineCapRound
        , SA.d path
        ]
    ]
