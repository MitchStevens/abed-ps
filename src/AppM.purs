module AppM where

import Prelude

import Capability.ChatServer (newChatServer, runChatServer)
import Control.Monad.Reader (class MonadAsk, ReaderT, runReaderT)
import Effect.Aff (Aff, delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.GameEvent (GameEvent, GameEventStore)
import Game.GameEvent as GameEvent
import GlobalState (GlobalState)
import Halogen (Component, HalogenM)
import Halogen as H
import Halogen.Store.Monad (class MonadStore, StoreT, runStoreT)

 
newtype AppM a = AppM
  ( ReaderT GlobalState
  ( StoreT GameEvent GameEventStore Aff) a)
derive newtype instance Functor AppM
derive newtype instance Apply AppM
derive newtype instance Applicative AppM
derive newtype instance Bind AppM
derive newtype instance Monad AppM
derive newtype instance MonadEffect AppM
derive newtype instance MonadAff AppM
derive newtype instance MonadAsk GlobalState AppM
derive newtype instance MonadStore GameEvent GameEventStore AppM

initialGlobalState :: Aff GlobalState
initialGlobalState = do
  chatServer <- liftEffect newChatServer
  runChatServer chatServer
  pure { chatServer }

runAppM :: forall q i o. Component q i o AppM -> Aff (Component q i o Aff)
runAppM component = do
  store <- initialGlobalState
  let storeComponent = H.hoist (\(AppM appM) -> runReaderT appM store) component
  runStoreT GameEvent.empty (flip GameEvent.cons) storeComponent