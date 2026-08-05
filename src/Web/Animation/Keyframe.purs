module Web.Animation.Keyframe where

import Prelude

import Data.String (joinWith)
import Halogen.Svg.Attributes (Color)

foreign import data Keyframe :: Type

foreign import emptyKeyframe :: Keyframe

foreign import combineKeyframes :: Keyframe -> Keyframe -> Keyframe

foreign import singletonKeyframe :: String -> String -> Keyframe

foreign import singletonKeyframeNumber :: String -> Number -> Keyframe

instance Semigroup Keyframe where
  append = combineKeyframes

instance Monoid Keyframe where
  mempty = emptyKeyframe

-- | CSS `color`.
color :: Color -> Keyframe
color c = singletonKeyframe "color" (show c)

-- | CSS `opacity` (0–1).
opacity :: Number -> Keyframe
opacity = singletonKeyframeNumber "opacity"

-- | WAAPI per-keyframe `offset` (typically 0–1).
offset :: Number -> Keyframe
offset = singletonKeyframeNumber "offset"

-- | WAAPI per-keyframe `easing` (e.g. `"ease-in-out"`).
easing :: String -> Keyframe
easing = singletonKeyframe "easing"

-- | SVG / CSS `fill` paint.
fill :: Color -> Keyframe
fill c = singletonKeyframe "fill" (show c)

-- | SVG / CSS `stroke` paint.
stroke :: Color -> Keyframe
stroke c = singletonKeyframe "stroke" (show c)

-- | SVG `stroke-width`.
strokeWidth :: Number -> Keyframe
strokeWidth = singletonKeyframeNumber "strokeWidth"

-- | CSS `transform` string (combine sub-transforms with `<>` on `Keyframe` — last `transform` wins unless you build one string).
transform :: String -> Keyframe
transform = singletonKeyframe "transform"

translate :: Number -> Number -> Keyframe
translate x y =
  transform $ "translate(" <> joinWith ", " [ show x <> "px", show y <> "px" ] <> ")"

translateX :: Number -> Keyframe
translateX x = transform $ "translateX(" <> show x <> "px)"

translateY :: Number -> Keyframe
translateY y = transform $ "translateY(" <> show y <> "px)"

scale :: Number -> Keyframe
scale s = transform $ "scale(" <> show s <> ")"

scaleXY :: Number -> Number -> Keyframe
scaleXY sx sy = transform $ "scale(" <> show sx <> ", " <> show sy <> ")"

rotate :: Number -> Keyframe
rotate deg = transform $ "rotate(" <> show deg <> "deg)"

skewX :: Number -> Keyframe
skewX deg = transform $ "skewX(" <> show deg <> "deg)"

skewY :: Number -> Keyframe
skewY deg = transform $ "skewY(" <> show deg <> "deg)"

-- | CSS `filter` (e.g. `"blur(4px)"`). Named `cssFilter` to avoid clashing with `Prelude.filter`.
cssFilter :: String -> Keyframe
cssFilter = singletonKeyframe "filter"
