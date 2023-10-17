module Capability.ChatServer where

import Prelude

import Capability.Spotlight (spotlight)
import Control.Monad.Fork.Class (fork)
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks, lift)
import Control.Monad.Rec.Class (class MonadRec, forever)
import Control.Monad.State (class MonadState, class MonadTrans, get, gets, lift, modify_, put)
import Data.Array as A
import Data.DateTime.Instant (Instant)
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Data.Interval (second)
import Data.Lens (use, (.=))
import Data.Lens.Record (prop)
import Data.Lens.Setter ((%=))
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Debug (spy, trace)
import Effect.Aff (Aff, delay, finally, forkAff, invincible, message, runAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Game.Message (BaseMessage(..), Message, delayBy)
import Halogen.Subscription (Emitter, Listener, SubscribeIO)
import Halogen.Subscription as HS

type ChatServer = 
  { listener :: Listener Message
  , emitter :: Emitter Message
  , queuedMessages :: Ref (Array Message)
  }

newChatServer
  :: forall m
   . MonadEffect m
   => m ChatServer
newChatServer = do
  { emitter, listener } <- liftEffect HS.create
  queuedMessages <- liftEffect $ Ref.new []
  pure { listener , emitter , queuedMessages }

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

sendMessage
  :: forall m r
   . MonadAsk { chatServer :: ChatServer | r } m 
   => MonadEffect m
   => Message -> m Unit
sendMessage message = do
  listener <- asks (_.chatServer.listener)
  liftEffect $ HS.notify listener message

-- must be Aff!
runChatServer
  :: forall m r
   . MonadAsk { chatServer :: ChatServer | r } m 
  => MonadAff m
  => MonadRec m
  => m Unit
runChatServer = forever do
  ref <- asks (_.chatServer.queuedMessages)
  queued <- liftEffect $ Ref.read ref
  case A.uncons queued of
    Just { head: Message m, tail } -> do
      -- wait for user to write message
      for_ m.delayBy
        \d -> liftAff $ delay (fromDuration d)
      --send the message, remove message from the queue, 
      listener <- asks (_.chatServer.listener)
      liftEffect $ HS.notify listener (Message m)
      liftEffect $ Ref.write tail ref
      traverse_ spotlight m.selector
    Nothing -> do
      liftAff $ delay (Milliseconds 100.0)
