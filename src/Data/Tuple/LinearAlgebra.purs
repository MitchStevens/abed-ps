module Data.Tuple.LinearAlgebra where

import Prelude

import Data.Number (cos, sin)
import Data.Tuple (Tuple(..))
import Game.Rotation (Rotation(..))
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

translateBy :: Tuple Number Number -> Point -> Point
translateBy (Tuple dx dy) (Tuple x y) = Tuple (x+dx) (y+dy)

rotateBy :: Rotation -> Point -> Point
rotateBy theta (Tuple x y) = Tuple (cos * x - sin * y) (sin * x + cos * y)
  where 
    Tuple sin cos = case theta of
      Rotation 0 -> Tuple 0.0     1.0
      Rotation 1 -> Tuple 1.0     0.0
      Rotation 2 -> Tuple 0.0     (-1.0)
      Rotation _ -> Tuple (-1.0)  0.0

dot :: Point -> Point -> Number
dot (Tuple x1 y1) (Tuple x2 y2) = (x1+x2) * (y1+y2)

rotateByAround :: Rotation -> Tuple Number Number -> Point -> Point
rotateByAround theta dp = translateBy dp <<< rotateBy theta <<< translateBy (-dp)
