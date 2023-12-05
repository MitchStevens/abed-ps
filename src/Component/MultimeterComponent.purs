module Component.MultimeterComponent where

import Prelude

import Capability.GlobalEventEmmiters (globalKeyDownEventEmitter, globalMouseMoveEventEmitter)
import Data.Array (elem, range)
import Data.Array as A
import Data.Foldable (for_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map.Internal (Map(..))
import Data.Maybe (Maybe(..), maybe)
import Data.TraversableWithIndex (forWithIndex)
import Data.Unfoldable1 (iterateN)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (RelativeEdge)
import Game.Board.PortInfo (PortInfo)
import Game.Piece (Capacity(..), Port(..), inputPort, portCapacity, toInt)
import Game.Signal (Signal(..), nthBit)
import Halogen (ClassName(..), RefLabel(..), gets, modify_)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Color(..), TextAnchor(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Web.UIEvent.KeyboardEvent (KeyboardEvent, key)
import Web.UIEvent.MouseEvent (MouseEvent, pageX, pageY)

width = 52.916666
height = 66.675018

leds =
  [ { cx: 9.077261,  cy: 23.000546, r: 1.9862779 }
  , { cx: 14.198897, cy: 23.000546, r: 1.9862779 }
  , { cx: 19.320534, cy: 23.000546, r: 1.9862779 }
  , { cx: 24.442171, cy: 23.000546, r: 1.9862779 }
  , { cx: 29.563808, cy: 23.000546, r: 1.9862779 }
  , { cx: 34.685444, cy: 23.000546, r: 1.9862779 }
  , { cx: 39.807083, cy: 23.000546, r: 1.9862779 }
  , { cx: 44.928719, cy: 23.000546, r: 1.9862779 }
  ]

radialDial = { cx: 15.749074, cy: 44.965733, r: 15.025925 }

display = { w: 39.88829 , h: 13.022614 , x: 7.0013809 , y: 6.4740133 }

type Input = {}

type State =
  { focus :: Maybe
    { relativeEdge :: RelativeEdge
    , info  :: PortInfo
    }
  , display :: Boolean
  , currentPosition :: { x :: Int, y :: Int }
  }

data Action 
  = Initialise 
  | GlobalMouseMove MouseEvent
  | GlobalKeyDown KeyboardEvent

data Query a
  = NewFocus (Maybe { relativeEdge :: RelativeEdge, info :: PortInfo})
  -- | ToggleDisplay

data Output
  = SetCapacity RelativeEdge Capacity

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where
    initialState {} = { focus: Nothing, display: false, currentPosition: zero }
    --initialState {} = { info: Just {connected: true, signal: Signal 21, port: inputPort EightBit } , display: false, currentPosition: zero }

    render state =
      HH.div
        [ HP.id "multimeter"
        , HP.classes (if state.display then [ ClassName "display" ] else [ ClassName "hide" ])
        , HP.style ("left: " <> show state.currentPosition.x <> "px; top: " <> show state.currentPosition.y <> "px;")
        ]
        [ SE.svg 
          [ SA.viewBox 0.0 0.0 width height
          ] $
          map fromPlainHTML
            [ renderMultimeterImage
            , renderBits (maybe (Signal 0) (_.info.signal) state.focus)
            , renderDisplay ((_.info.signal) <$> state.focus)
            , renderRotarySwitch (portCapacity <<< (_.info.port) <$> state.focus)
            ]
        ]
    
    eval = H.mkEval
      (H.defaultEval
        { initialize = Just Initialise
        , handleAction = case _ of
            Initialise -> do
              mouseMoveEmitter <- liftEffect $ globalMouseMoveEventEmitter
              void $ H.subscribe (GlobalMouseMove <$> mouseMoveEmitter)
              keyDownEmitter <- liftEffect $ globalKeyDownEventEmitter
              void $ H.subscribe (GlobalKeyDown <$> keyDownEmitter)

            GlobalMouseMove me -> do
              modify_ (_ { currentPosition = {x: pageX me, y: pageY me} })
            GlobalKeyDown ke -> do
              when (key ke == "s") do 
                modify_ (\s -> s { display = not s.display})

              when (key ke `elem` ["1", "2", "3", "4"]) do
                maybeFocus <- gets (_.focus)
                for_ maybeFocus \{ relativeEdge } -> case key ke of
                  "1" -> H.raise (SetCapacity relativeEdge OneBit)
                  "2" -> H.raise (SetCapacity relativeEdge TwoBit)
                  "3" -> H.raise (SetCapacity relativeEdge FourBit)
                  "4" -> H.raise (SetCapacity relativeEdge EightBit)
                  _   -> pure unit

        , handleQuery = case _ of
            NewFocus focus -> do
              modify_ (_ { focus = focus })
              log (show focus)
              pure Nothing
        }
      )

renderDisplay :: Maybe Signal -> PlainHTML
renderDisplay maybeSignal =
  SE.text
    [ SA.x (display.w + display.x), SA.y (display.h + display.y), SA.textAnchor AnchorEnd ]
    [ HH.text (maybe ""  show maybeSignal) ]

renderBits :: Signal -> PlainHTML
renderBits signal =
  SE.g [] $ flip mapWithIndex leds \i { cx, cy, r } -> 
    let color = if nthBit signal (7-i) then Named "red" else Named "White"
    in  SE.circle [ SA.cx cx, SA.cy cy, SA.r r, SA.fill color ]

renderMultimeterImage :: PlainHTML
renderMultimeterImage =
  SE.image
    [ SA.href ("./images/multimeter.png")
    , SA.width width
    , SA.height height
    ]

renderRotarySwitch :: Maybe Capacity -> PlainHTML
renderRotarySwitch capacity =
  SE.g []
    [ SE.circle [ SA.cx radialDial.cx, SA.cy radialDial.cy, SA.r radialDial.r ]
    , SE.text
      [ SA.x radialDial.cx, SA.y radialDial.cy, SA.textAnchor AnchorMiddle, SA.fill (Named "lightgrey")]
      [ HH.text (maybe "X" (show <<< toInt) capacity) ]
    ]
  