module Component.Sidebar.TestCaseTable where

import Prelude

import Data.LimitQueue (LimitQueue)
import Data.LimitQueue as LQ
import Data.Map (Map)
import Game.Direction (CardinalDirection)
import Game.Level.Completion (TestCaseOutcome)
import Game.Port (Port(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

type Input =
  { ports :: Map CardinalDirection Port
  , limit :: Int
  }

type State =
  { ports :: Map CardinalDirection Port
  , testCaseOutcomes :: LimitQueue TestCaseOutcome
  }

data Query a
  = AddTestCaseOutcome TestCaseOutcome

data Action

type Output = Void

--component :: forall m. H.Component Query Input Output m
--component = H.mkComponent { eval , initialState , render }
--  where
--  initialState { ports, limit } = { ports, testCaseOutcomes: LQ.empty limit }
--
--  render state = 
--    HH.table_
--      [ HH.th_
--        [ HH.td_ [  ]
--        , HH.td
--            [ HP.colSpan 2 ]
--            [ HH.text "Inputs" ]
--        ]
--      ]
--    where
--      renderTestCase { testIndex, inputs, expected, recieved } = HH.text ""