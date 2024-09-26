module Component.TestRunner.Render where

import Component.TestRunner.Types
import Prelude

import Data.Array (replicate)
import Data.Array as A
import Data.Foldable (length)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set as S
import Data.String as String
import Data.Zipper as Z
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Piece (getInputDirs, getOutputDirs, getPorts)
import Game.Port (isInput, isOutput, portCapacity)
import Game.Signal (SignalRepresentation(..), printSignal)
import Game.TestCase (TestCase)
import Halogen (ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

render :: forall s m. State -> ComponentHTML Action s m
render state =
  HH.div
    [ HP.id "test-runner" ]
    [ HH.table_ (renderHeaders <> renderRows)
    , renderRunAllTestsButton
    , renderRunCurrentTestButton (Z.currentIndex state.testCases)
    ]
  where
    renderHeaders =
      [ HH.tr_
        [ HH.td_ []
        , HH.td
          [ HP.colSpan (S.size inputDirs) ]
          [ HH.text "Inputs" ]
        , HH.td
          [ HP.colSpan (S.size outputDirs) ]
          [ HH.text "Expected" ]
        , HH.td
          [ HP.colSpan (S.size outputDirs) ]
          [ HH.text "Received" ]
        , HH.td_ []
        ]
      , HH.tr_ $ join
        [ [ HH.td_ [ ] ]
        , inputHeaders
        , outputHeaders
        , outputHeaders
        , [ HH.td_ [ ] ]
        ]
      ]
        where
          dirLabel dir = HH.td_
            [ HH.text (String.take 1 (show dir)) ]

          inputDirs  = getInputDirs  state.model
          outputDirs = getOutputDirs state.model

          inputHeaders  = map dirLabel (A.fromFoldable inputDirs) 
          outputHeaders = map dirLabel (A.fromFoldable outputDirs) 

    renderRows :: Array (ComponentHTML Action s m)
    renderRows = flip mapWithIndex relevantTestCases \i testCase -> renderRow (start+i) testCase
      where
        relevantTestCases = A.slice start end (A.fromFoldable state.testCases)
        n = min maxRows (length state.testCases)
        start = max 0 (end - n)
        end = max n (Z.currentIndex state.testCases)

    renderRow :: Int -> TestCase -> _
    renderRow testIndex testCase =
      HH.tr_ $ join
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
            HH.td_ 
              [ HH.text (printSignal (rep dir) signal) ]

        renderInputs   = renderSignals testCase.data.inputs
        renderExpected = renderSignals testCase.data.expected
        renderReceived = case testCase.outcome of
          Just { received } -> renderSignals received
          Nothing -> replicate n (HH.td_ [])
          where
            n = M.size testCase.data.inputs
    
    renderRunAllTestsButton :: ComponentHTML Action s m
    renderRunAllTestsButton =
      HH.button
        [ HE.onClick (\_ -> RunAllTests) ]
        [ HH.text "Run tests" ]

    
    renderRunCurrentTestButton :: Int -> ComponentHTML Action s m
    renderRunCurrentTestButton testIndex =
      HH.button
        [ HE.onClick (\_ -> RunCurrentTest)]
        [ HH.text ("Run test " <> show testIndex) ]


        
