module Game.ProblemDescription where

import Prelude

import Control.Monad.Except (ExceptT, lift, throwError)
import Data.Either (Either)
import Data.Enum (enumFromTo)
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Effect.Aff (Aff)
import Game.Board (Board(..))
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, allDirections)
import Game.Piece (APiece(..), Port, eval, getPort)

type ProblemDescription = 
  { goal :: APiece
  , title :: String
  , description :: String
  , testCases :: Array (Map CardinalDirection Signal)
  , requiresAutomaticTesting :: Boolean
  , pieceSet :: Set APiece
  , otherRestrictions :: Map String (Board -> Boolean)
  }

type Mismatch a = ( received :: a, expected :: a )

data PieceSpecMismatch
  = DifferentPortConfiguration (Record (
      dir :: CardinalDirection
      | Mismatch (Maybe Port)
    ))
  | DifferentPort (Record ( dir :: CardinalDirection | (Mismatch Port) ))
  | FailedTestCase (Record ( 
    inputs :: Map CardinalDirection Signal
      | Mismatch (Map CardinalDirection Signal)
    ))
  | FailedRestriction String

showMismatch :: forall r a. Show a => { received :: a, expected :: a | r } -> String
showMismatch r = "received: " <> show r.received <> ", expected: " <> show r.expected

derive instance Eq PieceSpecMismatch
instance Show PieceSpecMismatch where
  show = case _ of
    DifferentPortConfiguration r ->
      "different port configuration at " <> show r.dir <> ": " <> showMismatch r
    DifferentPort r ->
      "differnt port at:" <> show r.dir <> ": " <> showMismatch r
    FailedTestCase r  -> 
      "failed test case with inputs " <> show r.inputs <> ": " <> showMismatch r
    FailedRestriction str -> "Failed predicate " <> str

--arbitraryInput :: Map CardinalDirection Signal

solvedBy :: ProblemDescription -> Board -> ExceptT PieceSpecMismatch Aff Boolean
solvedBy problem board = do
  checkSamePorts
  checkTestCases
  pure true
  where
    checkSamePorts = for_ allDirections \dir -> do
      case getPort board dir, getPort problem.goal dir of
        Nothing, Nothing -> pure unit
        Nothing, Just b -> throwError $ DifferentPortConfiguration { dir, received: Nothing, expected: Just b }
        Just a, Nothing -> throwError $ DifferentPortConfiguration { dir, received: Just a, expected: Nothing }
        Just a, Just b ->
          if a /= b
            then throwError $ DifferentPort { dir, received: a, expected: b }
            else pure unit
    
    checkTestCases = for_ problem.testCases \inputs -> do
      let received = eval board inputs
      let expected = eval problem.goal inputs
      if received /= expected
        then throwError $ FailedTestCase { inputs, received, expected }
        else pure unit
