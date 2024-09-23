module Component.Multimeter where

import Prelude

import Capability.GlobalEventEmmiters (globalKeyDownEventEmitter, globalMouseMoveEventEmitter)
import Component.Rendering.Colours (green)
import Data.Align (aligned)
import Data.Array (elem, range, replicate)
import Data.Array as A
import Data.Enum (enumFromTo)
import Data.Foldable (foldMap, for_, traverse_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Int (decimal)
import Data.Map.Internal (Map(..))
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Monoid (power)
import Data.String as String
import Data.String.CodeUnits (fromCharArray)
import Data.These (These(..))
import Data.Traversable (sequence)
import Data.TraversableWithIndex (forWithIndex)
import Data.Unfoldable1 (iterateN)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (RelativeEdge)
import Game.Capacity (Capacity(..), toInt)
import Game.Port (portCapacity)
import Game.PortInfo (PortInfo)
import Game.Signal (Signal(..))
import Halogen (ClassName(..), RefLabel(..), gets, modify_)
import Halogen as H
import Halogen.HTML (HTML(..), PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Color(..), TextAnchor(..), Transform(..))
import Halogen.Svg.Attributes as BaseLine
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Halogen.VDom as VDom
import Web.UIEvent.KeyboardEvent (KeyboardEvent, key)
import Web.UIEvent.MouseEvent (MouseEvent, pageX, pageY)


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
  | SetSignal Signal

data Output
  = SetCapacity RelativeEdge Capacity

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where
    initialState {} = { focus: Nothing, display: false, currentPosition: { x: 0, y: 0 } }

    render state =
      HH.div
        [ HP.id "multimeter"
        , HP.classes (if state.display then [ ClassName "display" ] else [ ClassName "hide" ])
        , HP.style ("left: " <> show state.currentPosition.x <> "px; top: " <> show state.currentPosition.y <> "px;")
        ]
        [ SE.svg 
          [ SA.viewBox 0.0 0.0 width height ]
          [ SE.g [] [ display ]
          ]
        ]
      where
        width = 400.0
        height = 400.0

        screen = { x: (screenBorder.width - 270.0) * 0.5, y: (screenBorder.height - 165.0) * 0.5, width: 270.0 , height: 165.0 }

        screenBorder = { width: 340.0 , height: 190.0 }

        textXPosition = 10.0
        textYPositions = map (\i -> 10.0 + i * 40.0) [ 0.0, 1.0, 2.0, 3.0 ]

        textLines = multimeterText (_.info <$> state.focus)

        createText textYPosition line = SE.text
          [ --SA.fontFamily "monogram"
           SA.stroke (Named "black")
          , SA.x textXPosition
          , SA.y textYPosition
          , SA.dominantBaseline BaseLine.Hanging
          ]
          [ HTML (VDom.Text line) ]
        
        display = SE.g
          []
          [ SE.rect
            [ SA.id "screen-border"
            , SA.height screenBorder.height
            , SA.width screenBorder.width
            ]
          , SE.g
            [ SA.transform [ Translate screen.x screen.y ] ] 
            [ SE.rect
              [ SA.id "screen-background"
              , SA.fill green
              , SA.height screen.height
              , SA.width screen.width
              ]
            , SE.g [] (A.zipWith createText textYPositions textLines)
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
              pure unit
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
              pure Nothing
            SetSignal signal -> do
              gets (_.focus) >>= traverse_ \focus ->
                modify_ $ _ { focus = Just ( focus { info = focus.info { signal = signal } } ) }
              pure Nothing
        }
      )

multimeterText ::  Maybe PortInfo -> Array String
multimeterText = A.zipWith ($) prefixes <<< maybe defaultValues multimeterTextValues
  where
    --space = "&nbsp;"
    space = " "

    prefixes =
      [ append ("BIN" <> power space 5)
      , append ("DEC" <> power space 10)
      , append ("Capacity:" <> space <> space <> space)
      , append ("Connected:" <> space <> space)
      ]


multimeterTextValues :: PortInfo -> Array String
multimeterTextValues _ = [ "FIX ME" ]
--multimeterTextValues info = [ binaryText , decimalText , capacityText , connectedText ]
--  where
--    binaryText =
--      (enumFromTo (toInt (portCapacity info.port) - 1) 0 :: Array _)
--        <#> nthBit info.signal
--        # foldMap (\b -> if b then "1" else "0")
--        # padStart " " 8
--    
--    decimalText =
--      let Signal n = info.signal
--      in padStart "0" 3 (show n)
--
--    capacityText = show (toInt (portCapacity info.port)) <> "bit"
--    connectedText = if info.connected then "true" else "fals"

defaultValues :: Array String
defaultValues =
  [ "--------"
  , "---"
  , "----"
  , "----"
  ]

--renderDisplay :: PortInfo -> Array PlainHTML
--renderDisplay info = pure $
--  SE.text
--    [ SA.x (display.w + display.x), SA.y (display.h + display.y), SA.textAnchor AnchorEnd ]
--    [ HH.text (show (getClampedSignal info)) ]
--
--renderBits :: PortInfo -> Array PlainHTML
--renderBits info =
--  flip map (aligned leds (clampedBits (portCapacity info.port) info.signal)) $
--    case _ of
--      This { cx, cy, r } -> 
--        SE.circle [ SA.cx cx, SA.cy cy, SA.r r, SA.fill (Named "black") ]
--      That b -> SE.circle [] -- should never happen
--      Both { cx, cy, r } b ->
--        let color = if b then Named "red" else Named "white"
--        in  SE.circle [ SA.cx cx, SA.cy cy, SA.r r, SA.fill color ]
--
--renderRotarySwitch :: Maybe Capacity -> PlainHTML
--renderRotarySwitch capacity =
--  SE.g []
--    [ SE.circle [ SA.cx radialDial.cx, SA.cy radialDial.cy, SA.r radialDial.r ]
--    , SE.text
--      [ SA.x radialDial.cx, SA.y radialDial.cy, SA.textAnchor AnchorMiddle, SA.fill (Named "lightgrey")]
--      [ HH.text (maybe "X" (show <<< toInt) capacity) ]
--    ]
  
padStart :: String -> Int -> String -> String
padStart s n str = power s (n - String.length str) <> str
