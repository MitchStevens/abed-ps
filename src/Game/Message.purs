module Game.Message where

import Prelude

import Data.Int (toNumber)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap)
import Data.String as String
import Data.Time (Time(..))
import Data.Time.Duration (Seconds(..))
import Web.DOM.ParentNode (QuerySelector(..))

{-
  Standard Message: immidiately displayed in the chat window
  queued message: delayed messages
  guiding message: messae with a selector

-}
newtype BaseMessage r = Message
  { user :: String
  , text :: String
  , selector :: Maybe QuerySelector
  , delayBy :: Maybe Seconds
  | r }
type Message = BaseMessage ()
type TimestampedMessage = BaseMessage (time :: Time)

instance Show (BaseMessage r) where
  show (Message {user, text, selector}) =
    "Message: " <> user <> " " <> text <> maybe "" (\q -> " " <> unwrap q) selector

standard :: String -> String -> Message
standard user text = Message { user, text, selector: Nothing, delayBy: Nothing }

guiding :: String -> QuerySelector -> Message
guiding text selector = Message { user: "guide", text, selector: Just selector, delayBy: Nothing }

timeToRead :: String -> Seconds
timeToRead str = Seconds 1.5 <> Seconds (toNumber (String.length str) * 0.065)

addDelay :: Message -> Message
addDelay message@(Message m) = delayBy (timeToRead m.text) message

delayBy :: Seconds -> Message -> Message
delayBy delay (Message m) = Message (m {delayBy = Just delay} )

timestamped :: Time -> Message -> TimestampedMessage
timestamped time (Message {user, text, selector, delayBy}) = Message {user, text, selector, delayBy, time}