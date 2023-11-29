module Component.Piece.Render where

import Prelude

import Component.DataAttribute as DataAttr
import Component.Piece.Types (State)
import Data.Array (elem, intercalate)
import Data.Array as A
import Data.Enum (fromEnum)
import Data.Int (toNumber)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe, maybe)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.Expression (Signal(..))
import Game.Piece (Capacity(..), PieceId(..), Port, PortInfo, allWirePieces, getOutputDirs, getPorts, idPiece, inputPort, isInput, isWirePiece, name, pieceLookup, portCapacity, portType, toInt)
import Game.Piece as Port
import Game.Rotation (Rotation(..), rotateDirection)
import Halogen.HTML (ClassName(..), PlainHTML)
import Halogen.HTML as HH
import Halogen.Svg.Attributes (Color(..), CommandPositionReference(..), PathCommand, Transform(..), c, l, m, q)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Partial.Unsafe (unsafeCrashWith)

green = RGB 117 208 191
blue = RGB 120 204 250
purple = RGB 208 135 221
pink = RGB 228 100 156
portColors = [ green, blue, purple, pink ]


gunMetalGrey = RGB 204 226 237

renderWire :: State -> PlainHTML
renderWire state =
    SE.g 
      [ SA.transform
        [ Rotate (toNumber r * 90.0) 50.0 50.0
        , Translate 0.0 0.0 ]
      ] 
      [ SE.path
        [ SA.d path 
        , SA.classes [ ClassName "port" ]
        , DataAttr.attr DataAttr.connected info.connected
        , SA.fill (setAlpha 0.5 (portColor info.port info.signal))
        ]
      ]
  where
    Rotation r = state.rotation
    info = fromMaybe { port: inputPort OneBit, signal: Signal 0, connected: false } $ M.lookup Direction.Left state.portStates

    setAlpha :: Number -> Color -> Color
    setAlpha alpha = case _ of
      RGB  r g b   -> RGBA r g b alpha
      RGBA r g b _ -> RGBA r g b alpha
      color -> color



    path = wirePiecePath (getOutputDirs state.piece)

wirePiecePath :: Set CardinalDirection -> Array PathCommand
--idPiecePath outputs = upSegment <> rightSegment
wirePiecePath outputs = [m Abs 0.0 35.0] <> case S.toUnfoldable outputs of
  [ Direction.Up ] -> leftToUp <> upToLeft
  [ Direction.Up, Direction.Right ] -> leftToUp <> upToRight <> rightToLeft
  [ Direction.Up, Direction.Right, Direction.Down ] -> leftToUp <> upToRight <> rightToDown <> downToLeft
  [ Direction.Up, Direction.Down ] -> leftToUp <> upToDown <> downToLeft
  [ Direction.Right ] -> leftToRight <> rightToLeft
  [ Direction.Right, Direction.Down ] -> leftToRight <> rightToDown <> downToLeft
  [ Direction.Down ] -> leftToDown <> downToLeft
  _ -> []
  where
    leftToUp = [ q Abs 35.0 35.0 35.0 0.0 ] <> up
    leftToRight = [ l Abs 100.0 35.0 ] <> right
    leftToDown = [ q Abs 65.0 35.0 65.0 100.0 ] <> down

    upToRight = [ q Abs 60.0 35.0 50.0 35.0, l Abs 100.0 35.0 ] <> right
    upToDown = [ l Abs 65.0 100.0 ] <> down
    upToLeft = [ q Abs 65.0 65.0 0.0 65.0 ] <> left

    rightToDown = [ l Abs 50.0 65.0, q Abs 60.0 65.0 65.0 100.0 ] <> down
    rightToLeft = [ l Abs 0.0 65.0] <> left

    downToLeft = [ q Abs 35.0 65.0 0.0 65.0 ] <> left
    
    up = [ l Abs 65.0 0.0 ]
    right = [ l Abs 100.0 65.0 ]
    down = [ l Abs 35.0 100.0 ]
    left = [ l Abs 0.0 35.0 ]

    
renderPiece :: State -> PlainHTML
renderPiece state =
  SE.svg
    [ SA.viewBox 0.0 0.0 100.0 100.0 ]
    if state.piece `elem` allWirePieces
      then [ renderWire state ]
      else (allPorts <> [ center ])
  where

    allPorts = do
      dir <- allDirections
      let r = fromEnum (rotateDirection dir state.rotation)
      pure $ SE.g 
        [ SA.transform
          [ Rotate (toNumber r * 90.0) 50.0 50.0
          , Translate 25.0 0.0 ]
        ] $
        do
          portInfo <- A.fromFoldable (M.lookup dir state.portStates)
          pure $ renderPort (rotateDirection dir state.rotation) portInfo

    center = SE.g 
      [ SA.transform [ Translate 30.0 30.0 ] ]
      [ SE.svg [ SA.width 50.0, SA.height 50.0 ]
        [ renderPieceCenter (name state.piece) ]
      ]

renderPieceCenter :: PieceId -> PlainHTML
renderPieceCenter (PieceId id) = SE.image
  [ SA.href ("./images/" <> id <> ".png") 
  , SA.width 40.0
  , SA.height 40.0 
  ]

renderPort :: CardinalDirection -> PortInfo -> PlainHTML
renderPort direction info@{connected, port, signal} = SE.g []
  [ SE.defs [] [ createGradient info ]
  , SE.polyline
    [ SA.points portShapePoints
    , SA.classes [ClassName "port"]
    , DataAttr.attr DataAttr.connected connected
    , SA.fillGradient ("#" <> portGradientId info)
    ]
  ]
  where
    portShapePoints = case portType port of
      Port.Input ->
        [ Tuple 10.0  0.0
        , Tuple 10.0  12.0
        , Tuple 0.0   12.0
        , Tuple 25.0  25.0
        , Tuple 50.0  12.0
        , Tuple 40.0  12.0
        , Tuple 40.0  0.0
        ]
      Port.Output ->
        [ Tuple 10.0  0.0
        , Tuple 10.0  25.0
        , Tuple 40.0  25.0
        , Tuple 40.0  0.0
        ]


portColor :: Port -> Signal -> Color
portColor port signal = (if signal == Signal 0 then shadeColor (-1) else identity) $
  case portCapacity port of
    OneBit -> green
    TwoBit -> blue
    FourBit -> purple
    EightBit -> pink

shadeColor :: Int -> Color -> Color
shadeColor percentage = case _ of
  RGB  r g b   -> RGB  (f r) (f g) (f b)
  RGBA r g b a -> RGBA (f r) (f g) (f b) a
  color -> color

  where f x = clamp 0 255 $ x * (100 + percentage) `div` 100

-- gradient id: gradient-port-(in|out)-(color)
createGradient :: PortInfo -> PlainHTML
createGradient info@{ port, connected, signal } = SE.linearGradient
  [ SA.id (portGradientId info), SA.gradientTransform [ Rotate 90.0 0.0 0.0 ] ]
  $ case portType port of
    Port.Input -> 
      [ SE.stop [ SA.offset "5%" , SA.stopColor color, SA.stopOpacity 0.5 ] 
      , SE.stop [ SA.offset "95%" , SA.stopColor color ] 
      ]
    Port.Output ->
      [ SE.stop [ SA.offset "5%" , SA.stopColor color, SA.stopOpacity 0.5 ] 
      , SE.stop [ SA.offset "95%" , SA.stopColor color, SA.stopOpacity 0.0 ] 
      ]
  where color = portColor port signal

-- port-gradient-in-off-4bit
portGradientId :: PortInfo -> String
portGradientId { port, connected, signal } = 
  let portId = if isInput port then "in" else "out"
      signalId = if signal == Signal 0 then "off" else "on"
      capacityId = show (toInt (portCapacity port)) <> "bit"
  in intercalate "-" [ "port-gradient", portId, signalId, capacityId ]