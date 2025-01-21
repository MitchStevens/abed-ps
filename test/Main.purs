module Test.Main
  ( main
  )
  where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Halogen (liftEffect)
import Test.Spec.Discovery (discover)
import Test.Spec.Reporter (specReporter)
import Test.Spec.Runner.Node (runSpecAndExitProcess)

main :: Effect Unit
main = launchAff_ do
  specs <- discover "Test.*"
  liftEffect (runSpecAndExitProcess [ specReporter ] specs)