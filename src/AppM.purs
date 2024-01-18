module AppM where

import Prelude

import Control.Apply (applySecond)
import Control.Monad.Logger.Trans (class MonadLogger, LoggerT, info, lift, runLoggerT)
import Control.Monad.Reader (class MonadAsk, ReaderT, runReaderT)
import Data.Log.Level (LogLevel(..))
import Data.Map as M
import Effect.Aff (Aff, delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.GameEvent (GameEvent, GameEventStore)
import Game.GameEvent as GameEvent
import GlobalState (GlobalState)
import Halogen (Component, HalogenM)
import Halogen as H
import Logging (logMessage)

 
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

initialGlobalState :: Aff GlobalState
initialGlobalState = pure {}

runAppM :: forall q i o. Component q i o AppM -> Aff (Component q i o Aff)
runAppM component = do
  store <- initialGlobalState
  pure $ H.hoist (\(AppM appM) -> runReaderT (runLoggerT (appM) (logMessage Debug)) store) component
  --runStoreT GameEvent.empty (flip GameEvent.cons) storeComponent