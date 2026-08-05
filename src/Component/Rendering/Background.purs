module Component.Rendering.Background where

import Prelude

import Component.Rendering.PieceShape (BackgroundConfig)
import Data.Foldable (foldMap)
import Halogen.HTML (HTML)
import Halogen.Svg.Attributes (Color(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

-- | Shared parchment fill behind wire-family pieces and gates alike.
eggshellBackground :: Color
eggshellBackground = RGB 249 246 238

-- | Lightened toward eggshellBackground, and thinned, so the squircle reads
-- | as a soft boundary rather than a drawn line.
wirePieceFrameStroke :: Color
wirePieceFrameStroke = RGB 220 217 210

frameInset :: Number
frameInset = 5.0

frameCornerRadius :: Number
frameCornerRadius = 9.0

-- | The rounded-rect border shared by every framed piece.
wirePieceFrame :: forall w i. HTML w i
wirePieceFrame =
  SE.rect
    [ SA.x frameInset
    , SA.y frameInset
    , SA.width (100.0 - 2.0 * frameInset)
    , SA.height (100.0 - 2.0 * frameInset)
    , SA.rx frameCornerRadius
    , SA.ry frameCornerRadius
    , SA.fill (Named "none")
    , SA.stroke wirePieceFrameStroke
    , SA.strokeWidth 0.4
    ]

-- | Paint whatever a piece's config says to paint behind its outline: a flat
-- | fill rect covering the full 100x100 viewBox (if any), then the shared
-- | frame on top of it (if wanted).
renderBackground :: forall w i. BackgroundConfig -> HTML w i
renderBackground { fill, frame } =
  SE.g []
    ( (fill # foldMap \color -> [ SE.rect [ SA.x 0.0, SA.y 0.0, SA.width 100.0, SA.height 100.0, SA.fill color ] ])
        <> (if frame then [ wirePieceFrame ] else [])
    )
