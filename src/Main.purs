module Main where

import Prelude

import AppM (runAppM)
import Capability.Navigate (Route, routeCodec)
import Component.Routes as Routes
import Control.Monad.Error.Class (throwError)
import Control.Monad.Logger.Class (info, log)
import Control.Monad.Logger.Trans (runLoggerT)
import Data.Log.Level (LogLevel(..))
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Effect (Effect)
import Effect.Aff (Aff, error)
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)
import Logging (logMessage)
import Routing.Duplex (parse)
import Routing.Hash (matchesWith)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML (HTMLElement, window)
import Web.HTML.Location (hostname)
import Web.HTML.Window (location)

main :: Effect Unit
main =
  HA.runHalogenAff do
    HA.awaitLoad
    rootComponent <- runAppM Routes.component
    ui <- runUI rootComponent unit =<< rootElement
    liftEffect $
      initialiseRouting (\route -> HA.runHalogenAff $ ui.query (Routes.Navigate route unit))





rootElement :: Aff HTMLElement
rootElement =
  HA.selectElement (QuerySelector "#abed") >>=
    maybe (throwError $ error ("Could not find element #abed")) pure

initialiseRouting :: (Route -> Effect Unit) -> Effect Unit
initialiseRouting onNewRoute = void $ do
  matchesWith (parse routeCodec) \old new ->
    when (old /= Just new) (onNewRoute new)

isRunningLocally :: Effect Boolean
isRunningLocally = do
  host <- window >>= location >>= hostname
  pure (host == "")