module Guide.DOMElements where

import Prelude

import Component.DataAttribute as DA
import Control.Monad.Error.Class (throwError)
import Control.Monad.Maybe.Trans (runMaybeT)
import Control.Monad.Reader (ReaderT)
import Data.Either (Either)
import Data.Maybe (Maybe(..), fromMaybe', maybe, maybe')
import Data.Nullable (Nullable, toMaybe)
import Data.Traversable (traverse)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throw)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (Piece(..), PieceId(..), idPiece, name)
import Guide.DOMNavigation (getElementByClassName, getElementByClassNameMaybe, getElementByDataAttribute, getElementById, selectionNotFound)
import Type.Proxy (Proxy(..))
import Web.DOM (Element, ParentNode)
import Web.DOM.Element (getAttribute, toParentNode)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.Common (ClassName(..))
import Web.HTML.HTMLDocument as HTMLDocument
import Web.HTML.HTMLElement as HTMLElement
import Web.HTML.Window (document)

bodyElement :: Aff Element
bodyElement = do
  liftEffect (window >>= document >>= HTMLDocument.body) >>=
    maybe' (\_ -> selectionNotFound (QuerySelector "body")) (pure <<< HTMLElement.toElement)

puzzle :: Aff Element
puzzle = bodyElement >>= getElementById "puzzle-component"

board :: Aff Element
board = bodyElement >>= getElementById "board-component"

sidebar :: Aff Element
sidebar = bodyElement >>= getElementById "sidebar-component"

boardPortDiagram :: Aff Element
boardPortDiagram = sidebar >>= getElementByClassName (ClassName "board-port-diagram")

boardPortDiagramPort :: CardinalDirection -> Aff Element
boardPortDiagramPort dir = boardPortDiagram >>= getElementByDataAttribute DA.direction dir

availablePiece :: PieceId -> Aff Element
availablePiece pieceId = sidebar
  >>= getElementByClassName (ClassName "available-pieces") 
  >>= getElementByDataAttribute DA.availablePiece pieceId

location :: Location -> Aff Element
location loc = board
  >>= getElementByDataAttribute DA.location loc

pieceAt :: Location -> Aff (Maybe Element)
pieceAt loc = location loc
  >>= getElementByClassNameMaybe (ClassName "piece-component")

completionStatus :: Aff Element
completionStatus = sidebar
  >>= getElementByClassName (ClassName "completion-status")

readyForTestingButton :: Aff (Maybe Element)
readyForTestingButton = completionStatus
  >>= getElementByClassNameMaybe (ClassName "ready-for-testing")
