module AppM where

import Prelude

import Capability.ChatServer (class ChatServer, initialiseChatServer)
import Capability.GlobalKeyDown (class GlobalKeyDown, globalKeyDownEventEmitter)
import Capability.Navigate (class Navigate)
import Capability.Navigate as Navigate
import Control.Monad.Reader (class MonadAsk, class MonadReader, ReaderT, asks, runReaderT)
import Data.Array as A
import Data.Time.Duration (Milliseconds(..), Seconds(..))
import Effect.Aff (Aff, delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Ref as Ref
import Halogen (Component, HalogenM)
import Halogen.Subscription (SubscribeIO)
import Halogen.Subscription as HS
import Routing.Duplex (print)
import Routing.Hash (setHash)
import Store (Store)


newtype AppM a = AppM (ReaderT Store Aff a)
derive newtype instance Functor AppM
derive newtype instance Apply AppM
derive newtype instance Applicative AppM
derive newtype instance Bind AppM
derive newtype instance Monad AppM
derive newtype instance MonadEffect AppM
derive newtype instance MonadAff AppM
derive newtype instance MonadAsk Store AppM

initialStore :: Aff Store
initialStore = do
  keyDownEmitter <- liftEffect globalKeyDownEventEmitter
  chatServer <- initialiseChatServer
  pure { keyDownEmitter, chatServer }

runAppM :: forall a. Store -> AppM a -> Aff a
runAppM store (AppM a) = do
  runReaderT a store

instance Navigate AppM where
  navigateTo route =
    liftEffect (setHash (print Navigate.routeCodec route))

instance GlobalKeyDown AppM where
  getKeyDownEmitter = asks (_.keyDownEmitter)

instance ChatServer AppM where
  modifyQueuedMessages f = do
    ref <- asks (_.chatServer.queuedMessages)
    liftEffect $ Ref.modify f ref
  chatServerEmitter = asks (_.chatServer.emitter)
  chatServerListener = asks (_.chatServer.listener)


