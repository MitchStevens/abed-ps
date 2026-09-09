module Render.Outline where

import Prelude

import Render.LegShape (arrowPath, curveBetweenPath, initialLocation, outputPath, stubPath, terminalLocation)
import Render.PieceShape (JunctionType(..), Leg, OutlineConfig, Trace(..))
import Render.Segment (Segment(..), renderPath)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Game.Direction (CardinalDirection)
import Game.Port (PortType(..))
import Game.PortInfo (PortInfo)
import Halogen.HTML (HTML)
import Halogen.Svg.Elements as SE

-- | The quadratic-bezier corner used between two Curved-joined legs, going
-- | from the current leg's terminal point to the next leg's initial point.
curvedJunction :: CardinalDirection -> CardinalDirection -> Array Segment
curvedJunction currentDir nextDir = curveBetweenPath (terminalLocation currentDir) currentDir nextDir

-- | A direct line between two legs, used for `Nothing` (no special bend).
-- | Not yet exercised by any real piece -- every piece today uses Curved.
straightJunction :: CardinalDirection -> CardinalDirection -> Array Segment
straightJunction currentDir nextDir = [ LineTo { from: terminalLocation currentDir, to: initialLocation nextDir } ]

-- | A mitered right-angle corner, used for `Just Sharp`. Not yet exercised by
-- | any real piece -- provisional until a piece actually uses it.
sharpJunction :: CardinalDirection -> CardinalDirection -> Array Segment
sharpJunction currentDir nextDir =
  [ LineTo { from, to: corner }, LineTo { from: corner, to: end } ]
  where
  from = terminalLocation currentDir
  end = initialLocation nextDir
  corner = { x: from.x, y: end.y }

junctionPath :: Maybe JunctionType -> CardinalDirection -> CardinalDirection -> Array Segment
junctionPath Nothing = straightJunction
junctionPath (Just Curved) = curvedJunction
junctionPath (Just Sharp) = sharpJunction

isConnected :: CardinalDirection -> Map CardinalDirection PortInfo -> Boolean
isConnected dir portStates = maybe false _.connected (M.lookup dir portStates)

legPath :: Leg -> Map CardinalDirection PortInfo -> Array Segment
legPath leg portStates = case leg.portType of
  Input -> stubPath (initialLocation leg.direction) leg.direction
  Output -> outputPath (isConnected leg.direction portStates) (initialLocation leg.direction) leg.direction

-- | Trace one closed cycle of legs into a path, using each leg's connected/
-- | signal state from portStates to decide stub-vs-arrow at each edge.
-- | Not SVG content itself -- just path data -- so this stays a plain `Array Segment`.
renderTrace :: Trace -> Map CardinalDirection PortInfo -> Array Segment
renderTrace End _ = []
renderTrace (Link leg junction rest) portStates =
  go leg.direction leg junction rest
  where
  go :: CardinalDirection -> Leg -> Maybe JunctionType -> Trace -> Array Segment
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
