module IO.Conversations where

import Prelude

import Component.Chat (Message)
import Data.Time.Duration (Seconds(..))

foreign import conversation1 :: Array (Message (delayBy :: Seconds))