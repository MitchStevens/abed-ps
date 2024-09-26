module Game.Level.Problem where

import Prelude

import Control.Alt (alt)
import Control.Monad.Except (class MonadError, ExceptT, lift, throwError)
import Control.Plus (empty)
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Array.NonEmpty as NE
import Data.Either (Either(..), blush)
import Data.Enum (enumFromTo)
import Data.Foldable (fold, foldMap, foldl, for_, length)
import Data.FoldableWithIndex (forWithIndex_)
import Data.Lens.Record (prop)
import Data.List (List(..))
import Data.Map (Map, filter)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Maybe.First (First)
import Data.Newtype (ala)
import Data.Set (Set)
import Data.Set as Set
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff, Milliseconds(..), delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Game.Board (Board(..), _pieces)
import Game.Direction (CardinalDirection)
import Game.Piece (Piece(..), idPiece)
import Game.Signal (Signal(..))
import Type.Proxy (Proxy(..))
import Web.DOM.ParentNode (QuerySelector(..))

type Restriction = 
  { name :: String
  , description :: String
  , restriction :: Board -> Boolean
  }

type Problem = 
  { goal :: Piece
  , title :: String
  , description :: String
  , testCases :: Array (Map CardinalDirection Signal)
  , requiresAutomaticTesting :: Boolean
  , availablePieces :: NonEmptyArray Piece
  , otherRestrictions :: Array Restriction
  }

defaultProblem :: Problem
defaultProblem = 
  { goal: idPiece
  , title: "default title"
  , description: "default description"
  , testCases: []
  , requiresAutomaticTesting: false
  , availablePieces: NE.singleton idPiece
  , otherRestrictions: []
  }