module Game.PuzzleSuite where

import Prelude

import Data.Array (zip, zipWith)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Traversable (traverse)
import Foreign.Object (Object)
import Game.Board.BoardDeltaStore (BoardDeltaStore)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection, location)
import Game.Message (Message)
import Game.ProblemDescription (ProblemDescription, defaultProblemDescription)
import Game.RulesEngine (Rule)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

type PuzzleSettings =
  { enableBoardSizeChange :: Boolean }

type Puzzle =
  { problemDescription :: ProblemDescription
  , boardDeltaRulesEngine :: Array (Rule BoardDeltaStore Message)
  , conversation :: Array Message
  , settings :: PuzzleSettings
  }

defaultSettings :: PuzzleSettings
defaultSettings =
  { enableBoardSizeChange: true
  }

defaultPuzzle :: Puzzle
defaultPuzzle = 
  { problemDescription: defaultProblemDescription
  , boardDeltaRulesEngine: []
  , conversation: []
  , settings: defaultSettings
  }



type PuzzleSuite = Object Puzzle 

binaryTestInputs :: Array CardinalDirection -> Array (Map CardinalDirection Signal)
binaryTestInputs directions = do
  inputs <- traverse (\_ -> [ff, tt]) directions
  pure $ M.fromFoldable (zip directions inputs)


