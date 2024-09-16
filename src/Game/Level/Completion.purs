module Game.Level.Completion where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.State (evalState)
import Data.Bifunctor (lmap)
import Data.Either (Either(..), fromLeft)
import Data.Foldable (for_)
import Data.Generic.Rep (class Generic)
import Data.Map (Map)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Show.Generic (genericShow)
import Game.Board (Board(..), BoardError, EvaluableBoard(..), evaluableBoardPiece, toEvaluableBoard)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections)
import Game.Level.Problem (Problem)
import Game.Piece (Piece(..), eval, getPort)
import Game.Port (Port(..), PortType, portCapacity)
import Game.Signal (Signal(..))

data CompletionStatus
  = NotStarted
  | FailedRestriction FailedRestriction
  | NotEvaluable BoardError
  | PortMismatch PortMismatch
  | ReadyForTesting
  | RunningTest RunningTest
  | FailedTestCase FailedTestCase
  | Completed

derive instance Eq CompletionStatus
--instance Show ProblemCompletionStatus where
--  show = case _ of
--    DifferentPortConfiguration r ->
--      "different port configuration at " <> show r.dir <> ": " <> showMismatch r
--    DifferentPort r ->
--      "differnt port at:" <> show r.dir <> ": " <> showMismatch r
--    FailedRestriction r -> "Failed restriction " <> r.name <> " with message " <> r.description

data PortMismatch
  = PortExpected { direction :: CardinalDirection, expected :: Port }
  | NoPortExpected { direction :: CardinalDirection, received :: Port }
  | IncorrectPortType { direction :: CardinalDirection, capacity :: Capacity, received :: PortType, expected :: PortType }
  | IncorrectCapacity { direction :: CardinalDirection, portType :: PortType, received :: Capacity, expected :: Capacity }
derive instance Generic PortMismatch _
derive instance Eq PortMismatch
instance Show PortMismatch where
  show = genericShow


--validPortMismatch = case _ of
--  PortExpected { direction, expected  } -> true
--  NoPortExpected { direction, received  } -> true
--  IncorrectPortType { direction, capacity, received, expected } -> received /= expected
--  IncorrectCapacity { direction, portType, received, expected } -> received /= expected

type RunningTest = { testIndex :: Int, numTests :: Int }

type FailedTestCase =
  { testIndex :: Int
  , inputs :: Map CardinalDirection Signal
  , expected :: Map CardinalDirection Signal
  , recieved :: Map CardinalDirection Signal
  }

type FailedRestriction =
  { name :: String
  , description :: String
  }

-- todo: pass in evaluable so we don't have to convert to evaluable twice?
isReadyForTesting :: Problem -> Board -> CompletionStatus
isReadyForTesting problem board = fromLeft ReadyForTesting do
  evaluable <- checkEvaluable board
  lmap PortMismatch $ checkPortMismatch problem (evaluableBoardPiece evaluable)
  lmap FailedRestriction $ checkOtherRestrictions problem board

checkEvaluable :: Board -> Either CompletionStatus EvaluableBoard
checkEvaluable board = lmap NotEvaluable (toEvaluableBoard board)

checkPortMismatch :: Problem -> Piece -> Either PortMismatch Unit
checkPortMismatch problem evaluable = for_ allDirections \dir -> do
  let expected = getPort problem.goal dir
  let received = getPort evaluable dir
  maybe (Right unit) Left (isPortMismatch dir expected received)

isPortMismatch :: CardinalDirection -> Maybe Port -> Maybe Port -> Maybe PortMismatch
isPortMismatch direction maybeExpected maybeRecieved = case maybeExpected, maybeRecieved of
  Nothing, Nothing -> Nothing
  Just expected, Nothing -> Just $ PortExpected { direction, expected }
  Nothing, Just received -> Just $ NoPortExpected { direction, received }
  Just (Port expected), Just (Port received) ->
    if expected.portType /= received.portType
      then Just $ IncorrectPortType { direction, capacity: received.capacity, expected: expected.portType, received: received.portType }
    else if  expected.capacity /= received.capacity
      then Just $ IncorrectCapacity { direction, portType: received.portType, expected: expected.capacity, received: received.capacity }
    else
      Nothing

checkOtherRestrictions :: Problem -> Board -> Either FailedRestriction Unit
checkOtherRestrictions problem board = for_ problem.otherRestrictions \r ->
  unless (r.restriction board) do
    throwError { name: r.name, description: r.description }

runSingleTest :: forall m. Monad m
  => Piece -> Int -> Map CardinalDirection Signal -> (Map CardinalDirection Signal -> m (Map CardinalDirection Signal)) -> m (Either FailedTestCase Unit)
runSingleTest piece testIndex inputs testEval = do
  let expected = eval piece inputs
  recieved <- testEval inputs
  if expected == recieved
    then pure $ Right unit
    else pure $ Left { testIndex, inputs, expected, recieved }