module Component.Lesson.Lesson where

import Prelude

import Component.Lesson.Condition (class Verify, Condition, verifyCondition)
import Data.Tuple (Tuple)
import Effect (Effect)
import Effect.Aff.Compat (EffectFnAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Console (error)
import Game.Location (Location(..))

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
newtype Lesson (pre :: Row Condition) (post :: Row Condition) m = Lesson (m Unit)
--instance Semigroupoid Guide where
--  compose (Guide step1 :: Guide b c) (Guide step2 :: Guide a b) = Guide 
--instance Category Guide where
--  identity = identityGuide 
--  
--  (Guide step1 :: Guide b c) (Guide step2 :: Guide a b)

runLesson :: forall post m. MonadEffect m => Verify post => Lesson () post m -> m Unit
runLesson (Lesson step) = do
  step
  liftEffect do
    whenM (liftEffect $ verifyCondition @post) do
      error "post condition failed!"



foreign import boardIsEmpty :: Effect Boolean


foreign import addPieceGuide :: EffectFnAff Unit

foreign import movePieceGuide :: EffectFnAff Unit

foreign import runTestsGuide :: EffectFnAff Unit

