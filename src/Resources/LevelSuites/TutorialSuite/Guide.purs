module Resources.LevelSuites.TutorialSuites.Guide where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe)
import Data.Typelevel.Undefined (undefined)
import Effect (Effect)
import Game.Location (Location(..))
import Game.Rotation (Rotation(..))
import Guide.Guide (GuideE)

pieceAtRightPort :: GuideE Unit
pieceAtRightPort = undefined

pieceAtLeftPort :: GuideE Unit
pieceAtLeftPort = undefined

pieceInMiddle :: GuideE Unit
pieceInMiddle = undefined

rotatePieceTo :: Location -> Rotation -> GuideE Unit
rotatePieceTo loc rot = undefined

runTests :: GuideE String
runTests = undefined

