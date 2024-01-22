module Resources.LevelSuites.TutorialSuites.Guide where

import Prelude

import Data.Typelevel.Num (D0)
import Guide.Condition (NoPieceAt)
import Guide.Guide (Guide, andThen, lesson)
import Resource.LevelSuites.TutorialSuite.Guide (addPieceLesson, removePieceLesson)
  

firstLevelGuide :: Guide () (NoPieceAt D0 D0 ()) Unit
firstLevelGuide = 
  (lesson (removePieceLesson @D0 @D0))
    `andThen` lesson addPieceLesson
