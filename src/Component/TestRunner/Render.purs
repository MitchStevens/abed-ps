module Component.TestRunner.Render where

import Component.TestRunner.Types
import Prelude

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
import Data.Zipper as Z
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Piece (getInputDirs, getOutputDirs, getPorts)
import Game.Port (isInput, isOutput, portCapacity)
import Game.Signal (SignalRepresentation(..), printSignal)
import Game.TestCase (TestCase)
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
        [ HH.th_ []
        , HH.th
          [ HP.colSpan numInputs ]
          [ HH.text "In" ]
        , HH.th
          [ HP.colSpan numOutputs ]
          [ HH.text "Ex." ]
        , HH.th
          [ HP.colSpan numOutputs ]
          [ HH.text "Out" ]
        , HH.th
          [ HP.colSpan 1
          , HP.rowSpan 2  ]
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
          [ HH.text "Tests completed:" ]
        , HH.td_ [ HH.text (show state.currentIndex <> "/" <> show (length state.testCases :: Int)) ]
        ]
      ]

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
      HH.tr [ HP.class_ (ClassName "test-case") ] $ join
        [ [ HH.td_ [ HH.text (show testIndex) ] ]
        , renderInputs
        , renderExpected
        , renderReceived
        ]
      where
        ports = getPorts state.model
        rep dir = SignalRepresentation state.base (maybe EightBit portCapacity (M.lookup dir ports))

        renderSignals signals = A.fromFoldable $
          flip mapWithIndex signals \dir signal ->
            HH.td_ [ HH.text (printSignal (rep dir) signal) ]

        renderInputs   = renderSignals testCase.data.inputs
        renderExpected = renderSignals testCase.data.expected
        renderReceived = case testCase.outcome of
          Just { received } -> renderSignals received
          Nothing -> replicate n (HH.text "")
          where
            n = M.size testCase.data.expected

    buttons :: ComponentHTML Action s m
    buttons = HH.span_ $
      [ renderRunAllTestsButton
      , renderRunCurrentTestButton
      ]

    renderRunAllTestsButton :: ComponentHTML Action s m
    renderRunAllTestsButton =
      HH.button
        [ HE.onClick (\_ -> RunAllTests) ]
        [ HH.text "Run tests" ]

    
    renderRunCurrentTestButton :: ComponentHTML Action s m
    renderRunCurrentTestButton =
      HH.button
        [ HE.onClick (\_ -> RunCurrentTest)]
        [ HH.text ("Run test " <> show (state.currentIndex + 1)) ]

        
