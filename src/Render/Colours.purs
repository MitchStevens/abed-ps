module Render.Colours where

import Prelude

import Halogen.Svg.Attributes (Color(..))

portColours = 
  { teal:  RGB 117 242 191
  , blue:   RGB 120 204 250
  , purple: RGB 208 135 221
  , pink:   RGB 228 100 156
  }

green :: Color
green = RGB 138 248 91

red :: Color
red = RGB 248 91 91

-- | The "lit" tint scripts/generate-port-colours.mjs bakes into the port
-- | colour mask PNGs (see Render.PortColours) -- pulled out as a real
-- | `Color` here so live SVG (Component.TestCard's diagram) can paint the
-- | same signal-on colour instead of introducing a second blue.
portOn :: Color
portOn = RGB 82 122 145

-- | The corresponding "not lit" tint -- a faint parchment shade rather than
-- | fully transparent, so a resolved-but-zero port still reads as a real,
-- | drawn wedge and not empty space.
portOff :: Color
portOff = RGB 233 227 210

-- | The two ends of a test card's output-wedge verdict flicker (see
-- | Component.TestCard) -- deliberately starker than `red`/`green` above,
-- | since that contrast is the whole point of the animation: dark for a
-- | wrong reading, pale gold for a right one.
testCardBad :: Color
testCardBad = RGB 44 18 16

testCardGood :: Color
testCardGood = RGB 242 230 189
