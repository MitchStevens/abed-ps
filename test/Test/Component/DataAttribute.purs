module Test.Component.DataAttribute where

import Prelude

import Component.DataAttribute (DataAttribute)
import Component.DataAttribute as DA
import Data.Either (Either(..))
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Level.Completion (PortMismatch(..))
import Game.Piece (PieceId(..))
import Game.Port (inputPort)
import Parsing (runParser)
import Test.Game.Capacity (genCapacity)
import Test.Game.Directions (genDirection)
import Test.Game.Level.Completion (genPortMismatch)
import Test.Game.Location (genLocation)
import Test.Game.Port (genPort, genPortType)
import Test.Game.Signal (genSignal)
import Test.QuickCheck (Result, arbitrary, assertEquals, quickCheckGen)
import Test.QuickCheck.Gen (Gen, chooseInt)
import Test.Rotation (genRotation)
import Test.Spec (Spec, describe, describeOnly, it, itOnly)
import Test.Spec.Assertions (shouldEqual)

roundTripProperty :: forall a. Eq a => Show a => DataAttribute a -> Gen a -> Gen Result
roundTripProperty da gen = do
  a <- gen
  pure $ runParser (da.attrPrint a) da.attrParse `assertEquals` Right a

spec :: Spec Unit
spec = describeOnly "Component.DataAttribute" do
  it "print" do
    DA.print DA.portMismatch (PortExpected { direction: Direction.Up, expected: inputPort OneBit} )
      `shouldEqual` "input-1-port-expected-at-up"
  it "parse" do
    pure unit
  it "round trips" $ liftEffect do
    quickCheckGen (roundTripProperty DA.signal genSignal)
    quickCheckGen (roundTripProperty DA.int (chooseInt 0 2147483647))
    quickCheckGen (roundTripProperty DA.boolean arbitrary)
    quickCheckGen (roundTripProperty DA.pieceId (PieceId <$> arbitrary))
    quickCheckGen (roundTripProperty DA.location genLocation)
    quickCheckGen (roundTripProperty DA.direction genDirection)
    quickCheckGen (roundTripProperty DA.rotation genRotation)
    -- quickCheckGen (roundTripProperty DA.rotation genRotation) completion status
    quickCheckGen (roundTripProperty DA.portType genPortType)
    quickCheckGen (roundTripProperty DA.capacity genCapacity)
    quickCheckGen (roundTripProperty DA.port genPort)
    quickCheckGen (roundTripProperty DA.portMismatch genPortMismatch)


 -- = PortExpected { direction :: CardinalDirection, expected :: Port }
 -- | NoPortExpected { direction :: CardinalDirection, received :: Port }
 -- | IncorrectPortType { direction :: CardinalDirection, capacity :: Capacity, received :: PortType, expected :: PortType }
 -- | IncorrectCapacity { direction :: CardinalDirection, portType :: PortType, received :: Capacity, expected :: Capacity }

{-
completionStatus :: DataAttribute CompletionStatus
completionStatus = dataAttribute (AttrName "data-completion-status") attrPrint attrParse
  where
    attrPrint = case _ of
      NotStarted -> "not-started"
      FailedRestriction _ -> "failed-restriction"
      NotEvaluable _ -> "not-evaluable"
      PortMismatch _ -> "port-mismatch"
      ReadyForTesting -> "ready-for-testing"
      RunningTest _ -> "running-test"
      FailedTestCase _ -> "failed-test-case"
      Completed -> "completed"
    attrParse = fail "no parser for completion status!"
    -}