module Component.TestRunner.Types where

import Prelude

import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NE
import Data.LimitQueue (LimitQueue)
import Data.List (List)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..))
import Data.Zipper (Zipper)
import Game.Direction (CardinalDirection)
import Game.Level.Completion (TestCaseOutcome)
import Game.Piece (Piece(..), eval)
import Game.Port (Port(..))
import Game.Signal (Base, Signal)
import Type.Proxy (Proxy(..))

maxRows = 5
delayBetweenTests = Milliseconds 1000.0

data TestCaseStatus = Pending | Completed | Failed

type TestCase =
  { status :: TestCaseStatus
  , inputs :: Map CardinalDirection Signal
  , expected :: Map CardinalDirection Signal
  , received :: Maybe (Map CardinalDirection Signal)
  }

type Input =
  { ports :: Map CardinalDirection Port
  , base :: Base
  , inputs :: NonEmptyArray (Map CardinalDirection Signal)
  , model :: Piece
  }

type State =
  { ports :: Map CardinalDirection Port
  , base :: Base
  , testCases :: Zipper TestCase
  , model :: Piece
  }

data Query a

data Action
  = Receive Input
  | StartTesting
  | RunSingleTest 
  | CurrentTestCaseCompleted TestCaseOutcome

data Output
  = SingleTestSucceeded { testIndex :: Int }
  | AllTestsSucceed

initialState :: Input -> State
initialState { ports, base, inputs, model } =
  { ports, base, model, testCases }
  where
    testCases = NE.toUnfoldable1 $ flip map inputs \i ->
      { inputs: i
      , expected: eval model i
      , received: Nothing
      , status: Pending
      }

slot = Proxy :: Proxy "testRunner"