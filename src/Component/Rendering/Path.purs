module Component.Rendering.Path where

import Prelude

import Data.Tuple (Tuple(..))
import Game.Piece.Rotation (Rotation(..))
import Halogen (ComponentHTML, ComponentSlot)
import Halogen.HTML (HTML, IProp, PlainHTML, fromPlainHTML)
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (CommandPositionReference(..), PathCommand, l, m, q)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Unsafe.Coerce (unsafeCoerce)

type Path = 
  { path :: Array PathCommand
  , gradient :: 
    { id :: String
    , def :: PlainHTML
    }
  , attrs :: IProp () Void
 }


{-
-}
renderPathWithEvents :: forall a s m. Path -> a -> a -> ComponentHTML a s m
renderPathWithEvents { path, gradient, attrs } onMouseEnter onMouseLeave =
  SE.g []
    [ SE.defs [] [ fromPlainHTML gradient.def ]
    , SE.path
      [ SA.d path
      , unsafeCoerce attrs
      , SA.fillGradient ("#" <> gradient.id)
      , HP.onMouseEnter (\_ -> onMouseEnter)
      , HP.onMouseLeave (\_ -> onMouseLeave)
      ]
    ]

renderPath :: Path -> PlainHTML
renderPath { path, gradient, attrs } =
  SE.g []
    [ SE.defs [] [ fromPlainHTML gradient.def ]
    , SE.path
      [ SA.d path
      , unsafeCoerce attrs
      , SA.fillGradient ("#" <> gradient.id)
      ]
    ]