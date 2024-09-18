module AppM where

import Prelude

import Control.Apply (applySecond)
import Control.Monad.Logger.Class (log)
import Control.Monad.Logger.Trans (class MonadLogger, LoggerT, info, lift, runLoggerT)
import Control.Monad.Reader (class MonadAsk, ReaderT, runReaderT)
import Data.Log.Level (LogLevel(..))
import Data.Newtype (class Newtype, unwrap)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import GlobalState (GlobalState, GlobalStateAction, initialGlobalState, reduce)
import Halogen (Component)
import Halogen as H
import Halogen.Store.Monad (class MonadStore, StoreT, runStoreT)
import Logging (logMessage)

 
-- todo: what is the optimal order for stacking monads?
newtype AppM a = AppM (
  (StoreT GlobalStateAction GlobalState (LoggerT Aff)) a)
derive instance Newtype (AppM a) _
derive newtype instance Functor AppM
derive newtype instance Apply AppM
derive newtype instance Applicative AppM
derive newtype instance Bind AppM
derive newtype instance Monad AppM
derive newtype instance MonadEffect AppM
derive newtype instance MonadAff AppM
derive newtype instance MonadStore GlobalStateAction GlobalState AppM
instance MonadLogger AppM where
  log message = AppM $
    lift (log message)


runAppM :: forall q i o. Component q i o AppM -> Aff (Component q i o Aff)
runAppM component = do
  let store = initialGlobalState
  component
    # H.hoist unwrap
    # runStoreT store reduce
    # map (H.hoist unLogger)

  where
    unLogger :: forall m a. MonadEffect m => LoggerT m a -> m a
    unLogger loggerT = runLoggerT loggerT (logMessage Debug)