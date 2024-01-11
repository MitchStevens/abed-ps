module Component.DataAttribute where

import Prelude

import Capability.Progress (LevelProgress(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.String (toLower)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..))
import Game.Piece (Piece(..), PieceId(..))
import Halogen.HTML (IProp)
import Halogen.HTML as HP
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

nullSelector :: QuerySelector
nullSelector = QuerySelector "*:not(*)"

data DataAttribute a = Attr AttrName (a -> String)

selector :: forall a. DataAttribute a -> a -> QuerySelector
selector (Attr (AttrName attr) toStr) a =
  QuerySelector ("["<> attr <>"='" <> toStr a <> "']")

attr :: forall a p i. DataAttribute a -> a -> IProp p i
attr (Attr attrName toStr) a = HP.attr attrName (toStr a)


-- attributes
location :: DataAttribute Location
location = Attr (AttrName "data-location") show

availablePiece :: DataAttribute Piece
availablePiece = Attr (AttrName "data-available-piece") (\(Piece p) -> unwrap p.name)

chatUsername :: DataAttribute String
chatUsername = Attr (AttrName "data-username") identity

progress :: DataAttribute LevelProgress
progress = Attr (AttrName "data-puzzle-progress") case _ of
  Completed -> "completed"
  Incomplete -> "incomplete"

direction :: DataAttribute CardinalDirection
direction = Attr (AttrName "data-direction") (show >>> toLower)

connected :: DataAttribute Boolean
connected = Attr (AttrName "data-connected") $
  if _
    then "connected"
    else "not-connected"
  
isDragging :: DataAttribute Boolean
isDragging = Attr (AttrName "data-is-dragging") show

