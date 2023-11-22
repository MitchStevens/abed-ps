module Game.Message where

import Prelude

import Data.Array as A
import Data.Foldable (foldMap, intercalate)
import Data.Int (toNumber)
import Data.Lens (Lens', Traversal', _Just, (.~))
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Semigroup.Foldable (intercalateMap)
import Data.String as String
import Data.Time (Time(..))
import Data.Time.Duration (Seconds(..))
import Data.Tuple (snd)
import Halogen.HTML (ClassName(..), PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Query.Input (Input)
import Halogen.Svg.Attributes (Color)
import Halogen.VDom.DOM.Prop (Prop)
import Halogen.VDom.Types (GraftX(..), VDom(..), runGraft, unGraft)
import Type.Proxy (Proxy(..))
import Web.DOM.ParentNode (QuerySelector(..))

{-
  Standard Message: immidiately displayed in the chat window
  queued message: delayed messages
  guiding message: messae with a selector

-}

newtype Message = Message
  { user :: String
  , message :: PlainHTML
  , selector :: Maybe QuerySelector
  , delayBy :: Maybe Seconds
   } 
derive instance Newtype Message _

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


instance Show Message where
  show (Message {user, message, selector, delayBy}) =
    "Message: " <> user <> " " <> showPlainHTML message <> maybe "" (\q -> " " <> unwrap q) selector

_message :: Lens' Message PlainHTML
_message = _Newtype <<< prop (Proxy :: Proxy "message")

_selector :: Lens' Message (Maybe QuerySelector)
_selector = _Newtype <<< prop (Proxy :: Proxy "selector")

_delayBy :: Lens' Message (Maybe Seconds)
_delayBy = _Newtype <<< prop (Proxy :: Proxy "delayBy")



message :: String -> String -> Message
message user text = htmlMessage user (HH.text text)

htmlMessage :: String -> PlainHTML -> Message
htmlMessage user message = Message
  { user, message, selector: Nothing, delayBy: Nothing }


timeToRead :: String -> Seconds
timeToRead str = Seconds 1.5 <> Seconds (toNumber (String.length str) * 0.065)

addDelay :: Message -> Message
addDelay (Message m) = Message m # 
  _delayBy .~ Just (timeToRead (showPlainHTML m.message))

fromGuide :: String -> Message
fromGuide = message "guide"


-- for easy message markup
red :: String -> PlainHTML
red text = HH.span [ HP.class_ (ClassName "red") ] [HH.text text]

green :: String -> PlainHTML
green text = HH.span [ HP.class_ (ClassName "green") ] [HH.text text]