module Resource.LevelSuites.TutorialSuite.Lesson where

import Prelude

import Data.Typelevel.Num (class Nat, D0, D1, D2)
import Game.Location (Location(..))
import Guide.Condition (AnyPieceAt, BoardIsEmpty, CompletionStatusEquals, NoPieceAt, PieceAt, RotationEquals, reflectLocation)
import Guide.Guide (Guide, andThen, lesson, say)
import Guide.Lesson (Lesson)
import Type.Row (type (+))

type ReadyForTesting =
  PieceAt D0 D1 "id-piece" +
  RotationEquals D0 D1 D0 +
  PieceAt D2 D1 "id-piece" +
  RotationEquals D2 D1 D0 +
  ()

foreign import addPieceLeftLesson :: forall r. Lesson
    (NoPieceAt D0 D0 + r)
    (PieceAt D0 D0 "id-piece" + r)



foreign import movePieceLesson :: forall r. Lesson
  (PieceAt D0 D0 "id-piece" + NoPieceAt D0 D1 + r)
  (PieceAt D0 D1 "id-piece" + r)

foreign import runTestsLesson :: forall r. Lesson
  (CompletionStatusEquals "ready-for-testing" + r)
  (CompletionStatusEquals "completed" + r)

-- should never need this, but users be users
foreign import removePieceLessonUnsafe :: forall @x @y r. Location -> Lesson r (NoPieceAt x y + r)

removePieceLesson :: forall @x @y r. Nat x => Nat y
  => Lesson r (NoPieceAt x y + r)
removePieceLesson = removePieceLessonUnsafe (reflectLocation @x @y)

foreign import rotatePieceLessonUnsafe :: forall @x @y r. Location -> Lesson
  (AnyPieceAt x y + r)
  r

rotatePieceLesson :: forall @x @y r. Nat x => Nat y
  => Lesson r (AnyPieceAt x y + r)
removePieceLesson = removePieceLessonUnsafe (reflectLocation @x @y)