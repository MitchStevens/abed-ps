module Main where

import Prelude

import AppM (runAppM)
import Capability.ChatServer (runChatServer)
import Capability.Navigate (Route(..), navigateTo, routeCodec)
import Component.Routes as Routes
import Control.Monad.Error.Class (throwError)
import Control.Monad.Reader (ReaderT, runReaderT)
import Data.Either (either, fromRight)
import Data.Maybe (Maybe(..), maybe)
import Effect (Effect)
import Effect.Aff (Aff, error, launchAff_, runAff_)
import Effect.Class.Console (log)
import Effect.Exception (error, throw)
import Halogen (Component, HalogenIO, liftEffect)
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)
import Routing.Duplex (parse)
import Routing.Hash (matchesWith)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML (HTMLElement)

main :: Effect Unit
main = HA.runHalogenAff do
  HA.awaitLoad
  rootComponent <- runAppM Routes.component
  { dispose, messages, query } <- runUI rootComponent unit =<< rootElement
  liftEffect do
    initialiseRouting (\route -> HA.runHalogenAff $ query (Routes.Navigate route unit))

rootElement :: Aff HTMLElement
rootElement =
  HA.selectElement (QuerySelector "#abed") >>=
    maybe (throwError $ error ("Could not find element #abed")) pure

initialiseRouting :: (Route -> Effect Unit) -> Effect Unit
initialiseRouting onNewRoute = void $ do
  matchesWith (parse routeCodec) \old new ->
    when (old /= Just new) (onNewRoute new)
