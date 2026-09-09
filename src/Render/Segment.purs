module Render.Segment
  ( Point
  , Segment(..)
  , endPoint
  , genPoint
  , lineSequence
  , renderPath
  , renderPathWithFill
  , rotate
  , startPoint
  , toPath
  , toPathCommand
  , translate
  ) where

import Prelude

import Render.Path (Path)
import Render.Path (renderPath, renderPathWithFill) as Path
import Data.Array as Array
import Data.Generic.Rep (class Generic)
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import Data.Show.Generic (genericShow)
import Data.Tuple (Tuple(..))
import Game.Rotation (Rotation(..))
import Halogen.HTML (HTML)
import Halogen.Svg.Attributes (Color, CommandPositionReference(..), PathCommand, l, m, q)
import Test.QuickCheck (class Arbitrary)
import Test.QuickCheck.Gen (Gen, chooseInt)

-- | A point in the piece's 0-100 viewBox space.
type Point = { x :: Number, y :: Number }

-- | Not an `Arbitrary` instance: `Point` is a plain type alias for a bare
-- | `{ x :: Number, y :: Number }` record, which has no identity of its own
-- | to hang an instance on -- any other record that happens to share that
-- | exact shape would silently pick it up too. Bounded to a plausible
-- | viewBox-ish range rather than the full `Number` range, same as before.
genPoint :: Gen Point
genPoint = { x: _, y: _ } <$> genCoord <*> genCoord
  where
  genCoord = toNumber <$> chooseInt (-50) 50

-- | One step of an SVG path, always in absolute coordinates, and always
-- | carrying its own start point (`from`) as well as where it ends up.
-- |
-- | This exists because `Halogen.Svg.Attributes`'s own `PathCommand` is
-- | opaque (its constructor isn't exported) and can be built in either
-- | absolute or relative form -- so two `PathCommand`s can be `==` without
-- | drawing the same stroke (same relative delta, different preceding
-- | context), or draw the same stroke without being `==` (same visual
-- | segment, different deltas). Neither is useable where "equal" needs to
-- | mean "draws the same thing," full stop.
-- |
-- | Being absolute isn't quite enough on its own, though: a bare `LineTo
-- | { to: p }` still means "wherever the pen already was, to p" -- so the
-- | *same* `LineTo` value could describe two different lines that just
-- | happen to share an endpoint, depending on where the pen was beforehand.
-- | Carrying `from` explicitly on every segment closes that gap: equal
-- | `Segment`s are now guaranteed to draw the same stroke, full stop.
-- |
-- | Also omits the `h`/`v` shorthand `Halogen.Svg.Attributes.Path` offers for
-- | `LineTo` -- that's just `LineTo` with an implied argument, and having two
-- | ways to spell the same segment would break the "equal Segment = equal
-- | stroke" property this type exists for.
data Segment
  = LineTo { from :: Point, to :: Point }
  | QuadTo { from :: Point, control :: Point, to :: Point }
  | ClosePath { from :: Point, to :: Point }

derive instance eqSegment :: Eq Segment
derive instance genericSegment :: Generic Segment _

instance showSegment :: Show Segment where
  show = genericShow

instance arbitrarySegment :: Arbitrary Segment where
  arbitrary = chooseInt 0 2 >>= case _ of
    0 -> (\from to -> LineTo { from, to }) <$> genPoint <*> genPoint
    1 -> (\from control to -> QuadTo { from, control, to }) <$> genPoint <*> genPoint <*> genPoint
    _ -> (\from to -> ClosePath { from, to }) <$> genPoint <*> genPoint

-- | Render one Segment down to the library's own PathCommand -- the only
-- | place a Segment ever needs to know that type exists. `from` isn't
-- | needed here: the real rendered path is already sitting at the right
-- | point by the time this command runs, `from` only matters for our own
-- | comparisons.
toPathCommand :: Segment -> PathCommand
toPathCommand = case _ of
  LineTo { to } -> l Abs to.x to.y
  QuadTo { control, to } -> q Abs control.x control.y to.x to.y
  ClosePath { to } -> l Abs to.x to.y

-- | A whole path, as SVG is actually asked to draw it. The leading `m Abs`
-- | an SVG path needs isn't stored as its own Segment -- every Segment
-- | already carries its own `from`, so the first one's is all `toPath` needs
-- | to derive it.
toPath :: Array Segment -> Path
toPath segments = leadingMove <> map toPathCommand segments
  where
  leadingMove = case Array.head segments of
    Nothing -> []
    Just s -> [ m Abs (startPoint s).x (startPoint s).y ]

-- | Draw a whole Segment path as SVG. The one place `Array Segment` becomes
-- | `PathCommand`s -- everything upstream (outline traces, wire paths, port
-- | icons) builds and passes around `Segment`s, and only turns them into what
-- | the SVG library wants right here, at the end of the rendering process.
renderPath :: forall w i. Array Segment -> HTML w i
renderPath = Path.renderPath <<< toPath

-- | Same as `renderPath`, but with an explicit fill instead of `none` -- see
-- | `Component.Board.Render`'s board-port icons, which fill blue once their
-- | signal goes live.
renderPathWithFill :: forall w i. Color -> Array Segment -> HTML w i
renderPathWithFill fill = Path.renderPathWithFill fill <<< toPath

-- | Shift every point of a Segment by a constant offset.
translate :: Point -> Segment -> Segment
translate delta = mapPoints \p -> { x: p.x + delta.x, y: p.y + delta.y }

-- | Turn every point of a Segment by a quarter-turn `Rotation` about `center`.
-- | Uses the exact per-quarter sin/cos values (as `Game.Rotation.toRadians`
-- | plus `sin`/`cos` would not) so a rotated `Segment` stays bit-for-bit equal
-- | after a round trip through opposite rotations -- see the `Eq Segment`
-- | note above.
rotate :: Point -> Rotation -> Segment -> Segment
rotate center rot = mapPoints \p ->
  let
    dx = p.x - center.x
    dy = p.y - center.y
  in
    { x: center.x + c * dx - s * dy
    , y: center.y + s * dx + c * dy
    }
  where
  Tuple s c = case rot of
    Rotation 0 -> Tuple 0.0 1.0
    Rotation 1 -> Tuple 1.0 0.0
    Rotation 2 -> Tuple 0.0 (-1.0)
    Rotation _ -> Tuple (-1.0) 0.0

-- | Chain a polyline of `LineTo` segments from `start`, walking through each
-- | of `deltas` as a relative offset from wherever the previous one landed --
-- | the same "walk the pen by these deltas" recipe piece outlines and wire
-- | traces are authored as, minus the hidden cursor state: `start` and every
-- | delta are given up front, and the absolute points fall out of the fold.
lineSequence :: Point -> Array Point -> Array Segment
lineSequence start deltas = (Array.foldl step { point: start, segments: [] } deltas).segments
  where
  step acc delta =
    { point: next, segments: acc.segments <> [ LineTo { from: acc.point, to: next } ] }
    where
    next = { x: acc.point.x + delta.x, y: acc.point.y + delta.y }

-- | Apply a point transform to every point a Segment carries.
mapPoints :: (Point -> Point) -> Segment -> Segment
mapPoints f = case _ of
  LineTo { from, to } -> LineTo { from: f from, to: f to }
  QuadTo { from, control, to } -> QuadTo { from: f from, control: f control, to: f to }
  ClosePath { from, to } -> ClosePath { from: f from, to: f to }

-- | Where the pen is when it starts drawing a Segment.
startPoint :: Segment -> Point
startPoint = case _ of
  LineTo { from } -> from
  QuadTo { from } -> from
  ClosePath { from } -> from

-- | Where the pen ends up after drawing a Segment.
endPoint :: Segment -> Point
endPoint = case _ of
  LineTo { to } -> to
  QuadTo { to } -> to
  ClosePath { to } -> to
