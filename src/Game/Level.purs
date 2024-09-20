module Game.Level where

import Prelude

import Component.Marginalia.Types (Marginalia)
import Data.Array (zip, zipWith)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Effect (Effect)
import Foreign.Object (Object)
import Game.Direction (CardinalDirection)
import Game.Level.Problem (Problem, defaultProblem)
import Game.Message (Message, Conversation)
import Game.Signal (Signal(..))
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

type LevelOptions =
  { enableBoardSizeChange :: Boolean
  , compulsory :: Boolean
  , tutorial :: Maybe (Effect Unit) 
   }

type Level =
  { problem :: Problem
  --, boardDeltaRulesEngine :: Array (Rule GameEventStore Message)
  --, conversation :: Conversation
  , marginalia :: Array Marginalia
  , options :: LevelOptions
  }

type LevelId = { suiteName :: String, levelName :: String }

defaultLevelOptions :: LevelOptions
defaultLevelOptions =
  { enableBoardSizeChange: true
  , compulsory: false
  , tutorial: Nothing
  }

defaultLevel :: Level
defaultLevel = 
  { problem: defaultProblem
  --, boardDeltaRulesEngine: []
  --, conversation: pure unit
  , marginalia: []
  , options: defaultLevelOptions
  }

type LevelSuite = Object Level

binaryTestInputs :: Array CardinalDirection -> Array (Map CardinalDirection Signal)
binaryTestInputs directions = do
  inputs <- traverse (\_ -> [Signal 0, Signal 1]) directions
  pure $ M.fromFoldable (zip directions inputs)