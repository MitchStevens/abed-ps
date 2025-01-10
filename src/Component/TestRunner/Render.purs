module Component.TestRunner.Render where

import Component.TestRunner.Types
import Prelude

import Component.DataAttribute as DA
import Data.Array (replicate, (..))
import Data.Array as A
import Data.Foldable (length)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid (guard)
import Data.Set as S
import Data.String as String
import Data.Tuple (Tuple(..))
import Data.Zipper (currentIndex)
import Data.Zipper as Z
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Piece (getInputDirs, getOutputDirs, getPorts)
import Game.Port (isInput, isOutput, portCapacity)
import Game.Signal (SignalRepresentation(..), printSignal)
import Game.TestCase (TestCase)
import Game.TestCase as TestCase
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Elements.Keyed as HK
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP


render :: forall s m. State -> ComponentHTML Action s m
render state = 
  HH.div
    [ HP.class_ (ClassName "test-runner") ]
    [ HH.table_
      [ colgroup
      , headers
      , body
      , footers
      ]
    , buttons
    ]
  where
    inputDirs = A.fromFoldable $ getInputDirs state.model
    numInputs = A.length inputDirs
    outputDirs = A.fromFoldable $  (getOutputDirs state.model)
    numOutputs = A.length outputDirs

    colgroup = HH.colgroup_ $ join
      [ replicate 1          (HH.col [ HP.class_ (ClassName "test-case-index") ])
      , replicate numInputs  (HH.col [ HP.class_ (ClassName "test-case-input") ])
      , replicate numOutputs (HH.col [ HP.class_ (ClassName "test-case-expected") ])
      , replicate numOutputs (HH.col [ HP.class_ (ClassName "test-case-recieved") ])
      , replicate 1          (HH.col [ HP.class_ (ClassName "test-case-status") ])
      ]

    headers = HH.thead_ 
      [ HH.tr_
        [ HH.th 
          [ HP.class_ (ClassName "col-index") ]
          []
        , HH.th
          [ HP.colSpan numInputs
          , HP.class_ (ClassName "col-input")
          ]
          [ HH.text "In" ]
        , HH.th
          [ HP.colSpan numOutputs
          , HP.class_ (ClassName "col-expected")
          ]
          [ HH.text "Ex." ]
        , HH.th
          [ HP.colSpan numOutputs
          , HP.class_ (ClassName "col-expected")
          ]
          [ HH.text "Out" ]
        , HH.th
          [ HP.colSpan 1
          , HP.rowSpan 2 
          , HP.class_ (ClassName "col-status")
          ]
          [ HH.text "Status" ]
        ]
      , HH.tr_ subheaders
      ]
        where
          subheaders = ([""] <> map show (inputDirs <> outputDirs <> outputDirs)) <#> \s ->
            HH.th_ [ HH.text (String.take 1 s) ]

    footers = HH.tfoot_ 
      [ HH.tr_ 
        [ HH.td
          [ HP.colSpan (1 + numInputs + 2 * numOutputs) ]
          [ HH.text "Tests Complete:" ]
        , HH.td_ [ HH.text (show testsPassed <> "/" <> show (A.length state.testCases)) ]
        ]
      ]
      where
        testsPassed = A.length (A.takeWhile (\testCase -> testCase.status == TestCase.Completed TestCase.Passed) state.testCases)

    body = HH.tbody_ renderRows


    renderRows :: Array (ComponentHTML Action s m)
    renderRows = flip mapWithIndex relevantTestCases \i testCase -> renderRow (start+i) testCase
      where
        relevantTestCases = A.slice start end (A.fromFoldable state.testCases)
        n = min maxRows (length state.testCases)
        start = max 0 (end - n)
        end = max n state.currentIndex

    renderRow :: Int -> TestCase -> ComponentHTML Action s m
    renderRow testIndex testCase =
      HH.tr
        [ HP.class_ (ClassName "test-case") 
        , DA.attr DA.testCaseStatus testCase.status ] $ join
        [ [ HH.td_ [ HH.text (show (testIndex + 1)) ] ]
        , renderInputs
        , renderExpected
        , renderReceived
        , [ renderStatus ]
        ]
      where
        ports = getPorts state.model
        rep dir = SignalRepresentation state.base (maybe EightBit portCapacity (M.lookup dir ports))

        renderSignals signals = A.fromFoldable $
          flip mapWithIndex signals \dir signal ->
            HH.td_ [ HH.text (printSignal (rep dir) signal) ]

        renderInputs   = renderSignals testCase.data.inputs
        renderExpected = renderSignals testCase.data.expected
        renderReceived = case testCase.status of
          TestCase.NotStarted -> replicate n (HH.td_ [ HH.text ""])
          TestCase.InProgress -> replicate n (HH.td_ [ HH.text "-"])
          TestCase.Completed TestCase.Passed -> renderSignals testCase.data.expected
          TestCase.Completed (TestCase.Failed { received }) -> renderSignals received
          where
            n = M.size testCase.data.expected
        
        renderStatus = HH.td_ <<< pure $ case testCase.status of
          TestCase.NotStarted -> HH.text ""
          TestCase.InProgress -> HH.text "Running"
          TestCase.Completed TestCase.Passed -> HH.text "Passed"
          TestCase.Completed (TestCase.Failed _) -> HH.text "Failed"

    buttons = HH.span [ HP.class_ (ClassName "buttons")]
      [ renderRunAllTestsButton, renderRunCurrentTestButton, renderRerunAllTests ]

    renderRunAllTestsButton :: ComponentHTML Action s m
    renderRunAllTestsButton =
      if state.currentIndex == 0 && not state.testSuiteFailed
        then
          HH.button
            [ HE.onClick (\_ -> RunAllTests) ]
            [ HH.text "Run tests" ]
        else HH.text ""
    
    renderRunCurrentTestButton :: ComponentHTML Action s m
    renderRunCurrentTestButton =
      if state.testSuiteFailed
        then
          HH.button
            [ HE.onClick (\_ -> RunCurrentTest)]
            [ HH.text ("Rerun test " <> show (state.currentIndex + 1)) ]
        else HH.text ""

    renderRerunAllTests :: ComponentHTML Action s m
    renderRerunAllTests = 
      if state.testSuiteFailed
        then
          HH.button
            [ HE.onClick (\_ -> RunAllTests)]
            [ HH.text "Retry tests" ]
        else HH.text ""

