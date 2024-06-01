module Component.Chat where

import Data.Lens
import Prelude

import Component.DataAttribute (attr)
import Component.DataAttribute as DA
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks, lift, runReaderT)
import Control.Monad.Rec.Class (class MonadRec, forever)
import Control.Monad.State (class MonadState, gets, modify, modify_, put)
import Data.Array as A
import Data.DateTime (DateTime(..), Time(..), hour, minute, second)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Foldable (for_, intercalate, traverse_)
import Data.Interval (Duration(..))
import Data.Lens.Record (prop)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Monoid (power)
import Data.String (length)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff (forkAff)
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Game.Message (Message(..), Conversation)
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

type Input =
  { conversation :: Conversation }

type State =
  { conversation :: Conversation
  , messages :: Array { timestamp :: Time, user :: String, html :: PlainHTML }
  , scrollToBottom :: Boolean
  }

data Query a

data Action
  = Initialise
  | NewMessage { user :: Maybe String, html :: Array PlainHTML }
  | OnScroll Event

data Output

_messages = prop (Proxy :: Proxy "messages")

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState { conversation } = { conversation, messages: [], scrollToBottom: true } 

  render state =  
    HH.div
      [ HP.id "chat-component"
      , HP.ref (RefLabel "chat-component")
      , HE.onScroll OnScroll
      ]
      [ HH.table_ (map renderMessage state.messages) ]
  
  renderMessage { timestamp, user, html } =
    HH.tr_
      [ HH.td [ HP.class_ (ClassName "timestamp") ]
        [ HH.text (showTime timestamp) ]
      , HH.td
          [ attr DA.chatUsername user
          , HP.class_ ( ClassName "username" ) ]
          [ HH.div_ [ HH.text user ] ]
      , HH.td [ HP.class_ (ClassName "message") ] [ fromPlainHTML html ]
      ]

  showTime :: Time -> String -- break a leg :D
  showTime time = toLocaleString (fromEnum (hour time)) (fromEnum (minute time)) (fromEnum (second time))
  

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
      {listener, emitter} <- liftEffect HS.create
      _ <- H.subscribe (NewMessage <$> emitter)
      conversation <- gets (_.conversation)
      _ <- liftAff $ forkAff $
        runReaderT conversation listener
      pure unit
    NewMessage { user, html } -> do
      --scrollToBottom <- gets (_.scrollToBottom)
      timestamp <- liftEffect nowTime
      _messages <>= [{ timestamp, user: fromMaybe "********" user, html: HH.div_ html}]
     -- when scrollToBottom $
      H.getRef (RefLabel "chat-component") >>= traverse_ \element -> do
        height <- liftEffect $ scrollHeight element
        liftEffect $ setScrollTop height element

    OnScroll _ -> do
      H.getHTMLElementRef (RefLabel "chat-component") >>= traverse_ \element -> do
        height <- liftEffect $ scrollHeight (toElement element)
        top <- liftEffect $ scrollTop (toElement element)
        modify_ (_ { scrollToBottom = height == top} )

foreign import toLocaleString :: Int -> Int -> Int -> String


