module Game.Level.Completion where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.State (evalState)
import Control.Monad.Writer (execWriter, runWriter, tell)
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NEArray
import Data.Bifunctor (lmap)
import Data.Either (Either(..), fromLeft)
import Data.Foldable (for_)
import Data.Generic.Rep (class Generic)
import Data.List.Types (NonEmptyList)
import Data.Map (Map)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Show.Generic (genericShow)
import Game.Board (Board(..), BoardError, EvaluableBoard(..), evaluableBoardPiece, toEvaluableBoard)
import Game.Level (Level(..))
import Game.Piece (Piece(..), eval, getPort)
import Game.Piece.Capacity (Capacity)
import Game.Piece.Direction (CardinalDirection, allDirections)
import Game.Piece.Port (Port(..), PortType, portCapacity)
import Game.Piece.Signal (Signal(..))

data CompletionStatus
  = NotStarted
  | FailedRestriction (NonEmptyArray FailedRestriction)
  | NotEvaluable BoardError
  | PortMismatch (NonEmptyArray PortMismatch)
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
isReadyForTesting :: Level -> Board -> CompletionStatus
isReadyForTesting level board = fromLeft ReadyForTesting do
  evaluable <- checkEvaluable board
  checkPortMismatch level (evaluableBoardPiece evaluable)
    $ checkOtherRestrictions level board

checkEvaluable :: Board -> Either CompletionStatus EvaluableBoard
checkEvaluable board = lmap NotEvaluable (toEvaluableBoard board)

checkPortMismatch :: Level -> Piece -> Either CompletionStatus Unit
checkPortMismatch level piece = 
  case NEArray.fromFoldable (portMismatches level piece) of
    Just mismatches -> Left (PortMismatch mismatches)
    Nothing -> pure unit

portMismatches :: Level -> Piece -> Array PortMismatch
checkPortMismatch (Level level) piece = execWriter $
  for_ allDirections \dir -> do
    let expected = getPort level.goal dir
    let received = getPort piece dir
    case isPortMismatch dir expected received of
      Just mismatch -> tell [mismatch]
      Nothing -> pure unit

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

checkFailedRestrictions :: Level -> Board -> Either CompletionStatus Unit
checkFailedRestrictions level board =
  case (NEArray.fromFoldable (failedRestrictions level board)) of
    Just restrictions -> Left (FailedRestriction restrictions)
    Nothing -> pure unit

failedRestrictions :: Level -> Board -> Array FailedRestriction
failedRestrictions (Level level) board = execWriter $
  for_ level.otherRestrictions \r ->
    unless (r.restriction board) do
      tell [ { name: r.name, description: r.description } ]

runSingleTest :: forall m. Monad m
  => Piece -> Int -> Map CardinalDirection Signal -> (Map CardinalDirection Signal -> m (Map CardinalDirection Signal)) -> m (Either FailedTestCase Unit)
runSingleTest piece testIndex inputs testEval = do
  let expected = eval piece inputs
  recieved <- testEval inputs
  if expected == recieved
    then pure $ Right unit
    else pure $ Left { testIndex, inputs, expected, recieved }