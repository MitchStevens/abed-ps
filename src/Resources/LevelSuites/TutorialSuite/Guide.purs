module Resource.LevelSuites.TutorialSuite.Guide where

import Data.Typelevel.Num (D0, D1)
import Guide.Condition (BoardIsEmpty, CompletionStatusEquals, PieceAt, NoPieceAt)
import Guide.Lesson (Lesson)
import Type.Row (type (+))

foreign import addPieceGuide :: forall r. Lesson
    (BoardIsEmpty + r)
    (PieceAt D0 D0 "id-piece" + r)

foreign import movePieceGuide :: forall r. Lesson
  (PieceAt D0 D0 "id-piece" + NoPieceAt D0 D1 + r)
  (PieceAt D0 D1 "id-piece" + r)

foreign import runTestsGuide :: forall r. Lesson
  (CompletionStatusEquals "ready-for-testing" + r)
  (CompletionStatusEquals "completed" + r)