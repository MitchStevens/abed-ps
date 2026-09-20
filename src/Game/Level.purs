module Game.Level where

import Prelude

import Data.Array (zip, zipWith)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Effect (Effect)
import Foreign.Object (Object)
import Game.Direction (CardinalDirection)
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Level.Problem (Problem, defaultProblem)
import Game.Message (Message, Conversation)
import Game.Signal (Base(..), Signal(..), SignalRepresentation(..))
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

type LevelOptions =
  { enableBoardSizeChange :: Boolean
  , compulsory :: Boolean
  , base :: Base
  }

type Level =
  { problem :: Problem
  , options :: LevelOptions
  }

type LevelId = { suiteName :: String, levelName :: String }

defaultLevelOptions :: LevelOptions
defaultLevelOptions =
  { enableBoardSizeChange: true
  , compulsory: false
  , base: Binary
  }

defaultLevel :: Level
defaultLevel =
  { problem: defaultProblem
  --, boardDeltaRulesEngine: []
  --, conversation: pure unit
  , options: defaultLevelOptions
  }

type LevelSuite = Object Level

binaryTestInputs :: Array CardinalDirection -> Array (Frame Signal)
binaryTestInputs directions = do
  inputs <- traverse (\_ -> [zero, one]) directions
  pure $ Frame.fromFoldable zero (zip directions inputs)