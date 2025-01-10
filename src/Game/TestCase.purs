module Game.TestCase where

import Prelude

import Data.Foldable (all)
import Data.Generic.Rep (class Generic)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Game.Direction (CardinalDirection, allDirections)
import Game.Piece (Piece(..), eval, getPort)
import Game.Port (Port(..), PortType(..))
import Game.Signal (Signal, equivalent)

type TestCase = 
  { data :: TestCaseData
  , status :: TestCaseStatus
  }

type TestCaseData =
  { inputs :: Map CardinalDirection Signal
  , expected :: Map CardinalDirection Signal
  }

data TestCaseStatus
  = NotStarted
  | InProgress
  | Completed TestCaseOutcome
derive instance Eq TestCaseStatus
instance Show TestCaseStatus where
  show = case _ of
    NotStarted -> "NotStarted"
    InProgress -> "InProgress"
    Completed outcome -> show outcome


data TestCaseOutcome
  = Passed
  | Failed { received :: Map CardinalDirection Signal }
derive instance Eq TestCaseOutcome
instance Show TestCaseOutcome where
  show = case _ of
    Passed -> "Passed"
    Failed _ -> "Failed"

testCaseOutcome :: TestCaseData -> Map CardinalDirection Signal -> TestCaseOutcome
testCaseOutcome { inputs, expected } received =
  if expected == received then Passed else Failed { received }

  --flip all allDirections \dir -> case M.lookup dir expected, M.lookup dir received of
  --  Just s1, Just s2 -> true
  --  Nothing, Nothing -> true
  --  _, _





--runTestCase :: (Map CardinalDirection ) -> TestCase -> TestCaseResult
--runTestCase  { inputs, expected } =
--  let received = eval piece inputs
--      passed = flip all allDirections \dir ->
--        case getPort piece dir, M.lookup dir expected, M.lookup dir received of
--          Just (Port { capacity, portType: Output }), Just s1, Just s2 ->
--            equivalent capacity s1 s2
--          _, Just _, Just _ -> true
--          _, Nothing, Nothing -> true
--          _, _, _ -> false
--  in { received, passed }

