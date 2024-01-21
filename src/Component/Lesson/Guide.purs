module Component.Lesson.Tutorial where

import Prelude

import Component.Lesson.Condition (class Verify, BoardIsEmpty, CompletionStatusEquals, Condition, ExistsPieceAt, NoPieceAt, verifyCondition)
import Data.Tuple (Tuple)
import Data.Typelevel.Num (class Nat, D0, D1)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Aff.Compat (EffectFnAff, EffectFnCanceler(..), mkEffectFn2, mkEffectFn3, runEffectFn2)
import Effect.Class (class MonadEffect, liftEffect)
import Game.Location (Location(..))
import Prim.Row (class Union)

{-
  lessons:
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



newtype Guide :: Row Condition -> Row Condition -> Type
newtype Guide pre post = Guide (Effect Unit)

--runGuide :: forall post. Guide () post -> Aff Unit
--runGuide (Guide guide) = liftEffect guide

andThen :: forall a b c r m. Union b r b' => Verify a => MonadEffect m
  => Guide a b' m -> Guide b c m -> Guide a c m
andThen (Guide ab) (Guide bc) = Guide do
    condition <- verifyCondition @a
    when (liftEffect (not condition)) ab
    bc

foreign import addPieceGuide :: forall r. 
  Guide 
    ("" :: BoardIsEmpty | r)
    ("" :: ExistsPieceAt D0 D0 | r)

foreign import movePieceGuide :: forall r. 
  Guide
    ("" :: ExistsPieceAt D0 D0, "" :: NoPieceAt D0 D1 | r)
    ("" :: ExistsPieceAt D0 D1 | r)

foreign import runTestsGuide :: forall r.
  Guide
    ("" :: CompletionStatusEquals "ready-for-testing" | r)
    ("" :: CompletionStatusEquals "completed" | r)

