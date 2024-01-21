module Guide.Guide where

import Prelude

import Guide.Condition (class Verify, Condition, verifyCondition)
import Guide.Lesson (Lesson(..))
import Control.Monad.Indexed (class IxApplicative, class IxApply, class IxBind, class IxFunctor, class IxMonad, ipure)
import Control.Monad.Reader (class MonadAsk, class MonadReader, Reader, ReaderT, ask, runReaderT)
import Data.Indexed (Indexed(..))
import Data.Tuple (Tuple)
import Data.Typelevel.Num (class Nat, D0, D1)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Aff.Compat (EffectFnAff, EffectFnCanceler(..), mkEffectFn2, mkEffectFn3, runEffectFn2)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (throw)
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


{-
  Guide is a collection of lessons and messages from the guide

-}
type Guide :: Row Condition -> Row Condition -> Type -> Type
type Guide pre post a = ReaderT (String -> Effect Unit) Aff a


say :: forall pre. String -> Guide pre pre Unit
say message = do
  sendMessage <- ask
  liftEffect (sendMessage message)

lesson :: forall pre post. Lesson pre post -> Guide pre post Unit
lesson (Lesson action) = liftEffect action


andThen :: forall a b b' c x y r. Union b r b' => Verify a
  => Guide a b' x -> Guide b c y -> Guide a c y
andThen ab bc = do
  condition <- liftEffect (verifyCondition @a)
  when (not condition) (void ab)
  bc

runGuide :: forall post m a. MonadEffect m => Verify post
  => (String -> Effect Unit) -> Guide () post a -> Aff a
runGuide sendMessage guide = do
  a <- runReaderT guide sendMessage
  liftEffect do
    whenM (liftEffect $ verifyCondition @post) do
      throw "post condition failed!"
  pure a
  
