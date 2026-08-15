module Component.Rendering.Icon where

import Prelude

import Component.Rendering.Background (eggshellBackground, wirePieceFrameStroke)
import Component.Rendering.PieceShape (IconConfig(..))
import Data.Map (Map)
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Piece (PieceId(..))
import Game.PortInfo (PortInfo)
import Halogen.HTML (HTML)
import Halogen.Svg.Attributes (Color(..), CommandArcChoice(..), CommandPositionReference(..), CommandSweepChoice(..), Transform(..), a, l, m, q)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

-- | Draw whatever icon a piece's config specifies (none, an image, or a
-- | custom vector glyph) on top of its outline. Generic in `i`: no icon here
-- | raises an action today, so it isn't typed as if one did. Every image or
-- | vector icon gets the same badge behind it, so gates read as one family
-- | regardless of how many legs feed them or whether their glyph is drawn or
-- | a raster image.
renderIcon :: forall w i. IconConfig w i -> Map CardinalDirection PortInfo -> HTML w i
renderIcon config portStates = case config of
  NoIcon -> SE.g [] []
  ImageIcon pieceId -> SE.g [] [ iconBadge, renderImageIcon pieceId ]
  VectorIcon render -> SE.g [] [ iconBadge, render portStates ]

renderImageIcon :: forall w i. PieceId -> HTML w i
renderImageIcon (PieceId id) =
  SE.g
    [ SA.transform [ Translate 30.0 30.0 ] ]
    [ SE.svg [ SA.width 50.0, SA.height 50.0 ]
        [ SE.image
            [ SA.href ("./static/images/" <> id <> ".png")
            , SA.width 40.0
            , SA.height 40.0
            ]
        ]
    ]

-- | The shared bounding box every gate glyph draws inside. A single source
-- | of truth: resize a gate by changing these four numbers, not by eyeballing
-- | a new box per icon -- that's what caused the inconsistency last time.
iconLeft :: Number
iconLeft = 38.0

iconRight :: Number
iconRight = 64.0

iconTop :: Number
iconTop = 35.0

iconBottom :: Number
iconBottom = 65.0

iconCenterX :: Number
iconCenterX = (iconLeft + iconRight) / 2.0

iconCenterY :: Number
iconCenterY = (iconTop + iconBottom) / 2.0

-- | Fill/stroke shared by every logic-gate glyph -- background-coloured fill
-- | so the glyph reads as a cutout against the piece's own background, not a
-- | solid blob, with a slightly darker-than-pure-black stroke to match the
-- | wire outlines' weight.
gateGlyphStroke :: Color
gateGlyphStroke = RGB 20 20 24

-- | The circular badge drawn behind every vector icon: same size and
-- | position for all of them, so NOT/AND/OR/XOR read as one consistent
-- | family no matter how differently shaped or how many legs feed them. It
-- | also masks whatever the outline's curves are doing directly behind it.
iconBadgeRadius :: Number
iconBadgeRadius = 26.0

iconBadge :: forall w i. HTML w i
iconBadge =
  SE.circle
    [ SA.cx iconCenterX
    , SA.cy iconCenterY
    , SA.r iconBadgeRadius
    , SA.fill eggshellBackground
    , SA.stroke wirePieceFrameStroke
    , SA.strokeWidth 1.0
    ]

-- | The classic inverter glyph: a triangle feeding into a small bubble.
notGateIcon :: forall w i. HTML w i
notGateIcon =
  SE.g []
    [ SE.polygon
        [ SA.points [ Tuple iconLeft iconTop, Tuple iconLeft iconBottom, Tuple iconRight iconCenterY ]
        , SA.fill eggshellBackground
        , SA.stroke gateGlyphStroke
        , SA.strokeWidth 1.0
        ]
    , SE.circle
        [ SA.cx (iconRight + 6.0)
        , SA.cy iconCenterY
        , SA.r 6.0
        , SA.fill eggshellBackground
        , SA.stroke gateGlyphStroke
        , SA.strokeWidth 1.0
        ]
    ]

-- | The classic AND gate glyph: a flat back and a semicircular front.
andGateIcon :: forall w i. HTML w i
andGateIcon =
  SE.path
    [ SA.fill eggshellBackground
    , SA.stroke gateGlyphStroke
    , SA.strokeWidth 1.0
    , SA.d
        [ m Abs iconLeft iconTop
        , l Abs iconLeft iconBottom
        , a Abs radius radius 0.0 Arc0 Sweep1 iconLeft iconTop
        ]
    ]
  where
  radius = (iconBottom - iconTop) / 2.0

-- | The classic OR gate glyph: a concave back curving into a pointed front.
orGateIcon :: forall w i. HTML w i
orGateIcon =
  SE.path
    [ SA.fill eggshellBackground
    , SA.stroke gateGlyphStroke
    , SA.strokeWidth 1.0
    , SA.d
        [ m Abs iconLeft iconTop
        , q Abs (iconRight - 6.0) iconTop (iconRight - 2.0) iconCenterY
        , q Abs (iconRight - 6.0) iconBottom iconLeft iconBottom
        , q Abs (iconLeft + 6.0) iconCenterY iconLeft iconTop
        ]
    ]

-- | The classic XOR gate glyph: an OR body plus the extra detached curved
-- | line in front of its back that distinguishes XOR from OR. Both still fit
-- | inside the shared icon box, just sharing it between two elements.
xorGateIcon :: forall w i. HTML w i
xorGateIcon =
  SE.g []
    [ SE.path
        [ SA.fill eggshellBackground
        , SA.stroke gateGlyphStroke
        , SA.strokeWidth 1.0
        , SA.d
            [ m Abs bodyLeft iconTop
            , q Abs (iconRight - 2.0) iconTop iconRight iconCenterY
            , q Abs (iconRight - 2.0) iconBottom bodyLeft iconBottom
            , q Abs (bodyLeft + 6.0) iconCenterY bodyLeft iconTop
            ]
        ]
    , SE.path
        [ SA.fill (Named "none")
        , SA.stroke gateGlyphStroke
        , SA.strokeWidth 1.0
        , SA.d
            [ m Abs iconLeft iconTop
            , q Abs (iconLeft + 6.0) iconCenterY iconLeft iconBottom
            ]
        ]
    ]
  where
  bodyLeft = iconLeft + 4.0
