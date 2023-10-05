module AppM where

import AppState
import Prelude

import Capability.GlobalKeyDown (class GlobalKeyDown, globalKeyDownEventEmitter)
import Capability.Navigate (class Navigate)
import Capability.Navigate as Navigate
import Control.Monad.Reader (class MonadAsk, class MonadReader, ReaderT, asks, runReaderT)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen.Subscription (SubscribeIO)
import Halogen.Subscription as HS
import Routing.Duplex (print)
import Routing.Hash (setHash)


newtype AppM a = AppM (ReaderT AppState Aff a)
derive newtype instance Functor AppM
derive newtype instance Apply AppM
derive newtype instance Applicative AppM
derive newtype instance Bind AppM
derive newtype instance Monad AppM
derive newtype instance MonadEffect AppM
derive newtype instance MonadAff AppM
derive newtype instance MonadAsk AppState AppM

runAppM :: forall a. AppM a -> Aff a
runAppM (AppM a) = do
  keyDownEmitter <- liftEffect globalKeyDownEventEmitter
  runReaderT a { keyDownEmitter }

instance Navigate AppM where
  navigateTo route =
    liftEffect (setHash (print Navigate.routeCodec route))

instance GlobalKeyDown AppM where
  getKeyDownEmitter = asks (_.keyDownEmitter)