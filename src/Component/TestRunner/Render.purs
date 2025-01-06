module Component.TestRunner.Render where

import Component.TestRunner.Types
import Prelude

import Data.Array (replicate, (..))
import Data.Array as A
import Data.Foldable (length)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Data.String as String
import Data.Tuple (Tuple(..))
import Data.Zipper as Z
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Piece (getInputDirs, getOutputDirs, getPorts)
import Game.Port (isInput, isOutput, portCapacity)
import Game.Signal (SignalRepresentation(..), printSignal)
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Elements.Keyed as HK
import Halogen.HTML.Properties as HP
import Game.TestCase


render :: forall a s m. State -> ComponentHTML a s m
render state = HH.div
  [ HP.class_ (ClassName "test-runner")
  , HP.style ("grid-template-columns: repeat(" <> show (1 + numInputs + 2 * numOutputs) <> ", 1fr) [status] 100px")
  ]
  (headers <> subheaders <> addGridIndices (Tuple 2 0) renderRows)
  where
    inputDirs = A.fromFoldable $ getInputDirs state.model
    numInputs = A.length inputDirs
    outputDirs = A.fromFoldable $  (getOutputDirs state.model)
    numOutputs = A.length outputDirs

    headers :: Array (ComponentHTML a s m)
    headers =
      [ HH.span  
        [ HP.style ("grid-column: 2 / span " <> show numInputs) ]
        [ HH.text "In" ]
      , HH.span
        [ HP.style ("grid-column: auto / span " <> show numOutputs) ]
        [ HH.text "Ex." ]
      , HH.span
        [ HP.style ("grid-column: auto / span " <> show numOutputs) ]
        [ HH.text "Out" ]
      , HH.span
        [ HP.style ("grid-column: auto / span 1") ]
        [ HH.text "Status" ]
      ]
        where
          dirLabel dir = HH.td_
            [ HH.text (String.take 1 (show dir)) ]

          inputDirs  = getInputDirs  state.model
          outputDirs = getOutputDirs state.model

          inputHeaders  = map dirLabel (A.fromFoldable inputDirs) 
          outputHeaders = map dirLabel (A.fromFoldable outputDirs) 

    subheaders = ([""] <> map show (inputDirs <> outputDirs <> outputDirs)) <#> \s ->
      HH.span
        [ HP.style ("grid-row: 2") ]
        [ HH.text (String.take 1 s) ]

      


      --, HH.tr_
      --  [ HH.td_ [ ] -- index
      --  , HH.td_ [ HH.text "L"]
      --  , HH.td_ [ HH.text "R"]
      --  , HH.td_ [ HH.text "R"]
      --  ]
      --]

    renderRows :: Array (Array (ComponentHTML a s m))
    renderRows = flip mapWithIndex relevantTestCases \i testCase -> renderRow (start+i) testCase
      where
        relevantTestCases = A.slice start end (A.fromFoldable state.testCases)
        n = min maxRows (length state.testCases)
        start = max 0 (end - n)
        end = max n (Z.currentIndex state.testCases)

    renderRow :: Int -> TestCase -> Array (ComponentHTML a s m)
    renderRow testIndex testCase = join
      [ [ HH.text (show testIndex) ]
      , renderInputs
      , renderExpected
      , renderReceived
      ]
      where
        ports = getPorts state.model
        rep dir = SignalRepresentation state.base (maybe EightBit portCapacity (M.lookup dir ports))

        renderSignals signals = A.fromFoldable $
          flip mapWithIndex signals \dir signal ->
            HH.text (printSignal (rep dir) signal)

        renderInputs   = renderSignals testCase.data.inputs
        renderExpected = renderSignals testCase.data.expected
        renderReceived = case testCase.outcome of
          Just { received } -> renderSignals received
          Nothing -> replicate n (HH.td_ [])
          where
            n = M.size testCase.data.expected
    
    addGridIndices :: Tuple Int Int -> Array (Array (ComponentHTML a s m)) -> Array (ComponentHTML a s m)
    addGridIndices (Tuple offsetX offsetY) elements = case A.head elements of
      Just head -> do
        let cols = A.length head
        let rows = A.length elements
        Tuple x elemRow <- A.zip (1..rows) elements
        Tuple y elem    <- A.zip (1..cols) elemRow
        let style = "grid-area: " <> show (offsetX + x) <> " / " <> show (offsetY + y) <> ""
        pure (HH.span [ HP.style style ] [ elem ])
      Nothing -> []
    
--    renderRunAllTestsButton :: ComponentHTML Action s m
--    renderRunAllTestsButton =
--      HH.button
--        [ HE.onClick (\_ -> RunAllTests) ]
--        [ HH.text "Run tests" ]
--
--    
--    renderRunCurrentTestButton :: Int -> ComponentHTML Action s m
--    renderRunCurrentTestButton testIndex =
--      HH.button
--        [ HE.onClick (\_ -> RunCurrentTest)]
--        [ HH.text ("Run test " <> show testIndex) ]

        
