module Capability.ChatServer where

import Prelude

import Capability.Spotlight (spotlight)
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks, lift)
import Control.Monad.Rec.Class (class MonadRec, forever)
import Control.Monad.State (class MonadState, class MonadTrans, get, gets, lift, modify_, put)
import Data.Array as A
import Data.Foldable (for_, traverse_)
import Data.Lens (use, (.=))
import Data.Lens.Setter ((%=))
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect (Effect)
import Effect.Aff (Aff, delay, finally, forkAff, invincible, message, runAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (debug, log)
import Effect.Exception (throw)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Game.Message (Message(..))
import Halogen.HTML (PlainHTML)
import Halogen.Subscription (Emitter, Listener, SubscribeIO)
import Halogen.Subscription as HS

type ChatServer = 
  { listener :: Listener Message
  , emitter :: Emitter Message
  , queuedMessages :: Ref (Array Message)
  , isRunning :: Ref Boolean
  }

newChatServer :: Effect ChatServer
newChatServer = do
  { emitter, listener } <- liftEffect HS.create
  queuedMessages <- liftEffect $ Ref.new []
  isRunning <- liftEffect $ Ref.new false
  pure { listener , emitter , queuedMessages, isRunning }

chatServerEmitter
  :: forall m r
   . MonadAsk { chatServer :: ChatServer | r } m 
   => m (Emitter Message)
chatServerEmitter = asks (_.chatServer.emitter)

putQueuedMessages
  :: forall m r
   . MonadAsk { chatServer :: ChatServer | r } m 
   => MonadEffect m
   => Array Message -> m Unit
putQueuedMessages queuedMessages = do
  ref <- asks (_.chatServer.queuedMessages)
  liftEffect $ Ref.write queuedMessages ref

sendMessage :: forall m r . MonadAsk { chatServer :: ChatServer | r } m => MonadEffect m
  => Message -> m Unit
sendMessage message = do
  isRunningRef <- asks (_.chatServer.isRunning)
  isRunning <- liftEffect $ Ref.read isRunningRef
  if isRunning
    then do
      listener <- asks (_.chatServer.listener)
      liftEffect $ HS.notify listener message
    else do
      liftEffect $ log "server is not running!"
      liftEffect $ throw "SERVER NOT RUNNING, CRASH THE PLANE NO SURVIVOR"

-- must be Aff!
runChatServer :: ChatServer -> Aff Unit
runChatServer chatServer = do
  liftEffect $ Ref.write true chatServer.isRunning
  void $ forkAff do
    _ <- forever do
      let ref = chatServer.queuedMessages
      queued <- liftEffect $ Ref.read ref
      case A.uncons queued of
        Just { head: Message m, tail } -> do
          -- wait for user to write message
          for_ m.delayBy
            \d -> liftAff $ delay (fromDuration d)
          --send the message, remove message from the queue, 
          liftEffect $ HS.notify chatServer.listener (Message m)
          traverse_ spotlight m.selector
          liftEffect $ Ref.write tail ref
        Nothing -> do
          liftAff $ delay (Milliseconds 100.0)
    -- should never get to this point
    liftEffect $ Ref.write false chatServer.isRunning



