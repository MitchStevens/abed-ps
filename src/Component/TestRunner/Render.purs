module Component.TestRunner.Render where

import Component.TestRunner.Types
import Prelude

import Data.Array (replicate)
import Data.Array as A
import Data.Foldable (length)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as M
import Data.Maybe (maybe)
import Data.Set as S
import Data.Zipper as Z
import Game.Capacity (Capacity(..))
import Game.Port (isInput, isOutput, portCapacity)
import Game.Signal (SignalRepresentation(..), printSignal)
import Halogen (ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP



render :: forall s m. State -> ComponentHTML Action s m
render state = HH.table_ (renderHeaders <> renderRows)
  where
    inputDirs  = M.keys $ M.filter isInput  state.ports
    outputDirs = M.keys $ M.filter isOutput state.ports

    renderHeaders =
      [ HH.tr_
        [ HH.td_
          [ HH.text "" ]
        , HH.td
          [ HP.colSpan (S.size inputDirs) ]
          [ HH.text "In." ]
        , HH.td
          [ HP.colSpan (S.size outputDirs) ]
          [ HH.text "Ex." ]
        , HH.td
          [ HP.colSpan (S.size outputDirs) ]
          [ HH.text "Out." ]
        , HH.td_
          [ HH.text "Status" ]
        ]
      , HH.tr_
        [ HH.td_ [ ] -- index
        , HH.td_ [ HH.text "L"]
        , HH.td_ [ HH.text "R"]
        , HH.td_ [ HH.text "R"]
        ]
      ]

    renderRows :: Array (ComponentHTML Action s m)
    renderRows = flip mapWithIndex relevantTestCases \i testCase -> renderRow 99 testCase
      where
        relevantTestCases = A.slice start end (A.fromFoldable state.testCases)
        n = min maxRows (length state.testCases)
        start = max 0 (end - n)
        end = max n (Z.currentIndex state.testCases)

    renderRow :: Int -> TestCase -> ComponentHTML Action s m
    renderRow testIndex testCase =
      HH.tr_ $ join
        [ [ HH.td_ [ HH.text (show testIndex) ] ]
        , renderInputs
        , renderExpected
        , renderReceived
        ]
      where
        rep dir = SignalRepresentation state.base (maybe EightBit portCapacity (M.lookup dir state.ports))

        renderSignals signals = A.fromFoldable $
          flip mapWithIndex signals \dir signal ->
            HH.td_ 
              [ HH.text (printSignal (rep dir) signal) ]

        renderInputs   = renderSignals testCase.inputs
        renderExpected = renderSignals testCase.expected
        renderReceived = case testCase.status of
          Pending -> replicate n (HH.td_ [])
          Completed -> renderSignals testCase.expected
          Failed -> maybe (replicate (M.size testCase.expected) (HH.td_ [HH.text "X"])) renderSignals testCase.received
          where
            n = M.size testCase.expected


        
