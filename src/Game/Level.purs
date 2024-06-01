module Game.Level where

import Prelude

import Data.Array (zip, zipWith)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, wrap)
import Data.Traversable (traverse)
import Effect (Effect)
import Foreign.Object (Object)
import Game.Board (Board(..))
import Game.Piece.Direction (CardinalDirection)
import Game.GameEvent (GameEventStore)
import Game.Level.RulesEngine (Rule)
import Game.Message (Message, Conversation)
import Game.Piece (Piece(..), idPiece)
import Game.Piece.Signal (Signal(..))
import Prim.Row (class Nub, class Union)
import Record.Unsafe.Union (unsafeUnion)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

newtype Level = Level
  { name :: String
  , goal :: Piece
  , description :: String
  , testCases :: Array (Map CardinalDirection Signal)
  , requiresAutomaticTesting :: Boolean
  , availablePieces :: Array Piece
  , conversation :: Conversation
  , otherRestrictions :: Array
    { name :: String
    , restriction :: Board -> Boolean
    , description :: String
    }
  , unlocksUponCompletion :: Array Level
  , enableBoardSizeChange :: Boolean
  , enableClickAndDragPaths :: Boolean
  }
derive instance Newtype Level _

mkLevel :: forall r1 r2 r3. Union r1 r2 r3 => Newtype Level (Record r3) =>
  Record r1 -> Level
mkLevel level = Level (unsafeUnion level defaultLevel)
  where
    defaultLevel = 
      { name: "default name"
      , goal: idPiece
      , description: "default description"
      , testCases: []
      , requiresAutomaticTesting: false
      , availablePieces: []
      , conversation: (pure unit :: Conversation)
      , otherRestrictions: []
      , unlocksUponCompletion: []
      , enableBoardSizeChange: true
      , enableClickAndDragPaths: true
      }

levelName :: Level -> String
levelName (Level l) = l.name

unlocksUponCompletion :: Level -> Array Level
unlocksUponCompletion (Level l) = l.unlocksUponCompletion

binaryTestInputs :: Array CardinalDirection -> Array (Map CardinalDirection Signal)
binaryTestInputs directions = do
  inputs <- traverse (\_ -> [Signal 0, Signal 1]) directions
  pure $ M.fromFoldable (zip directions inputs)