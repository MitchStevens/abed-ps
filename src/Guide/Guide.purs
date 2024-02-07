module Guide.Guide where

import Prelude

import Control.Monad.Reader (class MonadAsk, class MonadReader, class MonadTrans, Reader, ReaderT, ask, lift, runReaderT)
import Control.Monad.Rec.Class (class MonadRec, Step(..), tailRecM)
import Control.Monad.Writer (class MonadTell)
import Data.Foldable (class Foldable, foldM, traverse_)
import Data.List (List)
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (class Traversable)
import Data.Tuple (Tuple)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (throw)
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


{-
  Guide is a collection of lessons and messages from the guide
  speaking messages is effectful and needs to be injected later


  A guide will run over and over again until it's loop invariant (called condition) is false. in a different language this would be:
    `while condition { action }`

  We can compose two

  {P}while A do S done{~A ^ P}   ^   {Q}while B do T done{~B ^ Q}





-}



newtype GuideM m a = Guide (ReaderT (String -> m Unit) m a)
derive newtype instance Functor m => Functor (GuideM m)
derive newtype instance Apply m => Apply (GuideM m)
derive newtype instance Applicative m => Applicative (GuideM m)
derive newtype instance Bind m => Bind (GuideM m)
derive newtype instance Monad m => Monad (GuideM m)
derive newtype instance Monad m => MonadAsk (String -> m Unit) (GuideM m)
derive newtype instance MonadEffect m => MonadEffect (GuideM m)
derive newtype instance MonadRec m => MonadRec (GuideM m)
instance MonadTrans GuideM where
  lift ma = Guide (lift ma)
instance Monad m => MonadTell String (GuideM m) where
  tell msg = do
    say <- ask
    lift $ say msg

runGuide :: forall m a. GuideM m a -> (String -> m Unit) -> m a
runGuide (Guide guide) say = runReaderT guide say