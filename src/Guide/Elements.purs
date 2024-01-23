module Guide.Elements where

import Prelude

import Component.DataAttribute as DA
import Data.Nullable (Nullable)
import Effect (Effect)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (PieceId(..))
import Web.DOM (Element, ParentNode)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.HTMLElement (toParentNode)
import Web.HTML.Window (document)

foreign import puzzleElement  :: Effect Element
foreign import boardElement   :: Effect Element
foreign import sidebarElement :: Effect Element

foreign import boardPortElementString :: String -> Effect (Nullable Element)

boardPortElement :: CardinalDirection -> Effect (Nullable Element)
boardPortElement dir = boardPortElementString (DA.print DA.direction dir)


foreign import diagramElement :: Effect (Nullable Element)
foreign import diagramPortElementString :: String -> Effect (Nullable Element)

diagramPortElement :: CardinalDirection -> Effect (Nullable Element)
diagramPortElement dir = diagramPortElementString (DA.print DA.direction dir)


foreign import locationAtElement :: Location -> Effect (Nullable Element)