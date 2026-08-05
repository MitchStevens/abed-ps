module Component.Rendering.Outline where

import Prelude

import Component.Rendering.Path (Path, renderPath)
import Component.Rendering.PieceShape (JunctionType(..), Leg, OutlineConfig, Trace(..))
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..), uncurry)
import Game.Direction (CardinalDirection(..))
import Game.Port (PortType(..))
import Game.PortInfo (PortInfo)
import Halogen.HTML (HTML)
import Halogen.Svg.Attributes (CommandPositionReference(..), PathCommand, l, m, q)
import Halogen.Svg.Elements as SE

-- | Where a leg's stub/arrow shape starts, before it's drawn.
initialLocation :: CardinalDirection -> Tuple Number Number
initialLocation = case _ of
  Up -> Tuple 35.0 25.0
  Right -> Tuple 75.0 35.0
  Down -> Tuple 65.0 75.0
  Left -> Tuple 25.0 65.0

-- | Where a leg's stub/arrow shape ends, and the junction to the next leg begins.
terminalLocation :: CardinalDirection -> Tuple Number Number
terminalLocation = case _ of
  Up -> Tuple 65.0 25.0
  Right -> Tuple 75.0 65.0
  Down -> Tuple 35.0 75.0
  Left -> Tuple 25.0 35.0

arrowPath :: CardinalDirection -> Array PathCommand
arrowPath = case _ of
  Up ->
    [ l Rel 0.0 (-13.0), l Rel (-10.0) 0.0, l Rel 25.0 (-12.0), l Rel 25.0 12.0, l Rel (-10.0) 0.0, l Rel 0.0 13.0 ]
  Right ->
    [ l Rel 13.0 0.0, l Rel 0.0 (-10.0), l Rel 12.0 25.0, l Rel (-12.0) 25.0, l Rel 0.0 (-10.0), l Rel (-13.0) 0.0 ]
  Down ->
    [ l Rel 0.0 13.0, l Rel 10.0 0.0, l Rel (-25.0) 12.0, l Rel (-25.0) (-12.0), l Rel 10.0 0.0, l Rel 0.0 (-13.0) ]
  Left ->
    [ l Rel (-13.0) 0.0, l Rel 0.0 10.0, l Rel (-12.0) (-25.0), l Rel 12.0 (-25.0), l Rel 0.0 10.0, l Rel 13.0 0.0 ]

stubPath :: CardinalDirection -> Array PathCommand
stubPath = case _ of
  Up -> [ l Rel 0.0 (-25.0), l Rel 30.0 0.0, l Rel 0.0 25.0 ]
  Right -> [ l Rel 25.0 0.0, l Rel 0.0 30.0, l Rel (-25.0) 0.0 ]
  Down -> [ l Rel 0.0 25.0, l Rel (-30.0) 0.0, l Rel 0.0 (-25.0) ]
  Left -> [ l Rel (-25.0) 0.0, l Rel 0.0 (-30.0), l Rel 25.0 0.0 ]

-- | An output leg: flush against the frame if connected to a neighbour,
-- | pointing an arrow at where a neighbour would go if not.
outputPath :: Boolean -> CardinalDirection -> Array PathCommand
outputPath connected = if connected then stubPath else arrowPath

-- | The quadratic-bezier corner used between two Curved-joined legs, going
-- | from the current leg's terminal point to the next leg's initial point.
curvedJunction :: CardinalDirection -> CardinalDirection -> Array PathCommand
curvedJunction currentDir nextDir = [ q Rel dx dy x' y' ]
  where
  Tuple x' y' = initialLocation nextDir - terminalLocation currentDir
  Tuple dx dy = case nextDir of
    Up -> Tuple x' 0.0
    Right -> Tuple 0.0 y'
    Down -> Tuple x' 0.0
    Left -> Tuple 0.0 y'

-- | A direct line between two legs, used for `Nothing` (no special bend).
-- | Not yet exercised by any real piece -- every piece today uses Curved.
straightJunction :: CardinalDirection -> CardinalDirection -> Array PathCommand
straightJunction _ nextDir = [ uncurry (l Abs) (initialLocation nextDir) ]

-- | A mitered right-angle corner, used for `Just Sharp`. Not yet exercised by
-- | any real piece -- provisional until a piece actually uses it.
sharpJunction :: CardinalDirection -> CardinalDirection -> Array PathCommand
sharpJunction currentDir nextDir =
  [ l Abs x1 y2, l Abs x2 y2 ]
  where
  Tuple x1 _ = terminalLocation currentDir
  Tuple x2 y2 = initialLocation nextDir

junctionPath :: Maybe JunctionType -> CardinalDirection -> CardinalDirection -> Array PathCommand
junctionPath Nothing = straightJunction
junctionPath (Just Curved) = curvedJunction
junctionPath (Just Sharp) = sharpJunction

isConnected :: CardinalDirection -> Map CardinalDirection PortInfo -> Boolean
isConnected dir portStates = maybe false _.connected (M.lookup dir portStates)

legPath :: Leg -> Map CardinalDirection PortInfo -> Array PathCommand
legPath leg portStates = case leg.portType of
  Input -> stubPath leg.direction
  Output -> outputPath (isConnected leg.direction portStates) leg.direction

-- | Trace one closed cycle of legs into a path, using each leg's connected/
-- | signal state from portStates to decide stub-vs-arrow at each edge.
-- | Not SVG content itself -- just path data -- so this stays a plain `Path`.
renderTrace :: Trace -> Map CardinalDirection PortInfo -> Path
renderTrace End _ = []
renderTrace (Link leg junction rest) portStates =
  [ uncurry (m Abs) (initialLocation leg.direction) ] <> go leg.direction leg junction rest
  where
  go :: CardinalDirection -> Leg -> Maybe JunctionType -> Trace -> Path
  go headDirection currentLeg currentJunction currentRest =
    legPath currentLeg portStates
      <> junctionPath currentJunction currentLeg.direction nextDirection
      <> case currentRest of
        End -> []
        Link nextLeg nextJunction nextRest -> go headDirection nextLeg nextJunction nextRest
    where
    nextDirection = case currentRest of
      End -> headDirection
      Link nextLeg _ _ -> nextLeg.direction

-- | Draw every independent trace in a piece's outline config. Generic in `i`:
-- | the outline doesn't raise any action today, so it isn't typed as if it did.
renderOutline :: forall w i. OutlineConfig -> Map CardinalDirection PortInfo -> HTML w i
renderOutline config portStates =
  SE.g [] (map (\trace -> renderPath (renderTrace trace portStates)) config.shape)
