module Component.Chat where

import Prelude

import Control.Monad.Rec.Class (class MonadRec, forever)
import Control.Monad.State (class MonadState, gets, put)
import Data.Array as A
import Data.DateTime (DateTime(..), Time(..), hour, minute, second)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Foldable (intercalate)
import Data.Interval (Duration(..))
import Data.Maybe (Maybe(..))
import Data.Monoid (power)
import Data.String (length)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS
import Web.Event.Event (timeStamp)
import Web.HTML.Event.EventTypes (offline)

maxMessages = 20

type Message r = { user :: String, text :: String | r }

type Input = Unit

type State =
  { messages :: Array (Message (time :: Time))
  , queuedMessages :: Array (Message (delayBy :: Seconds))
  }

data Query a
  = InterruptingMessage (Message ())
  | QueuedMessages (Array (Message (delayBy :: Seconds)))
  | ClearMessages

data Action = Initialise | NewMessage (Message ())

data Output

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { messages: [], queuedMessages: [] } 

  render state =  HH.table [ HP.class_ (ClassName "chat-component") ] $
    map renderMessage state.messages
  
  renderMessage { user, text, time } =
    HH.tr_
      [ HH.td [ HP.class_ (ClassName "timestamp") ]
        [ HH.text $ intercalate ":" [pad2 (hour time), pad2 (minute time), pad2 (second time)] ]
      , HH.td [ HP.classes [ ClassName "username", ClassName ("user-" <> user)] ] [ HH.text user ]
      , HH.td [ HP.class_ (ClassName "message") ] [ HH.text text ]
      ]

  pad2 :: forall a. BoundedEnum a => a -> String
  pad2 n = let s = show (fromEnum n) in power "0" (2 - length s) <> s

  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = H.mkEval
    { handleQuery: case _ of
        InterruptingMessage message -> do
          handleAction (NewMessage message)
          pure Nothing
        QueuedMessages queued -> do
          modify_ \s -> s { queuedMessages = s.queuedMessages <> queued }
          pure Nothing
        ClearMessages -> put (initialState unit) $> Nothing
    , handleAction: handleAction
    , initialize: Just Initialise
    , finalize: Nothing
    , receive: \_ -> Nothing
    }
  
  handleAction :: forall slots. Action -> HalogenM State Action slots Output m Unit
  handleAction = case _ of
    Initialise -> do
      _ <- H.subscribe =<< messageServer
      pure unit
    NewMessage { user, text } -> do
      time <- liftEffect nowTime
      modify_ \s -> s { messages = s.messages <> [{user, text, time }] }

  -- check for quened messages
  -- if there is a message
    -- then wait the duration and send the message
    -- else sleep
  messageServer :: forall slots. HalogenM State Action slots Output m (Emitter Action)
  messageServer = do
    { emitter, listener } <- liftEffect HS.create
    _ <- H.fork $ forever do
      queued <- gets (_.queuedMessages)
      case A.uncons queued of
        Just { head: { user, text, delayBy }, tail } -> do
          modify_ \s -> s { queuedMessages = tail }
          H.liftAff $ Aff.delay (fromDuration delayBy)
          H.liftAff $ H.liftEffect $ HS.notify listener (NewMessage { user, text })
        Nothing -> H.liftAff $ Aff.delay (Milliseconds 200.0)
    pure emitter