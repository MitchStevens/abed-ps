module Component.Rendering.Segment
  ( NormalisedPaths
  , Point
  , Segment(..)
  , controlPoints
  , distance
  , endPoint
  , length
  , lerpPath
  , lerpPathSteps
  , lerpSegment
  , lineSequence
  , normaliseSegments
  , quadraticLength
  , renderPath
  , rotate
  , splitSegment
  , startPoint
  , toPath
  , toPathCommand
  , toTuple
  , translate
  ) where

import Prelude

import Component.Rendering.Path (Path)
import Component.Rendering.Path (renderPath) as Path
import Data.Array as Array
import Data.Foldable (sum)
import Data.Generic.Rep (class Generic)
import Data.Int (toNumber)
import Data.List (List(..), (:))
import Data.List as List
import Data.Maybe (Maybe(..))
import Data.Number (abs, log, sqrt)
import Data.Show.Generic (genericShow)
import Data.Tuple (Tuple(..))
import Game.Rotation (Rotation(..))
import Halogen.HTML (HTML)
import Halogen.Svg.Attributes (CommandPositionReference(..), PathCommand, l, m, q, z)

-- | A point in the piece's 0-100 viewBox space.
type Point = { x :: Number, y :: Number }

-- | One step of an SVG path, always in absolute coordinates, and always
-- | carrying its own start point (`from`) as well as where it ends up.
-- |
-- | This exists because `Halogen.Svg.Attributes`'s own `PathCommand` is
-- | opaque (its constructor isn't exported) and can be built in either
-- | absolute or relative form -- so two `PathCommand`s can be `==` without
-- | drawing the same stroke (same relative delta, different preceding
-- | context), or draw the same stroke without being `==` (same visual
-- | segment, different deltas). Neither is useable for `Data.Diff`, which
-- | needs "equal" to mean "draws the same thing," full stop.
-- |
-- | Being absolute isn't quite enough on its own, though: a bare `LineTo
-- | { to: p }` still means "wherever the pen already was, to p" -- so the
-- | *same* `LineTo` value could be `Keep`-matched by the diff at two points
-- | that actually have different preceding context (say, the element right
-- | before it was `Remove`d on one side and `Insert`ed on the other), and
-- | then it silently draws two different lines that just happen to share an
-- | endpoint. Carrying `from` explicitly on every segment closes that gap:
-- | equal `Segment`s are now guaranteed to draw the same stroke, full stop,
-- | which is what makes a `Keep` chain in a diff safe to render statically.
-- | It's also exactly what `length` needs anyway, so it isn't wasted.
-- |
-- | `QuadTo`'s arc length has a closed form (see `quadraticLength`), which is
-- | why it's here; `CubicTo`/`ArcTo` don't (an elliptic integral in general)
-- | so they're left out -- any cubic or arc an outline needs has to be
-- | flattened into short line segments before it becomes a `Segment`.
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

-- | Render one Segment down to the library's own PathCommand -- the only
-- | place a Segment ever needs to know that type exists. `from` isn't
-- | needed here: the real rendered path is already sitting at the right
-- | point by the time this command runs, `from` only matters for our own
-- | comparisons and measurements.
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

-- | Straight-line distance between two points.
distance :: Point -> Point -> Number
distance p1 p2 = sqrt (dx * dx + dy * dy)
  where
  dx = p2.x - p1.x
  dy = p2.y - p1.y

-- | Shift every point of a Segment by a constant offset.
translate :: Point -> Segment -> Segment
translate delta = mapPoints \p -> { x: p.x + delta.x, y: p.y + delta.y }

-- | Turn every point of a Segment by a quarter-turn `Rotation` about `center`.
-- | Uses the exact per-quarter sin/cos values (as `Game.Rotation.toRadians`
-- | plus `sin`/`cos` would not) so a `Keep`-matched `Segment` stays bit-for-bit
-- | equal after a round trip through opposite rotations -- see the `Eq
-- | Segment` note above.
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

-- | Closed-form arc length of a quadratic Bezier from `p0` through control
-- | point `p1` to `p2`, up to parameter `t` (the full curve is `t = 1.0`).
-- |
-- | `B'(t)` is linear in `t` for a quadratic curve, so `|B'(t)|` is
-- | `sqrt(a*t^2 + b*t + c)` for some `a, b, c` derived from the three points,
-- | and `∫ sqrt(a*t^2+b*t+c) dt` is a standard closed-form antiderivative
-- | (square roots and a natural log) -- unlike cubic/arc, where the same
-- | integral has no elementary form. `a = 0` is the degenerate case (control
-- | point colinear with the endpoints, i.e. actually a straight line), where
-- | that antiderivative divides by zero, so it's handled separately.
quadraticLengthAt :: Point -> Point -> Point -> Number -> Number
quadraticLengthAt p0 p1 p2 t =
  if a < 1.0e-9 then t * distance p0 p2
  else 2.0 * (integral t - integral 0.0)
  where
  ax = p1.x - p0.x
  ay = p1.y - p0.y
  cx = p2.x - 2.0 * p1.x + p0.x
  cy = p2.y - 2.0 * p1.y + p0.y
  a = cx * cx + cy * cy
  b = 2.0 * (ax * cx + ay * cy)
  c = ax * ax + ay * ay
  sqrtA = sqrt a

  integral :: Number -> Number
  integral s =
    ((2.0 * a * s + b) * root) / (4.0 * a)
      + ((4.0 * a * c - b * b) / (8.0 * a * sqrtA)) * log (max 1.0e-12 (2.0 * a * s + b + 2.0 * sqrtA * root))
    where
    root = sqrt (max 0.0 (a * s * s + b * s + c))

-- | Closed-form arc length of a whole quadratic Bezier from `p0` through
-- | control point `p1` to `p2`. See `quadraticLengthAt`.
quadraticLength :: Point -> Point -> Point -> Number
quadraticLength p0 p1 p2 = quadraticLengthAt p0 p1 p2 1.0

-- | How far the pen travels drawing one Segment.
length :: Segment -> Number
length = case _ of
  LineTo { from, to } -> distance from to
  QuadTo { from, control, to } -> quadraticLength from control to
  ClosePath { from, to } -> distance from to

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

-- | The point a fraction `t` of the way from `p1` to `p2`.
lerp :: Point -> Point -> Number -> Point
lerp p1 p2 t = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) }

-- | Every Segment as a `(from, control, to)` quadratic Bezier -- possibly a
-- | degenerate one. `LineTo`/`ClosePath` get the midpoint of `from`/`to` as
-- | their control point, which is exactly the control point that makes a
-- | quadratic Bezier degenerate into that same straight line (see
-- | `lerpSegment`, which relies on this to keep a line a line while it's
-- | lerping).
controlPoints :: Segment -> { from :: Point, control :: Point, to :: Point }
controlPoints = case _ of
  LineTo { from, to } -> { from, control: lerp from to 0.5, to }
  QuadTo rec -> rec
  ClosePath { from, to } -> { from, control: lerp from to 0.5, to }

-- | Linearly interpolate between two Segments, `t` of the way from `s1` to
-- | `s2` (`t` is assumed to be in `[0, 1]`, and clamped if it isn't). Exactly
-- | `s1` at `t = 0` and exactly `s2` at `t = 1`; everywhere in between is a
-- | `QuadTo` built by lerping `s1`/`s2`'s `controlPoints`.
-- |
-- | That works, and stays continuous, even when `s1` and `s2` are different
-- | Segment constructors -- a `LineTo` lerping into a `QuadTo` bends smoothly
-- | into the curve, say -- because `controlPoints` reduces every kind of
-- | Segment to the same three-point shape first. The `t = 0`/
-- | `t = 1` endpoints are the only discontinuity, and it's one of
-- | representation only, not geometry: `controlPoints s1` is exactly what
-- | the interior formula converges to as `t -> 0` (lerping anything by `0.0`
-- | returns its left argument exactly), it's just that `s1` itself might not
-- | be a `QuadTo`.
-- |
-- | Only linear interpolation for now; if other easings are ever needed,
-- | this is the one place that would grow a parameter for it.
lerpSegment :: Number -> Segment -> Segment -> Segment
lerpSegment t s1 s2
  | t <= 0.0 = s1
  | t >= 1.0 = s2
  | otherwise = QuadTo
      { from: lerp p1.from p2.from t
      , control: lerp p1.control p2.control t
      , to: lerp p1.to p2.to t
      }
  where
  p1 = controlPoints s1
  p2 = controlPoints s2

-- | The Bezier parameter `t` at which the arc length from `p0` first reaches
-- | `target`, found by bisection -- `quadraticLengthAt`'s closed form has no
-- | elementary inverse. 40 halvings narrow `t` to well below double
-- | precision, so this is exact for any geometry this module deals in.
solveQuadraticParam :: Point -> Point -> Point -> Number -> Number
solveQuadraticParam p0 p1 p2 target = go 0.0 1.0 40
  where
  go lo hi 0 = (lo + hi) / 2.0
  go lo hi steps =
    let mid = (lo + hi) / 2.0
    in
      if quadraticLengthAt p0 p1 p2 mid < target then go mid hi (steps - 1)
      else go lo mid (steps - 1)

-- | Cut a Segment into two segments of the same shape, the first `n` long,
-- | that together draw exactly the same stroke as the original. `Nothing`
-- | if `n` is outside `(0, length segment)` -- there's no such split.
-- |
-- | The original segment's own drawn endpoints -- `from` and `to` -- always
-- | reappear somewhere in the result: the first piece starts at the original
-- | `from`, the second ends at the original `to`, and they meet at the new
-- | split point in between. A `QuadTo`'s `control` is the one exception --
-- | it's an off-curve handle, not a point the pen ever visits, so splitting
-- | the curve necessarily hands each half its own new control point (De
-- | Casteljau's construction) rather than reusing the original.
splitSegment :: Number -> Segment -> Maybe (Tuple Segment Segment)
splitSegment n segment
  | n <= 0.0 = Nothing
  | n >= length segment = Nothing
  | otherwise = case segment of
      LineTo { from, to } -> Just (Tuple (LineTo { from, to: mid }) (LineTo { from: mid, to }))
        where
        mid = lerp from to (n / distance from to)

      ClosePath { from, to } -> Just (Tuple (LineTo { from, to: mid }) (ClosePath { from: mid, to }))
        where
        mid = lerp from to (n / distance from to)

      QuadTo { from, control, to } ->
        Just (Tuple (QuadTo { from, control: q0, to: split }) (QuadTo { from: split, control: q1, to }))
        where
        t = solveQuadraticParam from control to n
        q0 = lerp from control t
        q1 = lerp control to t
        split = lerp q0 q1 t

-- | The result of `normaliseSegments`: two Segment paths, guaranteed the
-- | same length, with matching per-index length fractions. The constructor
-- | isn't exported -- `normaliseSegments` is the only way to get one -- so a
-- | `NormalisedPaths` in hand is a real guarantee, not just a naming
-- | convention, that `lerpPath`/`lerpPathSteps` can zip its two paths
-- | together safely.
newtype NormalisedPaths = NormalisedPaths (Tuple (Array Segment) (Array Segment))

derive instance eqNormalisedPaths :: Eq NormalisedPaths

-- | Written by hand rather than derived via `Generic`: a `Generic` instance
-- | would let anyone reconstruct a `NormalisedPaths` through it, defeating
-- | the point of not exporting the constructor.
instance showNormalisedPaths :: Show NormalisedPaths where
  show paths = "NormalisedPaths " <> show (toTuple paths)

-- | The two paths a `NormalisedPaths` was built from.
toTuple :: NormalisedPaths -> Tuple (Array Segment) (Array Segment)
toTuple (NormalisedPaths paths) = paths

-- | Normalise two Segment paths to the same number of pieces, splitting
-- | (never merging, reordering, or dropping anything that draws) so every
-- | corresponding pair occupies the same proportion of its own path's total
-- | length: `length (fst result !! i) / P == length (snd result !! i) / Q`
-- | for every `i`, where `P`/`Q` are `p`/`q`'s own total lengths.
-- |
-- | Zero-length segments are dropped first: they draw nothing, and have no
-- | principled positive-length counterpart to pair against (`splitSegment`
-- | never manufactures a zero-length piece). If either path is then empty,
-- | there's nothing to normalise against -- returns the filtered inputs
-- | unchanged.
normaliseSegments :: Array Segment -> Array Segment -> NormalisedPaths
normaliseSegments p q = NormalisedPaths $
  if pTotal <= 0.0 || qTotal <= 0.0 then Tuple pFiltered qFiltered
  else case List.fromFoldable pFiltered, List.fromFoldable qFiltered of
    Cons p0 pRest, Cons q0 qRest ->
      let
        result = merge p0 pRest q0 qRest Nil Nil
      in
        Tuple (List.toUnfoldable (List.reverse result.ps)) (List.toUnfoldable (List.reverse result.qs))
    _, _ -> Tuple pFiltered qFiltered
  where
  pFiltered = Array.filter (\s -> length s > 0.0) p
  qFiltered = Array.filter (\s -> length s > 0.0) q
  pTotal = sum (map length pFiltered)
  qTotal = sum (map length qFiltered)

  epsilon :: Number
  epsilon = 1.0e-9

  -- | Walk both paths' segments together, splitting whichever side's
  -- | current piece has the larger remaining share so the two proportions
  -- | keep pace, and emitting a matched pair every time they do.
  merge :: Segment -> List Segment -> Segment -> List Segment -> List Segment -> List Segment -> { ps :: List Segment, qs :: List Segment }
  merge currentP tailP currentQ tailQ psAcc qsAcc = case tailP, tailQ of
    Nil, Nil -> { ps: currentP : psAcc, qs: currentQ : qsAcc }
    _, _ ->
      let
        lp = length currentP
        lq = length currentQ
        cross = lp * qTotal - lq * pTotal
      in
        if abs cross < epsilon * pTotal * qTotal then
          case tailP, tailQ of
            Cons p' pRest, Cons q' qRest -> merge p' pRest q' qRest (currentP : psAcc) (currentQ : qsAcc)
            _, _ -> { ps: currentP : psAcc, qs: currentQ : qsAcc }
        else if cross < 0.0 then
          -- currentP is the proportionally smaller piece: take it whole, and
          -- carve a matching-fraction piece off the front of currentQ.
          case splitSegment ((lp / pTotal) * qTotal) currentQ of
            Just (Tuple consumed remainder) ->
              case tailP of
                Cons p' pRest -> merge p' pRest remainder tailQ (currentP : psAcc) (consumed : qsAcc)
                Nil -> { ps: currentP : psAcc, qs: consumed : qsAcc }
            Nothing ->
              -- Float drift pushed the target past splitSegment's own
              -- boundary guard: currentQ is already (near enough) fully
              -- accounted for, so take it whole and retry currentP against
              -- whatever comes next.
              case tailQ of
                Cons q' qRest -> merge currentP tailP q' qRest psAcc (currentQ : qsAcc)
                Nil -> { ps: currentP : psAcc, qs: currentQ : qsAcc }
        else
          -- Mirror image: currentQ is the smaller piece.
          case splitSegment ((lq / qTotal) * pTotal) currentP of
            Just (Tuple consumed remainder) ->
              case tailQ of
                Cons q' qRest -> merge remainder tailP q' qRest (consumed : psAcc) (currentQ : qsAcc)
                Nil -> { ps: consumed : psAcc, qs: currentQ : qsAcc }
            Nothing ->
              case tailP of
                Cons p' pRest -> merge p' pRest currentQ tailQ (currentP : psAcc) qsAcc
                Nil -> { ps: currentP : psAcc, qs: currentQ : qsAcc }

-- | Linearly interpolate an entire path, `t` of the way from one normalised
-- | path to the other -- `lerpSegment`, applied pairwise. Total (no length
-- | mismatch to worry about) because `NormalisedPaths` already guarantees
-- | the two paths have the same number of pieces.
lerpPath :: Number -> NormalisedPaths -> Array Segment
lerpPath t paths = Array.zipWith (lerpSegment t) p q
  where
  Tuple p q = toTuple paths

-- | `count` whole-path interpolations evenly spaced from the first path
-- | (`t = 0`) to the second (`t = 1`) inclusive -- `count` keyframes for a
-- | morph animation between them. Assumes `count > 2`.
lerpPathSteps :: Int -> NormalisedPaths -> Array (Array Segment)
lerpPathSteps count paths = (\i -> lerpPath (toNumber i / toNumber (count - 1)) paths) <$> Array.range 0 (count - 1)
