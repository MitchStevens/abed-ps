module Guide.Element where

import Prelude

import Component.DataAttribute as DA
import Control.Monad.Maybe.Trans (runMaybeT)
import Data.Either (Either)
import Data.Machine.Mealy (MealyT, Source, Step(..), mealy, runMealyT, source)
import Data.Maybe (Maybe(..), fromMaybe', maybe, maybe')
import Data.Nullable (Nullable, toMaybe)
import Data.Traversable (traverse)
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throw)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (Piece(..), PieceId(..), idPiece, name)
import Type.Proxy (Proxy(..))
import Web.DOM (Element, ParentNode)
import Web.DOM.Element (getAttribute, toParentNode)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.HTMLDocument as HTMLDocument
import Web.HTML.Window (document)

foreign import puzzle  :: Effect Element
foreign import board   :: Effect Element
foreign import sidebar :: Effect Element

foreign import boardPort :: String -> Effect (Nullable Element)

--boardPortElement :: CardinalDirection -> Effect (Nullable Element)
--boardPortElement dir = boardPortElementString (DA.print DA.direction dir)


--foreign import diagramElement :: Effect (Nullable Element)
--foreign import diagramPortElementString :: String -> Effect (Nullable Element)
--
--diagramPortElement :: CardinalDirection -> Effect (Nullable Element)
--diagramPortElement dir = diagramPortElementString (DA.print DA.direction dir)

getElement :: QuerySelector -> Effect Element
getElement selector = liftEffect do
  htmlDocument <- window >>= document 
  querySelector selector (HTMLDocument.toParentNode htmlDocument) >>= maybe' (\_ -> throw ("element not found")) pure


--foreign import locationAtElement :: Location -> Effect (Nullable Element)
--
--foreign import availablePieceElement :: PieceId -> Effect  (Nullable Element)


--foreign import elementAt :: Location -> Effect (Nullable Element)
foreign import pieceAt :: Location -> Effect (Nullable Element)

foreign import rotationAt :: Location -> Effect (Nullable Int)