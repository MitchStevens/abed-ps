module AppM where

import Prelude

import Control.Monad.Logger.Trans (class MonadLogger, LoggerT, debug, info, lift, runLoggerT)
import Control.Monad.Reader (class MonadAsk, ReaderT, runReader, runReaderT)
import Data.Foldable (sum)
import Data.Log.Level (LogLevel(..))
import Data.Map as M
import Effect (Effect)
import Effect.Aff (Aff, delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Ref as Ref
import Game.GameEvent (GameEvent, GameEventStore)
import Game.GameEvent as GameEvent
import GlobalState (GlobalState, initialGlobalState, levelProgress, setLogLevel)
import GlobalState as GlobalState
import Halogen (Component, HalogenM)
import Halogen as H
import Halogen.HTML (object)
import Logging (logMessage)
import Prim.TypeError (class Warn)
import Web.HTML (window)
import Web.HTML.Location (hostname)
import Web.HTML.Window (location)

 
newtype AppM a = AppM (
  LoggerT (ReaderT GlobalState Aff) a)
derive newtype instance Functor AppM
derive newtype instance Apply AppM
derive newtype instance Applicative AppM
derive newtype instance Bind AppM
derive newtype instance Monad AppM
derive newtype instance MonadEffect AppM
derive newtype instance MonadAff AppM
derive newtype instance MonadAsk GlobalState AppM
derive newtype instance MonadLogger AppM


hoistAppM :: forall a. GlobalState -> AppM a -> Aff a
hoistAppM store (AppM appM) = do
  flip runReaderT store do
    logLevel <- GlobalState.logLevel
    flip runLoggerT (logMessage logLevel) do
      appM

runAppM :: forall q i o. Component q i o AppM -> Aff (Component q i o Aff)
runAppM component = do
  globalState <- liftEffect initialGlobalState
  isLocal <- liftEffect isRunningLocally
  when isLocal do
    void $ runReaderT (setLogLevel Trace) globalState
    flip runLoggerT (logMessage Trace) do
      info M.empty ("Starting ABED in dev mode")

  pure $ H.hoist (hoistAppM globalState) component

isRunningLocally :: Effect Boolean
isRunningLocally = do
  host <- window >>= location >>= hostname
  pure (host == "")
