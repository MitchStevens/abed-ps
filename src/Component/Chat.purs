module Component.Chat where

import Prelude
import Data.Lens

import Capability.ChatServer (chatServerEmitter)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks)
import Control.Monad.Rec.Class (class MonadRec, forever)
import Control.Monad.State (class MonadState, gets, put)
import Data.Array as A
import Data.DateTime (DateTime(..), Time(..), hour, minute, second)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Foldable (intercalate, traverse_)
import Data.Interval (Duration(..))
import Data.Lens.Record (prop)
import Data.Maybe (Maybe(..))
import Data.Monoid (power)
import Data.String (length)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Game.Message (Message(..))
import GlobalState (GlobalState)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS
import Type.Proxy (Proxy(..))
import Web.Event.Event (timeStamp)
import Web.HTML.Event.EventTypes (offline)

maxMessages = 20

type Input = Unit

type State =
  { messages :: Array { timestamp :: Time, message :: Message } }

data Query a

data Action = Initialise | NewMessage Message

data Output

_messages = prop (Proxy :: Proxy "messages")

component :: forall m. MonadAsk GlobalState m => MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { messages: [] } 

  render state =  
    HH.div [ HP.id "chat-component"] $
      [ HH.table_ (map renderMessage state.messages)
      , HH.div [ HP.id "anchor" ] []
      ]
  
  renderMessage {timestamp, message: Message { user, message, selector, delayBy }} =
    HH.tr_
      [ HH.td [ HP.class_ (ClassName "timestamp") ]
        [ HH.text (showTime timestamp) ]
      , HH.td
          [ attr DataAttr.chatUsername user
          , HP.class_ ( ClassName "username" ) ]
          [ HH.div_ [ HH.text user ] ]
      , HH.td [ HP.class_ (ClassName "message") ] [ fromPlainHTML message ]
      ]

  showTime :: Time -> String -- break a leg :D
  showTime time = intercalate ":" [pad2 (hour time), pad2 (minute time), pad2 (second time)]
    where
      pad2 :: forall a. BoundedEnum a => a -> String
      pad2 n = let s = show (fromEnum n) in power "0" (2 - length s) <> s

  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = H.mkEval
    { handleQuery: case _ of
      _ -> pure Nothing
    , handleAction: handleAction
    , initialize: Just Initialise
    , finalize: Nothing
    , receive: \_ -> Nothing
    }
  
  handleAction :: forall slots. Action -> HalogenM State Action slots Output m Unit
  handleAction = case _ of
    Initialise -> do
      emitt <- asks (_.chatServer.emitter)
      void $ H.subscribe (NewMessage <$> emitt)
    NewMessage message@(Message m) -> do
      timestamp <- liftEffect nowTime
      _messages <>= [{ timestamp, message }]