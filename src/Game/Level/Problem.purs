module Game.Level.Problem where

import Prelude

import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Set as S
import Game.Board (Board(..))
import Game.Direction (CardinalDirection)
import Game.Piece (Piece(..), idPiece)
import Game.Signal (Signal)

type Restriction = 
  { name :: String
  , description :: String
  , restriction :: Board -> Boolean
  }

type Problem = 
  { goal :: Piece
  , title :: String
  , subtitle :: Maybe String
  , description :: String
  , testCases :: Array (Map CardinalDirection Signal)
  , requiresAutomaticTesting :: Boolean
  , availablePieces :: Set Piece -- doesn't need to be non empty
  , otherRestrictions :: Array Restriction
  }

defaultProblem :: Problem
defaultProblem = 
  { goal: idPiece
  , title: "default title"
  , subtitle: Nothing
  , description: "default description"
  , testCases: []
  , requiresAutomaticTesting: false
  , availablePieces: S.empty
  , otherRestrictions: []
  }