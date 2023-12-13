module Data.Tuple.LinearAlgebra where

import Prelude

import Data.Number (cos, sin)
import Data.Tuple (Tuple(..))
import Halogen.Svg.Attributes (Transform(..))

type Point = Tuple Number Number

--applyTransform :: Transform -> Point -> Point
--applyTransform transform p@(Tuple x y) = case transform of
--  Matrix a b c d e f -> Tuple (a*x + c*y + e) (b*x + d*y + f)
--  Translate dx dy -> Tuple (x + dx) (y+dy)
--  Scale sx sy -> Tuple (x * sx) (y * sy)
--  Rotate theta x0 y0 -> translateBy x0 y0 <<< rotateBy theta <<< translateBy (-x0) (-y0) $ p
--  SkewX a -> Tuple (x + cos a * y) y
--  SkewY a -> Tuple x (y + cos a * x)

translateBy :: Number -> Number -> Point -> Point
translateBy dx dy (Tuple x y) = Tuple (x+dx) (y+dy)

rotateBy :: Number -> Point -> Point
rotateBy theta (Tuple x y) = Tuple (cos theta * x - sin theta * y) (sin theta * x + cos theta * y)

rotateByAround :: Number -> Number -> Number -> Point -> Point
rotateByAround theta x0 y0 = translateBy x0 y0 <<< rotateBy theta <<< translateBy (-x0) (-y0)
