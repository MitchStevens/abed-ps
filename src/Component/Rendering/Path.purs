module Component.Rendering.Path where

import Prelude

import Data.Tuple (Tuple(..))
import Game.Rotation (Rotation(..))
import Halogen (ComponentHTML, ComponentSlot)
import Halogen.HTML (HTML, IProp, PlainHTML, fromPlainHTML)
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (Color(..), CommandPositionReference(..), PathCommand, l, m, q)
import Halogen.Svg.Attributes.StrokeLineCap (StrokeLineCap(..))
import Halogen.Svg.Attributes.StrokeLineJoin (StrokeLineJoin(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Unsafe.Coerce (unsafeCoerce)

data PathFill
  = FillWithPortGradient { id :: String, def :: PlainHTML }
  | FillNoneWithStroke { stroke :: Color, strokeWidth :: Number }

type Path =
  { path :: Array PathCommand
  , pathFill :: PathFill
  , attrs :: IProp () Void
  }

renderPathWithEvents :: forall a s m. Path -> a -> a -> ComponentHTML a s m
renderPathWithEvents { path, pathFill, attrs } onMouseEnter onMouseLeave =
  case pathFill of
    FillWithPortGradient g ->
      SE.g []
        [ SE.defs [] [ fromPlainHTML g.def ]
        , pathElement
            [ SA.fillGradient ("#" <> g.id)
            ]
        ]
    FillNoneWithStroke { stroke, strokeWidth } ->
      SE.g []
        [ pathElement
            [ SA.fill (Named "none")
            , SA.stroke stroke
            , SA.strokeWidth strokeWidth
            , SA.strokeLineJoin LineJoinRound
            , SA.strokeLineCap LineCapRound
            ]
        ]
  where
  pathElement fillAndStrokeProps =
    SE.path
      ( [ SA.d path
        , unsafeCoerce attrs
        , HP.onMouseEnter (\_ -> onMouseEnter)
        , HP.onMouseLeave (\_ -> onMouseLeave)
        ] <> fillAndStrokeProps
      )