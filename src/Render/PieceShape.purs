module Render.PieceShape where

import Prelude

import Data.Map (Map)
import Data.Maybe (Maybe)
import Game.Direction (CardinalDirection)
import Game.Piece (PieceId)
import Game.Port (PortType)
import Game.PortInfo (PortInfo)
import Halogen.HTML (HTML)
import Halogen.Svg.Attributes (Color)

-- | One leg of a trace: which direction it points, and its role there.
type Leg =
  { direction :: CardinalDirection
  , portType :: PortType
  }

-- | How a trace bends where two legs meet. More cases (e.g. a merge/fork
-- | style for fusePiece/severPiece) will be added once those are designed.
data JunctionType
  = Sharp
  | Curved

-- | A closed cycle of legs. `End` closes back to the first Leg of whichever
-- | Trace it terminates -- there's no leg to store there, it's already known.
data Trace
  = End
  | Link Leg (Maybe JunctionType) Trace

-- | A piece's connective shape: one entry per independent trace on the piece.
-- | idPiece has one; crossPiece has two (Left-Right and Up-Down, unconnected
-- | to each other).
type OutlineConfig =
  { shape :: Array Trace
  }

-- | What to paint behind the outline: a flat fill (or none) and whether to
-- | draw the shared rounded-rect border on top of it.
type BackgroundConfig =
  { fill :: Maybe Color
  , frame :: Boolean
  }

-- | The piece-specific glyph drawn on top of the outline. Fully generic in
-- | both `w` (slot type) and `i` (action type) -- nothing here raises an
-- | action today, and staying polymorphic in `i` is what keeps that true:
-- | a handler that raised a real action would force this to a concrete type.
data IconConfig w i
  = NoIcon
  | ImageIcon PieceId
  | VectorIcon (Map CardinalDirection PortInfo -> HTML w i)

-- | Everything needed to render one piece: how to paint the background,
-- | trace the outline, and draw the icon on top.
type PieceRenderConfig w i =
  { background :: BackgroundConfig
  , outline :: OutlineConfig
  , icon :: IconConfig w i
  }
