module Store where

import Prelude

import Data.Time.Duration (Seconds(..))
import Effect.Ref (Ref)
import Halogen.Subscription (Emitter, SubscribeIO)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

type Message r = { user :: String, text :: String | r }
type QueuedMessage = Message (delayBy :: Seconds)

type Store =
  { keyDownEmitter :: Emitter KeyboardEvent
  , chatServer ::
    { queuedMessages :: Ref (Array QueuedMessage)
    , messageEmitter :: Emitter (Message ())
    }
  }