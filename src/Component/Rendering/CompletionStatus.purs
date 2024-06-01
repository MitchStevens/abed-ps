module Component.Rendering.CompletionStatus where

import Prelude

import Component.DataAttribute (portMismatch)
import Component.DataAttribute as DA
import Component.Rendering.Gradient (createPortGradient)
import Component.Rendering.Path (renderPath)
import Component.Rendering.Port (portPath)
import Control.Monad.Writer (execWriter, tell)
import Data.Foldable (for_)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Map (Map)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Level.Completion (CompletionStatus, PortMismatch)
import Game.Piece (Piece(..), getPorts)
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction (CardinalDirection, clockwiseRotation)
import Game.Piece.Direction as Direction
import Game.Piece.Port (Port(..), inputPort, isInput, outputPort)
import Game.Piece.Rotation (Rotation(..), toDegrees)
import Game.Piece.Signal (Signal(..))
import Halogen.HTML (ClassName(..), PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Transform(..), viewBox)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

-- do not export
data PortMarkup = None | Expected | NotExpected
type PortDiagram =
  { text :: String
  , port :: Port
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
  NotEvaluable BoardError -> M.empty
  PortMismatch mismatch -> M.union (portMismatch mismatch) pieceDiagram
  ReadyForTesting -> pieceDiagram
  RunningTest _ -> pieceDiagram
  FailedTestCase _ -> pieceDiagram
  Completed -> PieceDiagram
  _ -> testCompletionStatusDiagram
  where
    portMismatchDiagram :: PortMismatch -> CompletionStatusDiagram
    portMismatchDiagram = case _ of
      PortExpected { direction, expected } -> M.singleton
      NoPortExpected { direction, received }
      IncorrectPortType { direction, capacity, received, expected }
      IncorrectCapacity { direction, portType, received, expected }

    pieceDiagram :: CompletionStatusDiagram
    pieceDiagram piece =
      getPorts piece <#> \port -> 
        { text: show port, port, markup: None }

    testCompletionStatusDiagram :: CompletionStatusDiagram
    testCompletionStatusDiagram =
      M.fromFoldable
        [ Tuple Direction.Up
          { text: "SOme text goes here up"
          , port: inputPort OneBit
          , markup: None }
        , Tuple Direction.Left
          { text: "a little text on the left"
          , port: inputPort OneBit
          , markup: Expected
          }
        , Tuple Direction.Right
          { text: "this is the output port"
          , port: outputPort OneBit
          , markup: NotExpected
          }
        , Tuple Direction.Down
          { text: "text for down"
          , port: outputPort OneBit
          , markup: None
          }
        ]


renderCompletionStatusDiagram :: CompletionStatusDiagram -> PlainHTML
renderCompletionStatusDiagram ports = 
  HH.div [ HP.class_ (ClassName "completion-status-diagram") ] $
    execWriter do
      tell [ HH.div
        [ HP.class_ (ClassName "centre") ]
        [ ]
      ]
      forWithIndex_ ports \dir { text, port, markup} -> do
        let rot = clockwiseRotation Direction.Up dir
        tell
          [ HH.div
            [ DA.attr DA.direction dir
            , HP.class_ (ClassName "port")
            ]
            [ renderPort port markup rot ]
          , HH.div
            [ DA.attr DA.direction dir
            , HP.class_ (ClassName "text")
            ]
            [ HH.text text ]
          ]

-- do not export
renderPort :: Port -> PortMarkup -> Rotation -> PlainHTML
renderPort port markup rot = case markup of
  _ ->
    SE.svg
      [ viewbox, className ]
      [ SE.g
        [ SA.transform [ rotate, translate ] ]
        [ renderPath path ]
      ]
  where
    viewbox =
      if rot == Rotation 0 || rot == Rotation 2
        then viewBox 0.0 0.0 50.0 25.0 
        else viewBox 0.0 0.0 25.0 50.0
    
    className = SA.class_ $ ClassName $ case markup of
      None -> ""
      Expected -> "expected"
      NotExpected -> "not-expected"
    
    rotate = Rotate (if isInput port then toDegrees rot else toDegrees (rot <> Rotation 2)) 25.0 12.5

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