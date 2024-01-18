module Component.Lesson.Tutorial where

import Prelude

import Effect (Effect)
import Effect.Aff.Compat (EffectFnAff)

{-
  lessons:
    - addPiece
    - removePiece
    - movePiece
    - create path
    - using multimeter
    - changing capacity
    - toggleing input ports
    - increasing/decreasing input ports
    - runnning tests
    - undo/redo


-}


foreign import addPieceGuide :: EffectFnAff Unit

foreign import movePieceGuide :: EffectFnAff Unit

foreign import runTestsGuide :: EffectFnAff Unit

