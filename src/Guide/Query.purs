module Guide.Query where

import Prelude

import Control.Monad.State (StateT)
import Effect.Exception (throw)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML (window)
import Web.HTML.Window (document)


