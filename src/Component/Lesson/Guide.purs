module Component.Lesson.Tutorial where

import Prelude

import Data.Tuple (Tuple)
import Effect (Effect)
import Effect.Aff.Compat (EffectFnAff)
import Game.Location (Location(..))

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

type BoardIsEmpty = ( boardIsEmpty :: Unit )
type PieceAt x y = ( pieceAt :: Tuple x y )


class Condition c where
  verifyCondition :: Record c -> Effect Boolean

instance Condition BoardIsEmpty where
  verifyCondition _ = pure true




newtype Guide (a :: Condition) (b :: Condition) = Guide (EffectFnAff Unit)
--instance Semigroupoid Guide where
--  compose (Guide step1 :: Guide b c) (Guide step2 :: Guide a b) = Guide 
--instance Category Guide where
--  identity = identityGuide 
--  
--  (Guide step1 :: Guide b c) (Guide step2 :: Guide a b)



--runGuide :: forall a. Guide () a -> Aff Unit
--runGuide (Guide step) = 


foreign import boardIsEmpty :: Effect Boolean


foreign import identityGuide :: forall a. Guide a a

foreign import addPieceGuide :: EffectFnAff Unit

foreign import movePieceGuide :: EffectFnAff Unit

foreign import runTestsGuide :: EffectFnAff Unit

