module Test.Component.CardStack where

import Prelude

import Component.CardStack (cooldown, isOffCooldown)
import Data.DateTime.Instant (Instant, instant)
import Data.Maybe (Maybe(..), fromJust)
import Data.Time.Duration (Milliseconds(..))
import Partial.Unsafe (unsafePartial)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

-- | An arbitrary but valid `Instant`, `ms` milliseconds after the epoch.
at :: Number -> Instant
at ms = unsafePartial (fromJust (instant (Milliseconds ms)))

spec :: Spec Unit
spec = describe "Component.CardStack" do
  describe "isOffCooldown" do
    it "is always off cooldown when no card has landed yet" do
      isOffCooldown cooldown Nothing (at 0.0) `shouldEqual` true
      isOffCooldown cooldown Nothing (at 999999.0) `shouldEqual` true

    it "stays on cooldown for anything strictly within the cooldown window" do
      isOffCooldown (Milliseconds 1000.0) (Just (at 0.0)) (at 1.0) `shouldEqual` false
      isOffCooldown (Milliseconds 1000.0) (Just (at 0.0)) (at 999.0) `shouldEqual` false

    it "comes off cooldown the instant the full window has elapsed" do
      isOffCooldown (Milliseconds 1000.0) (Just (at 0.0)) (at 1000.0) `shouldEqual` true
      isOffCooldown (Milliseconds 1000.0) (Just (at 0.0)) (at 1500.0) `shouldEqual` true

    it "stays on cooldown for a card landing at the exact same instant as the last one" do
      isOffCooldown (Milliseconds 1000.0) (Just (at 500.0)) (at 500.0) `shouldEqual` false
