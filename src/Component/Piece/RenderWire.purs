module Component.Piece.RenderWire where

import Prelude

import Control.Monad.Writer (execWriter, tell)
import Data.Array (zip)
import Data.Array as A
import Data.Foldable (for_, traverse_)
import Data.Map (Map)
import Data.Map as M
import Data.Tuple (Tuple(..), fst, uncurry)
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece (isInput)
import Game.Rotation (Rotation(..))
import Halogen.Svg.Attributes (CommandPositionReference(..), PathCommand, l, m, q)

initialLocation :: CardinalDirection -> Tuple Number Number
initialLocation = case _ of
  Direction.Up    -> Tuple 35.0 25.0
  Direction.Right -> Tuple 75.0 35.0
  Direction.Down  -> Tuple 65.0 75.0
  Direction.Left  -> Tuple 25.0 65.0

terminalLocation :: CardinalDirection -> Tuple Number Number
terminalLocation = case _ of
  Direction.Up    -> Tuple 65.0 25.0
  Direction.Right -> Tuple 75.0 65.0
  Direction.Down  -> Tuple 35.0 75.0
  Direction.Left  -> Tuple 25.0 35.0

rotatePoint :: Rotation  -> Tuple Number Number -> Tuple Number Number
rotatePoint rot (Tuple x y) = Tuple (c * x - s * y) (s * x + c * y)
  where
    Tuple s c = case rot of
      Rotation 0 -> Tuple 0.0     1.0
      Rotation 1 -> Tuple 1.0     0.0
      Rotation 2 -> Tuple 0.0     (-1.0)
      Rotation _ -> Tuple (-1.0)  0.0

arrowPath :: CardinalDirection -> Array PathCommand
arrowPath = case _ of
  Direction.Up -> 
    [ l Rel 0.0 (-13.0), l Rel (-10.0) 0.0, l Rel 25.0 (-12.0), l Rel 25.0 12.0, l Rel (-10.0) 0.0, l Rel 0.0 13.0 ]
  Direction.Right -> 
    [ l Rel 13.0 0.0, l Rel 0.0 (-10.0), l Rel 12.0 25.0, l Rel (-12.0) 25.0, l Rel 0.0 (-10.0), l Rel (-13.0) 0.0 ]
  Direction.Down -> 
    [ l Rel 0.0 13.0, l Rel 10.0 0.0,  l Rel (-25.0) 12.0,  l Rel (-25.0) (-12.0),  l Rel 10.0 0.0,  l Rel 0.0 (-13.0) ]
  Direction.Left ->
    [ l Rel (-13.0) 0.0, l Rel 0.0 10.0, l Rel (-12.0) (-25.0), l Rel 12.0 (-25.0),  l Rel 0.0 10.0,  l Rel 13.0 0.0 ]

stubPath :: CardinalDirection -> Array PathCommand
stubPath = case _ of 
  Direction.Up -> [ l Rel 0.0 (-25.0), l Rel 30.0 0.0,   l Rel 0.0 25.0 ]
  Direction.Right -> [ l Rel 25.0 0.0, l Rel 0.0 30.0,   l Rel (-25.0) 0.0  ]
  Direction.Down -> [ l Rel 0.0 25.0,  l Rel (-30.0) 0.0,  l Rel 0.0 (-25.0) ]
  Direction.Left -> [ l Rel (-25.0) 0.0, l Rel 0.0 (-30.0), l Rel 25.0 0.0 ]

outputPath :: Boolean -> CardinalDirection -> Array PathCommand
outputPath connected = if connected then stubPath else arrowPath


betweenPath :: CardinalDirection -> CardinalDirection -> Array PathCommand
betweenPath to from = [ q Rel dx dy x' y' ]
  where 
    Tuple x' y' = initialLocation from - terminalLocation to
    Tuple dx dy = case from of
      Direction.Up -> Tuple x' 0.0
      Direction.Right -> Tuple 0.0 y'
      Direction.Down -> Tuple x' 0.0
      Direction.Left -> Tuple 0.0 y'

wirePath :: Map CardinalDirection PortInfo -> Array PathCommand
wirePath ports = execWriter do
  for_ (A.uncons (M.toUnfoldable ports)) \{head, tail} -> do
    let Tuple x0 y0 = initialLocation (fst head)
    tell [m Rel x0 y0]
    let sides = zip (M.toUnfoldable ports) (map fst $ tail <> [head])
    traverse_ (uncurry renderSide) sides

  where
    renderSide (Tuple from info) to = tell $ (if isInput info.port then stubPath from else outputPath info.connected from) <> betweenPath from to









