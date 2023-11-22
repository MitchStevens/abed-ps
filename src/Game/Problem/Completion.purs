module Game.Problem.Completion where

import Prelude

import Control.Monad.Error.Class (throwError)
import Data.Bifunctor (lmap)
import Data.Either (Either(..), fromLeft)
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Maybe (Maybe)
import Game.Board (Board(..))
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, allDirections)
import Game.Piece (APiece, Port, eval, getPort)
import Game.ProblemDescription (Problem)

data CompletionStatus
  = NotStarted
  | PortMismatch PortMismatch
  | FailedRestriction FailedRestriction
  | ReadyForTesting
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

type PortMismatch =
  { dir :: CardinalDirection
  , received :: Maybe Port
  , expected :: Maybe Port
  }

type FailedTestCase =
  { inputs :: Map CardinalDirection Signal
  , expected :: Map CardinalDirection Signal
  , recieved :: Map CardinalDirection Signal
  }

type FailedRestriction =
  { name :: String
  , description :: String
  }

isReadyForTesting :: Problem -> Board -> CompletionStatus
isReadyForTesting problem board = fromLeft ReadyForTesting do
  lmap PortMismatch $ checkPortMismatch problem board
  lmap FailedRestriction $ checkOtherRestrictions problem board

checkPortMismatch :: Problem -> Board -> Either PortMismatch Unit
checkPortMismatch problem board = for_ allDirections \dir -> do
  let expected = getPort problem.goal dir
  let received = getPort board dir
  when (expected /= received) do
    throwError { dir, expected, received }

checkOtherRestrictions :: Problem -> Board -> Either FailedRestriction Unit
checkOtherRestrictions problem board = for_ problem.otherRestrictions \r ->
  unless (r.restriction board) do
    throwError { name: r.name, description: r.description }

runSingleTest :: forall m. Monad m
  => APiece -> Map CardinalDirection Signal -> (Map CardinalDirection Signal -> m (Map CardinalDirection Signal)) -> m (Either FailedTestCase Unit)
runSingleTest piece inputs testEval = do
  let expected = eval piece inputs
  recieved <- testEval inputs
  if expected == recieved
    then pure $ Right unit
    else pure $ Left { inputs, expected, recieved }