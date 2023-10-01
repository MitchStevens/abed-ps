module Main (main) where

import Prelude

import Capability.Navigate (class Navigate, Route(..), navigateTo, routeCodec)
import Capability.Navigate as Navigate
import Component.Board as Board
import Component.Chat as Chat
import Component.Piece as Piece
import Component.Puzzle as Puzzle
import Component.Routes as Routes
import Control.Monad.Error.Class (throwError)
import Data.Array.NonEmpty (findLastIndex)
import Data.Either (either, fromRight)
import Data.Foldable (for_)
import Data.HeytingAlgebra (ff, tt)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Data.Time.Duration (Seconds(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_, runAff_)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (error, throw)
import Game.Location (location)
import Game.Location as Direction
import Game.Piece (mkPiece)
import Game.Piece.BasicPiece (andPiece, idPiece, notPiece, orPiece)
import Halogen (Component, HalogenIO)
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.VDom.Driver (runUI)
import IO.Conversations (conversation1, conversation2)
import Partial.Unsafe (unsafeCrashWith)
import Routing.Duplex (parse, print)
import Routing.Hash (matchesWith, setHash)
import Type.Proxy (Proxy(..))
import Web.DOM.ParentNode (QuerySelector(..))
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML (HTMLElement, window)
import Web.HTML.HTMLDocument (toEventTarget)
import Web.HTML.Window (document)
import Web.UIEvent.KeyboardEvent as KeyboardEvent
import Web.UIEvent.KeyboardEvent.EventTypes (keydown)


newtype AppM a = AppM (Aff a)
derive newtype instance Functor AppM
derive newtype instance Apply AppM
derive newtype instance Applicative AppM
derive newtype instance Bind AppM
derive newtype instance Monad AppM
derive newtype instance MonadEffect AppM
derive newtype instance MonadAff AppM

runAppM :: forall a. AppM a -> Aff a
runAppM (AppM a) = a

instance Navigate AppM where
  navigateTo route = do 
    liftEffect (setHash (print Navigate.routeCodec route))

main :: Effect Unit
main = HA.runHalogenAff do
  HA.awaitLoad
  (element :: HTMLElement ) <- HA.selectElement (QuerySelector "#abed") >>=
    maybe (throw ("Could not find element #abed")) pure >>> liftEffect
  let rootComponent = H.hoist runAppM Routes.component
  { dispose, messages, query } <- runUI rootComponent unit element
  liftEffect $ matchesWith (parse routeCodec) \old new ->
    when (old /= Just new)
      (launchAff_ $ void $ query (Routes.Navigate new unit))