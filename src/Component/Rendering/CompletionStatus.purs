module Component.Rendering.CompletionStatus where

import Prelude

import Component.DataAttribute (DataAttribute, portMismatch)
import Component.DataAttribute as DA
import Component.Rendering.Gradient (createPortGradient)
import Component.Rendering.Path (renderPath)
import Component.Rendering.Port (portPath)
import Control.Alternative (guard)
import Control.Monad.Writer (execWriter, tell)
import Data.Foldable (for_, oneOf)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Map (Map)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Level.Completion (CompletionStatus(..), FailedTestCase, PortMismatch(..))
import Game.Piece (Piece(..), getPorts)
import Game.Piece.Capacity (Capacity(..), toInt)
import Game.Piece.Direction (CardinalDirection, allDirections, clockwiseRotation)
import Game.Piece.Direction as Direction
import Game.Piece.Port (Port(..), PortType, inputPort, isInput, outputPort, portType)
import Game.Piece.Port as Port
import Game.Piece.Rotation (Rotation(..), toDegrees)
import Game.Piece.Signal (Signal(..))
import Halogen.HTML (AttrName(..), ClassName(..), PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Transform(..), viewBox)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Parsing (fail)

-- do not export
data PortMarkup = None | Expected | Wrong
type PortDiagram =
  { text :: String
  , portType :: PortType
  , markup :: PortMarkup }


type CompletionStatusDiagram = Map CardinalDirection PortDiagram

renderCompletionStatus :: Piece -> CompletionStatus -> PlainHTML
renderCompletionStatus piece completionStatus =
  renderCompletionStatusDiagram $
    toCompletionStatusDiagram piece completionStatus

toCompletionStatusDiagram :: Piece -> CompletionStatus -> CompletionStatusDiagram
toCompletionStatusDiagram piece = case _ of
  NotStarted -> M.empty
  FailedRestriction _ -> M.empty
  NotEvaluable _ -> M.empty
  PortMismatch mismatch -> M.union (M.unions (map portMismatchDiagram mismatch)) pieceDiagram
  ReadyForTesting -> pieceDiagram
  RunningTest _ -> pieceDiagram
  FailedTestCase failedTestCase -> failedTestCaseDiagram failedTestCase
  Completed -> pieceDiagram
  where
    pieceDiagram :: CompletionStatusDiagram
    pieceDiagram =
      getPorts piece <#> \port -> 
        { text: "", portType: portType port, markup: None }

    portMismatchDiagram :: PortMismatch -> CompletionStatusDiagram
    portMismatchDiagram = case _ of
      PortExpected { direction, expected } ->
        M.singleton direction
          { text: "Add port here"
          , portType: portType expected
          , markup: Expected }
      NoPortExpected { direction, received } ->
        M.singleton direction
          { text: "Remove this port"
          , portType: portType received
          , markup: Wrong
          }
      IncorrectPortType { direction, capacity, received, expected } ->
        M.singleton direction
          { text: "Expected " <> show expected  <> " here"
          , portType: received
          , markup: Wrong
          }
      IncorrectCapacity { direction, portType, received, expected } ->
        M.singleton direction
          { text: "Signal should have capacity " <> show (toInt expected)
          , portType
          , markup: Wrong
          }
    
    failedTestCaseDiagram :: FailedTestCase -> CompletionStatusDiagram
    failedTestCaseDiagram { testIndex, inputs, expected, received } =
      M.catMaybes $ M.fromFoldable $ map (\dir -> Tuple dir (portDiagram dir)) allDirections
      where
        portDiagram dir = oneOf [ inputPortDiagram dir, outputPortDiagram dir ]

        inputPortDiagram dir = do
          inputSignal <- M.lookup dir inputs
          pure
            { text: show inputSignal
            , portType: Port.Input
            , markup: None
            }
        outputPortDiagram dir = do
          expectedSignal <- M.lookup dir expected
          receivedSignal <- M.lookup dir received
          if expectedSignal == receivedSignal
            then pure
              { text: show expectedSignal
              , portType: Port.Output
              , markup: None
              }
            else pure
              { text: "Expected " <> show expectedSignal <> ", recieved " <> show receivedSignal
              , portType: Port.Output
              , markup: Wrong
              }

renderCompletionStatusDiagram :: CompletionStatusDiagram -> PlainHTML
renderCompletionStatusDiagram ports = 
  HH.div [ HP.class_ (ClassName "completion-status-diagram") ] $
    execWriter do
      tell [ HH.div
        [ HP.class_ (ClassName "centre") ]
        [ HH.img 
          [ HP.src "./images/grid.png"]
        
        ]
      ]
      forWithIndex_ ports \dir { text, portType, markup} -> do
        let rot = clockwiseRotation Direction.Up dir
        tell
          [ HH.div
            [ DA.attr DA.direction dir
            , HP.class_ (ClassName "port")
            , DA.attr portMarkupDataAttribute markup
            ]
            [ renderPort portType markup rot ]
          , HH.div
            [ DA.attr DA.direction dir
            , HP.class_ (ClassName "text")
            , DA.attr portMarkupDataAttribute markup
            ]
            [ HH.text text ]
          ]

-- do not export
renderPort :: PortType -> PortMarkup -> Rotation -> PlainHTML
renderPort portType markup rot = case markup of
  _ ->
    SE.svg
      [ viewbox ]
      [ SE.g
        [ SA.transform [ rotate, translate ] ]
        [ renderPath path ]
      ]
  where
    viewbox =
      if rot == Rotation 0 || rot == Rotation 2
        then viewBox 0.0 0.0 50.0 25.0 
        else viewBox 0.0 0.0 25.0 50.0
    
    rotate = Rotate (if portType == Port.Input then toDegrees rot else toDegrees (rot <> Rotation 2)) 25.0 12.5

    translate =
      if rot == Rotation 0 || rot == Rotation 2
        then Translate 0.0 0.0
        else Translate (-12.5) (-12.5)
    
    path = portPath { port: inputPort OneBit, connected: true, signal: Signal 1 }

    --gradient :: { id :: String, def :: PlainHTML }
    --gradient = case markup of 
    --  None -> 
    --  createPortGradient { port, connected: true, signal: Signal 1 }
    --  Expected ->
    --    { id: 

    --    }
    --  NotExpected ->


-- do not export
portMarkupDataAttribute :: DataAttribute PortMarkup
portMarkupDataAttribute = DA.dataAttribute (AttrName "data-port-markup") attrPrint attrParse
  where
    attrPrint = case _ of
      None -> "none"
      Expected -> "expected"
      Wrong -> "wrong"
    attrParse = fail "not parsing port markup"