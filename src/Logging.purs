module Logging where

import Prelude

import Data.Log.Filter (minimumLevel)
import Data.Log.Formatter.Pretty (prettyFormatter)
import Data.Log.Level (LogLevel)
import Data.Log.Message as Log
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log)

logMessage :: forall m. MonadEffect m => LogLevel -> Log.Message -> m Unit
logMessage logLevel = minimumLevel logLevel $ prettyFormatter >=> log

