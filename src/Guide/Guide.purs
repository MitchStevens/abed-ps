module Guide.Guide where

import Prelude

import Control.Monad.Reader (class MonadAsk, class MonadReader, Reader, ReaderT, ask, runReaderT)
import Data.Exists (Exists, runExists)
import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple)
import Data.Typelevel.Num (class Nat, D0, D1)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Aff.Compat (EffectFnAff, EffectFnCanceler(..), mkEffectFn2, mkEffectFn3, runEffectFn2)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
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

type GuideE e = 
  { blocker :: Effect (Maybe e) -- reason that the lesson can't complete
  , action :: e -> ReaderT (String -> Aff Unit) Aff Unit -- actions fire when predicate is `Just e` 
  }

guideBool :: Effect Boolean -> ReaderT (String -> Aff Unit) Aff Unit -> GuideE Unit
guideBool predicate action =
  { blocker: (if _ then Nothing else Just unit) <$> predicate 
  , action: \_ -> action
  }

runGuideE :: forall e. GuideE e -> ReaderT (String -> Aff Unit) Aff Unit
runGuideE {blocker, action} = do
  liftEffect blocker >>= traverse_ \e ->
    action e *> runGuideE {blocker, action}

say :: String -> ReaderT (String -> Aff Unit) Aff Unit
say message = do
  sendMessage <- ask
  liftAff (sendMessage message)




--runGuide :: forall post a. Verify post
--  => (String -> Effect Unit) -> Guide () post a -> Aff a
--runGuide sendMessage guide = do
--  a <- runReaderT guide sendMessage
--  _ <- liftEffect (verifyCondition @post)
--  pure a
  
