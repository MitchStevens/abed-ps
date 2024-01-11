module Game.Level where

import Prelude

import Data.Array (zip, zipWith)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Traversable (traverse)
import Foreign.Object (Object)
import Game.Direction (CardinalDirection)
import Game.GameEvent (GameEventStore)
import Game.Level.Problem (Problem, defaultProblem)
import Game.Level.RulesEngine (Rule)
import Game.Message (Message)
import Game.Signal (Signal(..))
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

type LevelOptions =
  { enableBoardSizeChange :: Boolean
  , compulsory :: Boolean }

type Level =
  { problem :: Problem
  , boardDeltaRulesEngine :: Array (Rule GameEventStore Message)
  , conversation :: Array Message
  , options :: LevelOptions
  }

type LevelId = { suiteName :: String, levelName :: String }

defaultLevelOptions :: LevelOptions
defaultLevelOptions =
  { enableBoardSizeChange: true
  , compulsory: false
  }

defaultLevel :: Level
defaultLevel = 
  { problem: defaultProblem
  , boardDeltaRulesEngine: []
  , conversation: []
  , options: defaultLevelOptions
  }

type LevelSuite = Object Level

binaryTestInputs :: Array CardinalDirection -> Array (Map CardinalDirection Signal)
binaryTestInputs directions = do
  inputs <- traverse (\_ -> [Signal 0, Signal 1]) directions
  pure $ M.fromFoldable (zip directions inputs)