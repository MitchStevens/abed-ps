module Component.Rendering.Gradient where

import Prelude

import Component.Rendering.Colours (portColours)
import Data.Foldable (intercalate)
import Game.Capacity (Capacity(..), toInt)
import Game.Piece as Port
import Game.Port (Port(..), isInput, portCapacity, portType)
import Game.Port as Port
import Game.PortInfo (PortInfo)
import Game.Signal (Signal(..))
import Halogen.HTML (HTML, PlainHTML)
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

createPortGradient :: PortInfo -> { id :: String, def :: PlainHTML }
createPortGradient { port, connected, signal } = { id, def }
  where
    def = SE.linearGradient
      [ SA.id id
      , SA.gradientTransform [ Rotate 90.0 0.0 0.0 ] ]
      $ case portType port of
        Port.Input -> 
          [ SE.stop [ SA.offset "5%" , SA.stopColor color, SA.stopOpacity 0.5 ] 
          , SE.stop [ SA.offset "95%" , SA.stopColor color ] 
          ]
        Port.Output ->
          [ SE.stop [ SA.offset "5%" , SA.stopColor color, SA.stopOpacity 0.5 ] 
          , SE.stop [ SA.offset "95%" , SA.stopColor color, SA.stopOpacity 0.0 ] 
          ]

    color = portColor port signal

    id = intercalate "-" [ "port-gradient", portId, signalId, capacityId ]
    portId = if isInput port then "in" else "out"
    signalId = if signal == zero then "off" else "on"
    capacityId = show (toInt (portCapacity port)) <> "bit"

setAlpha :: Number -> Color -> Color
setAlpha alpha = case _ of
  RGB  r g b   -> RGBA r g b alpha
  RGBA r g b _ -> RGBA r g b alpha
  color -> color

portColor :: Port -> Signal -> Color
portColor port signal = (if signal == zero then shadeColor (-30) else identity) $
  case portCapacity port of
    OneBit    -> portColours.teal
    TwoBit    -> portColours.blue
    FourBit   -> portColours.purple
    EightBit  -> portColours.pink

shadeColor :: Int -> Color -> Color
shadeColor percentage = case _ of
  RGB  r g b   -> RGB  (f r) (f g) (f b)
  RGBA r g b a -> RGBA (f r) (f g) (f b) a
  color -> color

  where f x = clamp 0 255 $ (x * (100 + percentage)) `div` 100
