module Test.Component.Rendering.Segment where

import Prelude

import Component.Rendering.Segment (Point, Segment(..), endPoint, rotate, startPoint, translate)
import Data.Int (toNumber)
import Data.Number (abs, sqrt)
import Test.QuickCheck ((<?>))
import Test.QuickCheck.Gen (Gen, chooseInt)
import Test.Rotation (genRotation)
import Test.Spec (Spec, describe, it)
import Test.Spec.QuickCheck (quickCheck)

-- | Coordinates bounded to a plausible viewBox-ish range.
genPoint :: Gen Point
genPoint = { x: _, y: _ } <$> genCoord <*> genCoord
  where
  genCoord = toNumber <$> chooseInt (-50) 50

genSegment :: Gen Segment
genSegment = chooseInt 0 2 >>= case _ of
  0 -> (\from to -> LineTo { from, to }) <$> genPoint <*> genPoint
  1 -> (\from control to -> QuadTo { from, control, to }) <$> genPoint <*> genPoint <*> genPoint
  _ -> (\from to -> ClosePath { from, to }) <$> genPoint <*> genPoint

-- | Straight-line distance between two points -- a local, test-only stand-in
-- | for a Segment's own length (`endPoint`/`startPoint` are all this module
-- | actually needs to expose; anything fancier than a straight-line check
-- | belongs in a test, not the module).
distance :: Point -> Point -> Number
distance p1 p2 = sqrt (dx * dx + dy * dy)
  where
  dx = p2.x - p1.x
  dy = p2.y - p1.y

-- | `translate`/`rotate` re-derive every coordinate via floating-point
-- | addition (and, for `rotate`, multiplication by exact 0/1/-1 factors), so
-- | distances before and after are only guaranteed equal up to rounding, not
-- | bit-for-bit -- hence a tolerance rather than `shouldEqual`.
approxEqual :: Number -> Number -> Boolean
approxEqual a b = abs (a - b) < 1.0e-9

spec :: Spec Unit
spec =
  describe "Component.Rendering.Segment" do
    describe "translate" do
      it "doesn't change the distance between a Segment's start and end" do
        quickCheck do
          segment <- genSegment
          delta <- genPoint
          let
            before = distance (startPoint segment) (endPoint segment)
            translated = translate delta segment
            after = distance (startPoint translated) (endPoint translated)
          pure $ approxEqual before after
            <?> ("distance " <> show before <> " became " <> show after <> " after translating by " <> show delta)

      it "shifts both start and end by exactly the given offset" do
        quickCheck do
          segment <- genSegment
          delta <- genPoint
          let translated = translate delta segment
          pure
            $ (startPoint translated == { x: (startPoint segment).x + delta.x, y: (startPoint segment).y + delta.y }
                 && endPoint translated == { x: (endPoint segment).x + delta.x, y: (endPoint segment).y + delta.y }
              )
            <?> ("translating " <> show segment <> " by " <> show delta <> " gave " <> show translated)

    describe "rotate" do
      it "doesn't change the distance between a Segment's start and end" do
        quickCheck do
          segment <- genSegment
          center <- genPoint
          rot <- genRotation
          let
            before = distance (startPoint segment) (endPoint segment)
            rotated = rotate center rot segment
            after = distance (startPoint rotated) (endPoint rotated)
          pure $ approxEqual before after
            <?> ("distance " <> show before <> " became " <> show after <> " after rotating about " <> show center)

      it "doesn't move the center it rotates about" do
        quickCheck do
          center <- genPoint
          rot <- genRotation
          let rotated = rotate center rot (LineTo { from: center, to: center })
          pure $ (startPoint rotated == center && endPoint rotated == center)
            <?> ("rotating a point already at the center moved it to " <> show rotated)
