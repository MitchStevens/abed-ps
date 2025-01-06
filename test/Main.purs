module Test.Main
  ( main
  )
  where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (launchAff_, runAff_)
import Halogen (liftEffect)
import Halogen as Test
import Test.Spec (parallel)
import Test.Spec.Discovery (discover)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)
import Test.Spec.Runner.Node (runSpecAndExitProcess, runSpecAndExitProcess')
import Test.Spec.Runner.Node.Config (defaultConfig)

main :: Effect Unit
main = launchAff_ do
  specs <- discover "Test.*"
  liftEffect (runSpecAndExitProcess [ consoleReporter ] specs)