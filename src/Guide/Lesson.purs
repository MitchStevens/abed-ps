module Guide.Lesson where

import Prelude

import Guide.Condition (class Verify, BoardIsEmpty, CompletionStatusEquals, Condition, NoPieceAt, PieceAt, verifyCondition)
import Data.Tuple (Tuple)
import Data.Typelevel.Num (D0, D1)
import Effect (Effect)
import Effect.Aff.Compat (EffectFnAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Console (error)
import Game.Location (Location(..))
import Type.Row (type (+))

{-
  lessons-:
    - addPiece
    - removePiece
    - movePiece
    - rotation
    - create path
    - using multimeter
    - changing capacity
    - toggleing input ports
    - increasing/decreasing input ports
    - runnning testsCategory
    - undo/redo

-}



{-
  What is a `Lesson`?
    - a lesson contains an action `m Unit`
    - after the action is run, the post condition is verified. An error is thrown if the post condition fails
    - a `Lesson` has pre conditions and post conditions encoded on the type level
    - a lesson can be embedded into a conversation
    - a conversation can also be embeded into a lesson 
    - `lesson1` can be combined with `lesson2` if the post-condition of `lesson1` is equal to or stronger than the preconditions on `lesson2`
-}
newtype Lesson (pre :: Row Condition) (post :: Row Condition) = Lesson (Effect Unit)