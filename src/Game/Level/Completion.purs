module Game.Level.Completion where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.State (evalState)
import Data.Bifunctor (lmap)
import Data.Either (Either(..), fromLeft)
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Maybe (Maybe)
import Game.Board (Board(..))
import Game.Board.EvaluableBoard (EvaluableBoard(..), toEvaluableBoard)
import Game.Board.Operation (BoardError)
import Game.Direction (CardinalDirection, allDirections)
import Game.Level.Problem (Problem)
import Game.Piece (APiece, Port, eval, getPort)
import Game.Signal (Signal(..))

data CompletionStatus
  = NotStarted
  | FailedRestriction FailedRestriction
  | NotEvaluable BoardError
  | PortMismatch PortMismatch
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

-- todo: pass in evaluable so we don't have to convert to evaluable twice?
isReadyForTesting :: Problem -> Board -> CompletionStatus
isReadyForTesting problem board = fromLeft ReadyForTesting do
  evaluable <- checkEvaluable board
  lmap PortMismatch $ checkPortMismatch problem evaluable
  lmap FailedRestriction $ checkOtherRestrictions problem board

checkEvaluable :: Board -> Either CompletionStatus EvaluableBoard
checkEvaluable board = lmap NotEvaluable (toEvaluableBoard board)

checkPortMismatch :: Problem -> EvaluableBoard -> Either PortMismatch Unit
checkPortMismatch problem evaluable = for_ allDirections \dir -> do
  let expected = getPort problem.goal dir
  let received = getPort evaluable dir
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