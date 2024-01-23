module Resources.LevelSuites.TutorialSuites.Guide where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe)
import Data.Typelevel.Num (D0)
import Effect (Effect)
--import Guide.Guide (Guide, andThen, lesson)
--import Resource.LevelSuites.TutorialSuite.Lesson (addPieceLesson, removePieceLesson)
  



--firstLevelGuide :: Guide () (NoPieceAt D0 D0 ()) Unit
--firstLevelGuide = 
--  (lesson (removePieceLesson @D0 @D0))
--    `andThen` lesson addPieceLesson
