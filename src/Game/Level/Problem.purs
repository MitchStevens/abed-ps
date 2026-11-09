module Game.Level.Problem where

import Prelude

import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Set as S
import Game.Board (Board(..), Cell)
import Game.Frame (Frame)
import Game.Level.Demonstration (Demonstration)
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
  , demonstration :: Maybe Demonstration
  , testCases :: Array (Frame Signal)
  , requiresAutomaticTesting :: Boolean
  , availablePieces :: Set Cell -- doesn't need to be non empty
  , otherRestrictions :: Array Restriction
  }

defaultProblem :: Problem
defaultProblem = 
  { goal: idPiece
  , title: "default title"
  , subtitle: Nothing
  , description: "default description"
  , demonstration: Nothing
  , testCases: []
  , requiresAutomaticTesting: false
  , availablePieces: S.empty
  , otherRestrictions: []
  }