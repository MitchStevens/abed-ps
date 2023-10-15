module Capability.ChatServer where

import Prelude

import Capability.Spotlight (class Spotlight, spotlight)
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
import Effect (Effect)
import Effect.Aff (Aff, delay, finally, forkAff, invincible, message, runAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Game.Message (BaseMessage(..), Message, delayBy)
import Halogen (HalogenM)
import Halogen.Subscription (Emitter, Listener, SubscribeIO, makeEmitter)
import Halogen.Subscription as HS
import Store (ChatServerStore)
import Type.Proxy (Proxy(..))
import Web.DOM.Document (toNonElementParentNode)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toDocument)
import Web.HTML.Window (document)


class Monad m <= ChatServer m where
  modifyQueuedMessages :: (Array Message -> Array Message) -> m (Array Message)
  chatServerListener :: m (Listener Message)
  chatServerEmitter :: m (Emitter Message)

instance ChatServer m => ChatServer (HalogenM st a sl o m) where
  modifyQueuedMessages f = lift (modifyQueuedMessages f)
  chatServerListener = lift chatServerListener
  chatServerEmitter = lift chatServerEmitter


sendMessage :: forall m. MonadEffect m => ChatServer m => Message -> m Unit
sendMessage message = do
  listener <- chatServerListener
  liftEffect $ HS.notify listener message

setQueuedMessages :: forall m. ChatServer m => Array Message -> m Unit
setQueuedMessages queuedMessages = void $ modifyQueuedMessages (\_ -> queuedMessages)

clearQueuedMessages :: forall m. ChatServer m => m Unit
clearQueuedMessages = void $ modifyQueuedMessages (pure [])

initialiseChatServer :: forall m
  .  MonadRec m
  => MonadAff m
  => MonadEffect m
  => Spotlight m
  => m ChatServerStore
initialiseChatServer = do
  { listener, emitter } <- liftAff $ liftEffect HS.create
  ref <- liftEffect $ Ref.new []

  _ <- liftAff $ forkAff (chatServerLoop ref listener)
  
  pure
    { queuedMessages: ref
    , emitter
    , listener }


{-
    queued
-}
-- must be Aff!
chatServerLoop :: Ref (Array Message) ->  Listener Message -> Aff Unit 
chatServerLoop ref listener = forever do
  queued <- liftEffect $ Ref.read ref
  case A.uncons queued of
    Just { head: Message m, tail } -> do
      -- wait for user to write message
      for_ m.delayBy \d -> delay (fromDuration d)
      --send the message, remove message from the queue, 
      liftEffect $ HS.notify listener (Message m)
      liftEffect $ Ref.write tail ref
      traverse_ spotlight m.selector
      log "spotlight the selector"
    Nothing -> do
      delay (Milliseconds 100.0)

