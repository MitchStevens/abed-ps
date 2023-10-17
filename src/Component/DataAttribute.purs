module Component.DataAttribute where

import Prelude

import Capability.Progress (PuzzleProgress(..))
import Data.Maybe (Maybe(..))
import Game.Location (Location(..))
import Game.Piece (PieceId(..))
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

availablePiece :: DataAttribute PieceId
availablePiece = Attr (AttrName "data-available-piece") (\(PieceId id) -> id)

chatUsername :: DataAttribute String
chatUsername = Attr (AttrName "data-username") identity

progress :: DataAttribute PuzzleProgress
progress = Attr (AttrName "data-puzzle-progress") case _ of
  Completed -> "completed"
  Incomplete -> "incomplete"