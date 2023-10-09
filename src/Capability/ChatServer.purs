module Capability.ChatServer where

import Prelude

import Control.Monad.Fork.Class (fork)
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks, lift)
import Control.Monad.Rec.Class (class MonadRec, forever)
import Control.Monad.Rec.Loops (whileM_)
import Control.Monad.State (class MonadState, class MonadTrans, get, gets, lift, modify_, put)
import Data.Array as A
import Data.Either (either)
import Data.Interval (second)
import Data.Lens (use, (.=))
import Data.Lens.Record (prop)
import Data.Lens.Setter ((%=))
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect (Effect)
import Effect.Aff (Aff, delay, finally, forkAff, invincible, message, runAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Halogen (HalogenM)
import Halogen.Subscription (Emitter, Listener, SubscribeIO, makeEmitter)
import Halogen.Subscription as HS
import Store (Message, Store, QueuedMessage)
import Type.Proxy (Proxy(..))


class Monad m <= ChatServer m where
  modifyMessages :: (Array QueuedMessage -> Array QueuedMessage) -> m (Array QueuedMessage)
  chatServerEmitter :: m (Emitter (Message ()))

instance ChatServer m => ChatServer (HalogenM s a sl o m) where
  modifyMessages = modifyMessages >>> lift
  chatServerEmitter = lift chatServerEmitter

sendMessage :: forall m. ChatServer m => Message () -> m Unit
sendMessage { user, text } = void $ modifyMessages (A.cons { user, text, delayBy: Seconds 0.0 })

putQueuedMessages :: forall m. ChatServer m => Array QueuedMessage -> m Unit
putQueuedMessages messages = void $ modifyMessages (\_ -> messages)

clearQueuedMessages :: forall m. ChatServer m => m Unit
clearQueuedMessages = void $ modifyMessages (pure [])

initialiseChatServer :: forall m
  . MonadRec m
  => MonadAff m
  => MonadEffect m
  => Unit -> m
      { queuedMessages :: Ref (Array QueuedMessage)
      , messageEmitter :: Emitter (Message ())
      }
initialiseChatServer _ = do
  { emitter, listener } <- liftAff $ liftEffect HS.create
  ref <- liftEffect $ Ref.new []
  _ <- liftAff $ forkAff (chatServerLoop ref listener)
  pure { queuedMessages: ref, messageEmitter: emitter }

  where
  -- must be Aff!
    chatServerLoop :: Ref (Array QueuedMessage) ->  Listener (Message ()) -> Aff Unit 
    chatServerLoop ref listener = forever do
      queued <- liftEffect $ Ref.read ref
      case A.uncons queued of
        Just { head: { user, text, delayBy }, tail } -> do
          liftEffect $ Ref.write tail ref
          delay (fromDuration delayBy)
          liftEffect $ HS.notify listener { user, text }
        Nothing -> do
          delay (Milliseconds 10000.0)
