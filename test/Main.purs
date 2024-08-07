module Test.Main where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_, runAff_)
import Halogen as Test
import Test.Spec.Discovery (discover)
import Test.Spec.Reporter (consoleReporter, dotReporter)
import Test.Spec.Reporter as Reporter
import Test.Spec.Reporter.Tap (tapReporter)
import Test.Spec.Runner (runSpec)

main :: Effect Unit
main = launchAff_ $
  discover "Test.*" >>= runSpec [ consoleReporter ]