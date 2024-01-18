module Game.Message where

import Prelude

import Control.Alt (class Alt, alt, (<|>))
import Control.Monad.Reader (ReaderT, ask, lift)
import Data.Array as A
import Data.Foldable (foldMap, intercalate, sum)
import Data.Int (toNumber)
import Data.Lens (Lens', Traversal', _Just, (.~))
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.First (First)
import Data.Newtype (class Newtype, unwrap)
import Data.Semigroup.Foldable (intercalateMap)
import Data.String as String
import Data.Time (Time(..))
import Data.Time.Duration (Milliseconds(..), Seconds(..))
import Data.Tuple (snd)
import Effect.Aff (Aff, delay, parallel, sequential)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Aff.Compat (EffectFnAff, fromEffectFnAff)
import Effect.Class (liftEffect)
import Effect.Class.Console (log)
import Halogen.HTML (ClassName(..), HTML, PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Query.Input (Input)
import Halogen.Subscription (Emitter, Listener, notify)
import Halogen.Svg.Attributes (Color)
import Halogen.VDom.DOM.Prop (Prop)
import Halogen.VDom.Types (GraftX(..), VDom(..), runGraft, unGraft)
import Type.Proxy (Proxy(..))
import Web.DOM.ParentNode (QuerySelector(..))

foreign import addOnClickEventListenerUnsafe :: forall a. String -> a -> EffectFnAff a

newtype Message a = Message
  { user :: Maybe String
  , html :: Array PlainHTML
  , action :: Aff a
  } 
derive instance Newtype (Message a) _
instance Functor Message where
  map f (Message message) = Message (message { action = map f message.action })
instance Apply Message where
  apply (Message f) (Message x) = Message
    { user: maybe x.user Just f.user 
    , html: f.html <> x.html
    , action: apply f.action x.action
    }
instance Alt Message where
  alt (Message a) (Message b) = Message
    { user: maybe b.user Just a.user -- take first non-Nothing username
    , html: a.html <> b.html
    , action: sequential (parallel a.action <|> parallel b.action)
    }

showPlainHTML :: PlainHTML -> String
showPlainHTML = showVDom <<< unwrap
  where
    showVDom :: VDom (Array (Prop (Input Void))) Void -> String
    showVDom = case _ of
      Text text -> text
      Elem _ _ _ children -> intercalate " " $ map showVDom children
      Keyed _ _ _ children -> intercalate " " $ map (showVDom <<< snd) children
      Widget void -> absurd void
      Grafted graft -> showVDom <<< runGraft $ graft


instance Show (Message a) where
  show (Message {user, html, action}) =
    "Message: " <> show user <> " " <> foldMap showPlainHTML html

button :: forall a. String -> String -> a -> Message a
button id text value = Message
  { user: Nothing
  , html: [ HH.button [ HP.id id ] [ HH.text text ] ]
  , action: fromEffectFnAff $ addOnClickEventListenerUnsafe id value
  }

noUser :: PlainHTML -> Message Unit
noUser html = Message
  { user: Nothing
  , html: [ html ]
  , action: pure unit
  }

textMessage :: String -> String -> Message Unit
textMessage user text = Message
  { user: Just user
  , html: [ HH.text text ]
  , action: pure unit
  }

timeToRead :: forall a. Message a -> Milliseconds
timeToRead (Message message) = Milliseconds 1500.0 <> Milliseconds (toNumber textLength * 65.0)
  where textLength = sum $ map (String.length <<< showPlainHTML) message.html




type ConversationT a = ReaderT (Listener {user :: Maybe String, html :: Array PlainHTML}) Aff a
type Conversation = ConversationT Unit

sendMessageWithDelay :: forall a. Message a -> ConversationT a
sendMessageWithDelay message =
  sendMessage message <* (liftAff $ delay (timeToRead message))

sendMessage :: forall a. Message a -> ConversationT a
sendMessage (Message message) = do
  listener <- ask 
  liftEffect $ notify listener { user: message.user, html: message.html}
  liftAff message.action


guideMessage :: String -> ConversationT Unit
guideMessage = sendMessageWithDelay <<< textMessage "guide"



--do
--  a <- message
--  delay 100
--  b <- askQuesition
--  if b then end else start


-- for easy message markup
-- todo: move these somewhere else
red :: forall r i. String -> HTML r i
red text = HH.span [ HP.class_ (ClassName "red") ] [HH.text text]

green :: forall r i. String -> HTML r i
green text = HH.span [ HP.class_ (ClassName "green") ] [HH.text text]