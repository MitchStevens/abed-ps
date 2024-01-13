module Component.Chat where

import Data.Lens
import Prelude

import Capability.ChatServer (chatServerEmitter)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks, lift)
import Control.Monad.Rec.Class (class MonadRec, forever)
import Control.Monad.State (class MonadState, gets, modify, modify_, put)
import Data.Array as A
import Data.DateTime (DateTime(..), Time(..), hour, minute, second)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Foldable (for_, intercalate, traverse_)
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
import Halogen (ClassName(..), HalogenM, HalogenQ, RefLabel(..), defaultEval, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS
import Type.Proxy (Proxy(..))
import Web.DOM.Element (scrollHeight, scrollTop, setScrollTop, toNode)
import Web.DOM.MutationObserver (mutationObserver, observe)
import Web.DOM.MutationRecord (MutationRecord)
import Web.Event.Event (Event, timeStamp)
import Web.HTML.Event.EventTypes (offline)
import Web.HTML.HTMLElement (toElement)

maxMessages = 20

type Input = Unit

type State =
  { messages :: Array { timestamp :: Time, message :: Message }
  , scrollToBottom :: Boolean }

data Query a

data Action
  = Initialise
  | NewMessage Message
  | OnScroll Event

data Output

_messages = prop (Proxy :: Proxy "messages")

component :: forall m. MonadAsk GlobalState m => MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { messages: [], scrollToBottom: true } 

  render state =  
    HH.div
      [ HP.id "chat-component"
      , HP.ref (RefLabel "chat-component")
      , HE.onScroll OnScroll
      ]
      [ HH.table_ (map renderMessage state.messages) ]
  
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
  showTime time = toLocaleString (fromEnum (hour time)) (fromEnum (minute time)) (fromEnum (second time))
  
  --intercalate ":" [pad2 (hour time), pad2 (minute time), pad2 (second time)]
  --  where
  --    pad2 :: forall a. BoundedEnum a => a -> String
  --    pad2 n = let s = show (fromEnum n) in power "0" (2 - length s) <> s

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
      messageEmitter <- asks (_.chatServer.emitter)
      void $ H.subscribe (NewMessage <$> messageEmitter)

      H.getHTMLElementRef (RefLabel "chat-component") >>= traverse_ \element -> do
        liftEffect $ setScrollTop 0.1 (toElement element)

      --{ emitter, listener } <- lift HS.create
      --observer <- lift $ mutationObserver \records _ -> for_ records (HS.notify listener)
      --H.getHTMLElementRef (RefLabel "chat-component") >>= traverse_ \element -> do
      --  observe (toNode element) {} observer
      --void $ H.subscribe (ComponentMutated <$> emitter)

    NewMessage message@(Message m) -> do
      scrollToBottom <- gets (_.scrollToBottom)
      timestamp <- liftEffect nowTime
      _messages <>= [{ timestamp, message }]
     -- when scrollToBottom $
      H.getRef (RefLabel "chat-component") >>= traverse_ \element -> do
        height <- liftEffect $ scrollHeight element
        liftEffect $ setScrollTop height element

    OnScroll _ -> do
      H.getHTMLElementRef (RefLabel "chat-component") >>= traverse_ \element -> do
        height <- liftEffect $ scrollHeight (toElement element)
        top <- liftEffect $ scrollTop (toElement element)
        modify_ (_ { scrollToBottom = height == top} )
        when (height == top) (log "we are at the bottom!!")

foreign import toLocaleString :: Int -> Int -> Int -> String


