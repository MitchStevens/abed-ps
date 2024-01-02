module Component.Rendering.Path where

import Prelude

import Data.Tuple (Tuple(..))
import Game.Rotation (Rotation(..))
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


-- type     ComponentHTML action slots m = HTML (ComponentSlot slots m action) action
-- newtype  HTML w i = HTML (VDom (Array (Prop (Input i))) w)
-- newtype  PLainHTML = HTML Void Void 
-- newtype  IProp r i = IProp (Prop (Input i))


{-
  To render a path, we need a surprising amount of additional infomation!
    - 
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


type Point = Tuple Number Number

-- simplified path
data SimplifiedF a = M a | L a | Q a a
derive instance Functor SimplifiedF
type SimplifiedPathCommand = SimplifiedF Point

center :: Point
center = Tuple 50.0 50.0

toPathCommand :: SimplifiedPathCommand -> PathCommand
toPathCommand = case _ of
  M (Tuple x y) -> m Abs x y
  L (Tuple x y) -> l Rel x y
  Q (Tuple x y) (Tuple x1 y1) -> q Rel x y x1 y1




rotateByAround :: Rotation -> Point -> SimplifiedPathCommand -> SimplifiedPathCommand
rotateByAround rot dp (M p) = translateBy dp <<< rotateBy rot <<< translateBy (-dp) $ (M p)
rotateByAround rot _ path = rotateBy rot path

rotateBy :: Rotation -> SimplifiedPathCommand -> SimplifiedPathCommand
rotateBy rotation = map (\(Tuple x y) -> Tuple (x*c - y*s) (x*s + y*c))
  where
    Tuple s c = case rotation of
      Rotation 0 -> Tuple 0.0     1.0
      Rotation 1 -> Tuple 1.0     0.0
      Rotation 2 -> Tuple 0.0     (-1.0)
      Rotation _ -> Tuple (-1.0)  0.0

translateBy :: Point -> SimplifiedPathCommand -> SimplifiedPathCommand
translateBy p = map (add p)