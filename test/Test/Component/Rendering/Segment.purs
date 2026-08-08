module Test.Component.Rendering.Segment where

import Prelude

import Component.Rendering.Segment (Point, Segment(..), controlPoints, distance, endPoint, length, lerpPath, lerpPathSteps, lerpSegment, normaliseSegments, quadraticLength, rotate, splitSegment, startPoint, toTuple, translate)
import Data.Array ((..), drop, zipWith)
import Data.Array as Array
import Data.Foldable (sum)
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import Data.Number (abs)
import Data.Tuple (Tuple(..))
import Test.QuickCheck (Result(..), (<?>))
import Test.QuickCheck.Gen (Gen, choose, chooseInt, suchThat)
import Test.Rotation (genRotation)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

-- | Coordinates bounded to a plausible viewBox-ish range -- wide enough for
-- | real variety, narrow enough that "a" in quadraticLength's derivation
-- | doesn't land in the degenerate-but-not-quite-zero range that would make
-- | the closed form numerically unstable.
genPoint :: Gen Point
genPoint = { x: _, y: _ } <$> genCoord <*> genCoord
  where
  genCoord = toNumber <$> chooseInt (-50) 50

-- | The same quadratic Bezier `quadraticLength` describes, sampled as a
-- | polyline -- an independent (if less exact) way to compute the same
-- | quantity, used to check the closed-form formula against.
bezierPoint :: Number -> Point -> Point -> Point -> Point
bezierPoint t p0 p1 p2 =
  { x: mt * mt * p0.x + 2.0 * mt * t * p1.x + t * t * p2.x
  , y: mt * mt * p0.y + 2.0 * mt * t * p1.y + t * t * p2.y
  }
  where
  mt = 1.0 - t

numericQuadraticLength :: Int -> Point -> Point -> Point -> Number
numericQuadraticLength steps p0 p1 p2 = sum (zipWith distance points (drop 1 points))
  where
  points = (\i -> bezierPoint (toNumber i / toNumber steps) p0 p1 p2) <$> (0 .. steps)

genSegment :: Gen Segment
genSegment = chooseInt 0 2 >>= case _ of
  0 -> (\from to -> LineTo { from, to }) <$> genPoint <*> genPoint
  1 -> (\from control to -> QuadTo { from, control, to }) <$> genPoint <*> genPoint <*> genPoint
  _ -> (\from to -> ClosePath { from, to }) <$> genPoint <*> genPoint

-- | A Segment with actual length to split -- excludes the rare case where
-- | `genSegment` happened to generate coincident points.
genSplittableSegment :: Gen Segment
genSplittableSegment = genSegment `suchThat` (\s -> length s > 1.0e-6)

-- | One Segment continuing on from `from`, always with real (non-coincident)
-- | length -- `normaliseSegments` is meant to be exercised on genuine paths,
-- | not ones that already have zero-length pieces for it to filter.
genPathSegment :: Point -> Gen Segment
genPathSegment from =
  ( chooseInt 0 2 >>= case _ of
      0 -> (\to -> LineTo { from, to }) <$> genPoint
      1 -> (\control to -> QuadTo { from, control, to }) <$> genPoint <*> genPoint
      _ -> (\to -> ClosePath { from, to }) <$> genPoint
  ) `suchThat` (\s -> length s > 1.0e-6)

-- | A short chain of 1-5 Segments, each starting where the last one ended.
genPath :: Gen (Array Segment)
genPath = chooseInt 1 5 >>= \n -> genPoint >>= go n
  where
  go :: Int -> Point -> Gen (Array Segment)
  go 0 _ = pure []
  go n from = do
    segment <- genPathSegment from
    rest <- go (n - 1) (endPoint segment)
    pure ([ segment ] <> rest)

-- | Every segment in `path` picks up exactly where the previous one left off.
isChained :: Array Segment -> Boolean
isChained path = Array.all identity (zipWith (\a b -> endPoint a == startPoint b) path (Array.drop 1 path))

-- | `translate`/`rotate` re-derive every coordinate via floating-point
-- | addition (and, for `rotate`, multiplication by exact 0/1/-1 factors), so
-- | lengths before and after are only guaranteed equal up to rounding, not
-- | bit-for-bit -- hence a tolerance rather than `shouldEqual`.
approxEqual :: Number -> Number -> Boolean
approxEqual a b = abs (a - b) < 1.0e-9

spec :: Spec Unit
spec =
  describe "Component.Rendering.Segment" do
    describe "quadraticLength" do
      it "is the straight-line distance when the control point is degenerate (colinear)" do
        quadraticLength { x: 0.0, y: 0.0 } { x: 5.0, y: 5.0 } { x: 10.0, y: 10.0 }
          `shouldEqual` distance { x: 0.0, y: 0.0 } { x: 10.0, y: 10.0 }

      it "is at least the chord distance (a curve is never shorter than a straight line between its endpoints)" do
        quickCheck do
          p0 <- genPoint
          p1 <- genPoint
          p2 <- genPoint
          let
            arc = quadraticLength p0 p1 p2
            chord = distance p0 p2
          pure $ (arc >= chord - 1.0e-6)
            <?> ("arc length " <> show arc <> " was less than chord distance " <> show chord)

      it "matches a fine-grained numeric (polyline) approximation, within tolerance" do
        quickCheck do
          p0 <- genPoint
          p1 <- genPoint
          p2 <- genPoint
          let
            closedForm = quadraticLength p0 p1 p2
            numeric = numericQuadraticLength 2000 p0 p1 p2
            diff = abs (closedForm - numeric)
          pure $ (diff < 0.01)
            <?> ("closed-form " <> show closedForm <> " vs numeric " <> show numeric <> " differ by " <> show diff)

    describe "translate" do
      it "doesn't change a Segment's length" do
        quickCheck do
          segment <- genSegment
          delta <- genPoint
          let
            before = length segment
            after = length (translate delta segment)
          pure $ approxEqual before after
            <?> ("length " <> show before <> " became " <> show after <> " after translating by " <> show delta)

    describe "rotate" do
      it "doesn't change a Segment's length" do
        quickCheck do
          segment <- genSegment
          center <- genPoint
          rot <- genRotation
          let
            before = length segment
            after = length (rotate center rot segment)
          pure $ approxEqual before after
            <?> ("length " <> show before <> " became " <> show after <> " after rotating about " <> show center)

    describe "splitSegment" do
      it "is Nothing when n is outside (0, length segment)" do
        quickCheck do
          segment <- genSegment
          let
            len = length segment
            isNothing = case _ of
              Nothing -> true
              Just _ -> false
            allOutOfRange = isNothing (splitSegment 0.0 segment)
              && isNothing (splitSegment (-1.0) segment)
              && isNothing (splitSegment len segment)
              && isNothing (splitSegment (len + 1.0) segment)
          pure $ allOutOfRange
            <?> ("expected Nothing at the boundaries of (0, " <> show len <> ") for " <> show segment)

      it "splits off a first piece of the requested length, and the pieces' lengths sum back to the original" do
        quickCheck do
          segment <- genSplittableSegment
          frac <- choose 0.01 0.99
          let n = frac * length segment
          pure $ case splitSegment n segment of
            Nothing -> Failed ("expected a split at " <> show n <> " of " <> show segment)
            Just (Tuple a b) ->
              let
                la = length a
                lb = length b
              in
                (approxEqual la n && approxEqual (la + lb) (length segment))
                  <?> ("split " <> show segment <> " at " <> show n <> " gave lengths " <> show la <> " and " <> show lb)

      it "keeps the original segment's own from/to as the split pieces' outer endpoints, joined at the split point" do
        quickCheck do
          segment <- genSplittableSegment
          frac <- choose 0.01 0.99
          let n = frac * length segment
          pure $ case splitSegment n segment of
            Nothing -> Failed ("expected a split at " <> show n <> " of " <> show segment)
            Just (Tuple a b) ->
              (startPoint a == startPoint segment && endPoint b == endPoint segment && endPoint a == startPoint b)
                <?> ("split " <> show segment <> " at " <> show n <> " gave " <> show a <> " and " <> show b)

    describe "lerpSegment" do
      it "is exactly s1 at t = 0 and exactly s2 at t = 1, even across different Segment constructors" do
        quickCheck do
          s1 <- genSegment
          s2 <- genSegment
          pure $ (lerpSegment 0.0 s1 s2 == s1 && lerpSegment 1.0 s1 s2 == s2)
            <?> ("lerpSegment 0/1 didn't return the originals for " <> show s1 <> " -> " <> show s2)

      it "moves continuously: a step dt in t moves every one of from/control/to by exactly |dt| times its total s1->s2 distance" do
        quickCheck do
          s1 <- genSegment
          s2 <- genSegment
          t1 <- choose 0.05 0.95
          dt <- choose (-0.05) 0.05
          let
            t2 = t1 + dt
            p1 = controlPoints s1
            p2 = controlPoints s2
            a = controlPoints (lerpSegment t1 s1 s2)
            b = controlPoints (lerpSegment t2 s1 s2)
            movedAsExpected field = approxEqual (distance (field a) (field b)) (abs dt * distance (field p1) (field p2))
            ok = movedAsExpected _.from && movedAsExpected _.control && movedAsExpected _.to
          pure $ ok
            <?> ( "lerping " <> show s1 <> " -> " <> show s2 <> " from t=" <> show t1 <> " to t=" <> show t2
                    <> " didn't move each point by exactly |dt| times its total distance"
                )

    describe "normaliseSegments" do
      it "produces two paths of equal length" do
        quickCheck do
          p <- genPath
          q <- genPath
          let Tuple p' q' = toTuple (normaliseSegments p q)
          pure $ (Array.length p' == Array.length q')
            <?> ("got " <> show (Array.length p') <> " pieces vs " <> show (Array.length q') <> " for " <> show p <> " / " <> show q)

      it "keeps every corresponding pair's length-fraction equal between the two paths" do
        quickCheck do
          p <- genPath
          q <- genPath
          let
            Tuple p' q' = toTuple (normaliseSegments p q)
            pTotal = sum (map length p)
            qTotal = sum (map length q)
            ratiosMatch = Array.all identity
              (zipWith (\a b -> approxEqual (length a / pTotal) (length b / qTotal)) p' q')
          pure $ ratiosMatch
            <?> ( "fractions didn't match: " <> show (map length p') <> " / " <> show pTotal
                    <> " vs " <> show (map length q') <> " / " <> show qTotal
                )

      it "preserves each path's total length" do
        quickCheck do
          p <- genPath
          q <- genPath
          let Tuple p' q' = toTuple (normaliseSegments p q)
          pure $ (approxEqual (sum (map length p')) (sum (map length p)) && approxEqual (sum (map length q')) (sum (map length q)))
            <?> "normaliseSegments changed a path's total length"

      it "keeps each normalised path chained together and anchored to the original's own start/end" do
        quickCheck do
          p <- genPath
          q <- genPath
          let
            Tuple p' q' = toTuple (normaliseSegments p q)
            endpointsMatch original normalised = case Array.head original, Array.head normalised, Array.last original, Array.last normalised of
              Just o0, Just n0, Just oL, Just nL -> startPoint o0 == startPoint n0 && endPoint oL == endPoint nL
              _, _, _, _ -> false
          pure $ (isChained p' && endpointsMatch p p' && isChained q' && endpointsMatch q q')
            <?> ("normaliseSegments broke continuity or endpoints for " <> show p <> " / " <> show q)

      it "is a no-op when the two paths already match exactly" do
        quickCheck do
          p <- genPath
          pure $ (toTuple (normaliseSegments p p) == Tuple p p)
            <?> ("normaliseSegments p p changed p: " <> show p)

    describe "lerpPath" do
      it "is exactly the first normalised path at t = 0, and exactly the second at t = 1" do
        quickCheck do
          p <- genPath
          q <- genPath
          let
            paths = normaliseSegments p q
            Tuple p' q' = toTuple paths
          pure $ (lerpPath 0.0 paths == p' && lerpPath 1.0 paths == q')
            <?> "lerpPath 0/1 didn't return the normalised paths themselves"

    describe "lerpPathSteps" do
      it "produces exactly `count` paths, starting and ending at the two normalised paths" do
        quickCheck do
          p <- genPath
          q <- genPath
          count <- chooseInt 3 8
          let
            paths = normaliseSegments p q
            Tuple p' q' = toTuple paths
            steps = lerpPathSteps count paths
          pure $ (Array.length steps == count && Array.head steps == Just p' && Array.last steps == Just q')
            <?> ("lerpPathSteps " <> show count <> " gave " <> show (Array.length steps) <> " paths for " <> show p <> " / " <> show q)

      it "matches lerpPath sampled at each step's own t" do
        quickCheck do
          p <- genPath
          q <- genPath
          count <- chooseInt 3 8
          let
            paths = normaliseSegments p q
            steps = lerpPathSteps count paths
            expected = zipWith (\i step -> step == lerpPath (toNumber i / toNumber (count - 1)) paths) (Array.range 0 (count - 1)) steps
          pure $ Array.all identity expected
            <?> ("lerpPathSteps " <> show count <> " didn't match lerpPath sampled at the same t values")
