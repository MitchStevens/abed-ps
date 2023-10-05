module Game.ProblemDescription where

import Prelude

import Control.Monad.Except (ExceptT, lift, throwError)
import Data.Either (Either)
import Data.Enum (enumFromTo)
import Data.Foldable (for_, length)
import Data.Lens.Record (prop)
import Data.Map (Map, filter)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import Game.Board (Board(..), _pieces)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, allDirections)
import Game.Piece (class Piece, APiece(..), Port, eval, getPort, mkPiece)
import Type.Proxy (Proxy(..))

type ProblemDescription = 
  { goal :: APiece
  , title :: String
  , description :: String
  , testCases :: Array (Map CardinalDirection Signal)
  , requiresAutomaticTesting :: Boolean
  , pieceSet :: Set APiece
  , otherRestrictions :: Array
    { name :: String
    , restriction :: Board -> Boolean
    , description :: String
    }
  }

data PieceSpecMismatch
  = DifferentPortConfiguration
    { dir :: CardinalDirection
    , received :: Maybe Port
    , expected :: Maybe Port
    }
  | DifferentPort
    { dir :: CardinalDirection
    , received :: Port
    , expected :: Port
    }
  | FailedTestCase 
    { inputs :: Map CardinalDirection Signal
    , received :: Map CardinalDirection Signal
    , expected :: Map CardinalDirection Signal
    }
  | FailedRestriction
    { name :: String
    , description :: String
    }

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
    FailedRestriction r -> "Failed predicate " <> r.name <> " with message " <> r.description

countPiecesOfType :: forall p. Piece p => Board -> p -> Int
countPiecesOfType (Board board) piece = length $ M.filter (\p -> mkPiece piece == p.piece) board.pieces


solvedBy :: ProblemDescription -> Board -> ExceptT PieceSpecMismatch Aff Boolean
solvedBy problem board = do
  checkSamePorts
  checkTestCases
  checkOtherRestrictions
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
    
    checkOtherRestrictions = for_ problem.otherRestrictions \r ->
      if r.restriction board
        then pure unit
        else throwError $ FailedRestriction { name: r.name, description: r.description }

