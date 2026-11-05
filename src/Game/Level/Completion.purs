module Game.Level.Completion where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.Gen (oneOf)
import Control.Monad.State (evalState)
import Data.Array.NonEmpty (cons')
import Data.Bifunctor (lmap)
import Data.Either (Either(..), fromLeft)
import Data.Foldable (for_)
import Data.Generic.Rep (class Generic)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Show.Generic (genericShow)
import Game.Board (Board(..), BoardError)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, allDirections)
import Game.Eval (Netlist)
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Level.Problem (Problem)
import Game.Piece (Piece(..), eval, getPort)
import Game.Port (Port(..), PortType, hasPort, portCapacity)
import Game.Signal (Signal(..))
import Test.QuickCheck (class Arbitrary, arbitrary)
import Test.QuickCheck.Gen (suchThat)

data CompletionStatus
 = NotStarted
  | PortMismatch PortMismatch
  | FailedRestriction FailedRestriction
  | NotEvaluable BoardError
  | ReadyForTesting
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

-- | `suchThat`-filtered: an `IncorrectPortType`/`IncorrectCapacity` where
-- | `received == expected` wouldn't actually be a mismatch at all.
instance Arbitrary PortMismatch where
  arbitrary = (oneOf $ cons'
    ( map PortExpected      $ { direction: _, expected: _ } <$> arbitrary <*> arbitrary )
    [ map NoPortExpected    $ { direction: _, received: _ } <$> arbitrary <*> arbitrary
    , map IncorrectPortType $ { direction: _, capacity: _, received: _, expected: _ } <$> arbitrary <*> arbitrary <*> arbitrary <*> arbitrary
    , map IncorrectCapacity $ { direction: _, portType: _, received: _, expected: _ } <$> arbitrary <*> arbitrary <*> arbitrary <*> arbitrary
    ]) `suchThat` isValidMismatch
    where
    isValidMismatch = case _ of
      PortExpected _ -> true
      NoPortExpected _ -> true
      IncorrectPortType { received, expected } -> received /= expected
      IncorrectCapacity { received, expected } -> received /= expected


--validPortMismatch = case _ of
--  PortExpected { direction, expected  } -> true
--  NoPortExpected { direction, received  } -> true
--  IncorrectPortType { direction, capacity, received, expected } -> received /= expected
--  IncorrectCapacity { direction, portType, received, expected } -> received /= expected

type RunningTestCase = { testIndex :: Int, numTests :: Int }

type TestCaseOutcome = 
  { testIndex :: Int
  , inputs :: Frame Signal
  , expected :: Frame Signal
  , received :: Frame Signal
  }

type FailedRestriction =
  { name :: String
  , description :: String
  }

-- | Neither compiling nor evaluating the board is this module's job --
-- | both are the caller's (`Component/Level.purs` calls `compile` itself,
-- | since it already needs the result to drive the live board). This just
-- | interprets whatever `Either BoardError Netlist` it's handed.
isReadyForTesting :: Problem -> Board -> Either BoardError Netlist -> CompletionStatus
isReadyForTesting problem board eitherCompiled = fromLeft ReadyForTesting do
  netlist <- lmap NotEvaluable eitherCompiled
  lmap PortMismatch $ checkPortMismatch problem netlist.boundary
  lmap FailedRestriction $ checkOtherRestrictions problem board

checkPortMismatch :: Problem -> Frame Port -> Either PortMismatch Unit
checkPortMismatch problem ports = for_ allDirections \dir -> do
  let expected = getPort problem.goal dir
  let received = Frame.lookupWhere hasPort dir ports
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
  => Piece -> Int -> Frame Signal -> (Frame Signal -> m (Frame Signal)) -> m TestCaseOutcome
runSingleTest piece testIndex inputs testEval = do
  let expected = eval piece inputs
  received <- testEval inputs
  pure { testIndex, inputs, expected, received }