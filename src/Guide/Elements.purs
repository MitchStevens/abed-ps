module Guide.Elements where

import Prelude

import Data.Nullable (Nullable)
import Effect (Effect)
import Game.Location (Location(..))
import Game.Piece (PieceId(..))
import Web.DOM (Element, ParentNode)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.HTMLElement (toParentNode)
import Web.HTML.Window (document)

parentNode :: Effect ParentNode
parentNode = window >>= document <#> toParentNode

puzzleElement :: Effect (Maybe Element)
puzzleElement = parentNode >>= querySelector (QuerySelector "#puzzle-component")

boardElement :: Effect (Maybe Element)
boardElement = parentNode >>= querySelector (QuerySelector "#puzzle-component")


sidebarElement :: Effect (Maybe Element)
sidebarElement = parentNode >>= querySelector (QuerySelector "#puzzle-component")

completionStatus :: Effect Element

boardPortLeft :: Effect Element
boardPortRight :: Effect Element

diagram :: Effect Element
diagramPortLeft :: Effect Element
diagramPortRight :: Effect Element


locationAt :: Location -> Effect Element
pieceAt :: Location -> Effect (Nullable PieceId)
rotationAt :: Location -> Effect (Nullable Int)

availablePiece :: PieceId -> Effect (Nullable Element)