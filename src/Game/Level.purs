module Game.Level where

import Prelude

import Data.Array (zip, zipWith)
import Data.Either (Either)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Set as S
import Data.Traversable (class Foldable, traverse)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Board (Board(..))
import Game.Direction (CardinalDirection)
import Game.Level.Demonstration (Demonstration)
import Game.Level.LevelValidator (LevelValidator)
import Game.Location (Location(..))
import Game.Message (Message, Conversation)
import Game.Piece (Piece(..), idPiece)
import Game.Signal (Base(..), Signal(..), SignalRepresentation(..))
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

type LevelOptions =
  { enableBoardSizeChange :: Boolean
  , compulsory :: Boolean
  , base :: Base
  }

defaultLevelOptions :: LevelOptions
defaultLevelOptions =
  { enableBoardSizeChange: true
  , compulsory: false
  , base: Binary
  }


type Level =
  { goal :: Piece
  , title :: String
  , subtitle :: Maybe String
  , description :: String
  , demonstration :: Maybe Demonstration
  , testCases :: Array (Map CardinalDirection Signal)
  , requiresAutomaticTesting :: Boolean
  , availablePieces :: Set Piece -- doesn't need to be non empty
  , validate :: Board -> LevelValidator
  , options :: LevelOptions
  }

defaultLevel :: Level
defaultLevel =
  { goal: idPiece
  , title: "default title"
  , subtitle: Nothing
  , description: "default description"
  , demonstration: Nothing
  , testCases: []
  , requiresAutomaticTesting: false
  , availablePieces: S.empty
  , validate: \_ -> pure unit
  , options: defaultLevelOptions
  }


type LevelId = { suiteName :: String, levelName :: String }

type LevelSuite = Object Level

toLevelSuite :: forall f. Functor f => Foldable f => f Level -> LevelSuite
toLevelSuite = O.fromFoldable <<< map (\level -> Tuple level.title level)

binaryTestInputs :: Array CardinalDirection -> Array (Map CardinalDirection Signal)
binaryTestInputs directions = do
  inputs <- traverse (\_ -> [zero, one]) directions
  pure $ M.fromFoldable (zip directions inputs)