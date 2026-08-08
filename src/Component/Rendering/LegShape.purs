module Component.Rendering.LegShape
  ( arrowPath
  , curveBetweenPath
  , initialLocation
  , outputPath
  , stubPath
  , terminalLocation
  ) where

import Prelude

import Component.Rendering.Segment (Point, Segment(..), lineSequence)
import Game.Direction (CardinalDirection(..))

-- | Where a leg's stub/arrow shape starts, before it's drawn.
initialLocation :: CardinalDirection -> Point
initialLocation = case _ of
  Up -> { x: 35.0, y: 25.0 }
  Right -> { x: 75.0, y: 35.0 }
  Down -> { x: 65.0, y: 75.0 }
  Left -> { x: 25.0, y: 65.0 }

-- | Where a leg's stub/arrow shape ends, and the curve to the next leg begins.
terminalLocation :: CardinalDirection -> Point
terminalLocation = case _ of
  Up -> { x: 65.0, y: 25.0 }
  Right -> { x: 75.0, y: 65.0 }
  Down -> { x: 35.0, y: 75.0 }
  Left -> { x: 25.0, y: 35.0 }

-- | Every leg shape below is a pure "walk the pen by these deltas" recipe,
-- | anchored at an explicit `start` -- that's what lets them be reused both
-- | by `Component.Rendering.Outline`/`Wire` (where `start` always lines up
-- | with `initialLocation`/`terminalLocation`) and by
-- | `Component.Rendering.Port`'s `portPath` (where it doesn't -- ports draw
-- | the same shapes anchored at their own, unrelated local coordinates).
arrowPath :: Point -> CardinalDirection -> Array Segment
arrowPath start dir = lineSequence start $ case dir of
  Up ->
    [ { x: 0.0, y: -13.0 }, { x: -10.0, y: 0.0 }, { x: 25.0, y: -12.0 }, { x: 25.0, y: 12.0 }, { x: -10.0, y: 0.0 }, { x: 0.0, y: 13.0 } ]
  Right ->
    [ { x: 13.0, y: 0.0 }, { x: 0.0, y: -10.0 }, { x: 12.0, y: 25.0 }, { x: -12.0, y: 25.0 }, { x: 0.0, y: -10.0 }, { x: -13.0, y: 0.0 } ]
  Down ->
    [ { x: 0.0, y: 13.0 }, { x: 10.0, y: 0.0 }, { x: -25.0, y: 12.0 }, { x: -25.0, y: -12.0 }, { x: 10.0, y: 0.0 }, { x: 0.0, y: -13.0 } ]
  Left ->
    [ { x: -13.0, y: 0.0 }, { x: 0.0, y: 10.0 }, { x: -12.0, y: -25.0 }, { x: 12.0, y: -25.0 }, { x: 0.0, y: 10.0 }, { x: 13.0, y: 0.0 } ]

stubPath :: Point -> CardinalDirection -> Array Segment
stubPath start dir = lineSequence start $ case dir of
  Up -> [ { x: 0.0, y: -25.0 }, { x: 30.0, y: 0.0 }, { x: 0.0, y: 25.0 } ]
  Right -> [ { x: 25.0, y: 0.0 }, { x: 0.0, y: 30.0 }, { x: -25.0, y: 0.0 } ]
  Down -> [ { x: 0.0, y: 25.0 }, { x: -30.0, y: 0.0 }, { x: 0.0, y: -25.0 } ]
  Left -> [ { x: -25.0, y: 0.0 }, { x: 0.0, y: -30.0 }, { x: 25.0, y: 0.0 } ]

-- | An output leg: flush against the frame if connected to a neighbour,
-- | pointing an arrow at where a neighbour would go if not.
outputPath :: Boolean -> Point -> CardinalDirection -> Array Segment
outputPath connected = if connected then stubPath else arrowPath

-- | The curve connecting the current leg's end to the next leg's start.
-- | `dx`/`dy` come from the `initialLocation`/`terminalLocation` tables --
-- | not from `from` -- and are applied as an offset *relative to* `from`, so
-- | this draws the same-shaped curve regardless of where `from` actually is.
curveBetweenPath :: Point -> CardinalDirection -> CardinalDirection -> Array Segment
curveBetweenPath from currentDir nextDir =
  [ QuadTo { from, control: { x: from.x + dx, y: from.y + dy }, to: { x: from.x + x', y: from.y + y' } } ]
  where
  x' = (initialLocation nextDir).x - (terminalLocation currentDir).x
  y' = (initialLocation nextDir).y - (terminalLocation currentDir).y
  { dx, dy } = case nextDir of
    Up -> { dx: x', dy: 0.0 }
    Right -> { dx: 0.0, dy: y' }
    Down -> { dx: x', dy: 0.0 }
    Left -> { dx: 0.0, dy: y' }
