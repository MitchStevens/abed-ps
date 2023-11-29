module Game.Level.Problem where

import Prelude

import Capability.ChatServer (sendMessage)
import Control.Alt (alt)
import Control.Monad.Except (class MonadError, ExceptT, lift, throwError)
import Control.Plus (empty)
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
import Game.Expression (Signal(..))
import Game.Direction (CardinalDirection, allDirections)
import Game.Piece (class Piece, APiece(..), PieceId(..), Port, eval, getPort, idPiece)
import Type.Proxy (Proxy(..))
import Web.DOM.ParentNode (QuerySelector(..))

type Problem = 
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



defaultProblem :: Problem
defaultProblem = 
  { goal: idPiece
  , title: "default title"
  , description: "default description"
  , testCases: []
  , requiresAutomaticTesting: false
  , pieceSet: Set.empty
  , otherRestrictions: []
  }


showMismatch :: forall r a. Show a => { received :: a, expected :: a | r } -> String
showMismatch r = "received: " <> show r.received <> ", expected: " <> show r.expected

countPiecesOfType :: Board -> APiece -> Int
countPiecesOfType (Board board) piece = length $ M.filter (\p -> piece == p.piece) board.pieces



