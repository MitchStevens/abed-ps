module Logging where

import Prelude

import Control.Monad.Logger.Class (class MonadLogger, debug)
import Data.Log.Filter (minimumLevel)
import Data.Log.Formatter.Pretty (prettyFormatter)
import Data.Log.Level (LogLevel)
import Data.Log.Message as Log
import Data.Log.Tag (TagSet, tag)
import Effect (Effect)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log)
import Game.GameEvent (GameEvent)

logMessage :: forall m. MonadEffect m => LogLevel -> Log.Message -> m Unit
logMessage logLevel = minimumLevel logLevel $ prettyFormatter >=> log

logGameEvent :: forall m. MonadLogger m => GameEvent -> m Unit
logGameEvent gameEvent = debug (tag "game-event" "") "GAME EVENT"
