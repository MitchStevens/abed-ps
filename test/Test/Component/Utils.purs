module Test.Component.Utils where

import Prelude

import AppM (AppM, runAppM)
import Control.Monad.Error.Class (throwError)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Class.Console (log)
import Effect.Ref as Ref
import Halogen (Component, HalogenIO, liftEffect)
import Halogen.Aff (awaitBody)
import Halogen.Aff.Driver (RenderSpec, runUI)
import Halogen.Aff.Driver.State (RenderStateX)
import Partial.Unsafe (unsafeCrashWith)
import Web.HTML (window)
import Web.HTML.Window (document)

--mountComponent :: forall q i o. Component q i o AppM -> i -> Aff (HalogenIO q o Aff)
--mountComponent component input = do
--  element <- unsafeCrashWith "wow"
--  rootComponent <- runAppM component
--  runUI testRenderSpec rootComponent input element
--
--type TestRenderState s a sl o =
--  { renderChildRef :: Ref ()
--    
--  }
--
--testRenderSpec :: forall s a sl o. RenderSpec (RenderStateX s a sl o)
--testRenderSpec = 
--  { dispose:  \_ -> log "dispose" -- forall s act ps o. r s act ps o -> Effect Unit
--  , removeChild: \_ -> log "removeChild" -- :: forall s act ps o. r s act ps o -> Effect Unit
--  , render: \_ _ _ _ -> log "render"
--  , renderChild: identity
--  }
