module GlobalState where
{- always import qualified as GlobalState, many functions here shadow other functions -}

import Prelude

import Capability.LocalStorage (saveProgress)
import Capability.LocalStorage.LevelProgress (LevelProgress)
import Control.Monad.Reader (class MonadAsk, class MonadReader, ask, asks)
import Control.Monad.Writer (execWriterT, tell)
import Data.Foldable (foldMap, for_)
import Data.FoldableWithIndex (findWithIndex, foldMapWithIndex, forWithIndex_)
import Data.Int (Radix, binary)
import Data.Log.Level (LogLevel(..))
import Data.Maybe (Maybe(..))
import Data.Maybe.First (First(..))
import Data.Newtype (ala, alaF)
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Level (Level(..))
import Game.Level.Suite (LevelId(..))
import Game.Level.Suite as Suite
import Game.Piece.Capacity (Capacity)
import Halogen.HTML (i)
import Resources.LevelSuites (allLevelSuites, getAllLevelProgress)

type GlobalState =
  { levelProgress :: Ref (Object (Object (Maybe LevelProgress)))
  , signalRadix :: Ref Radix
  , logLevel :: Ref LogLevel
  }

initialGlobalState :: Effect GlobalState
initialGlobalState = do
  levelProgress <- Ref.new =<< getAllLevelProgress
  signalRadix <- Ref.new binary
  logLevel <- Ref.new Warn
  pure { levelProgress, signalRadix, logLevel }

reload :: forall m. MonadAsk GlobalState m => MonadEffect m =>
  m Unit
reload = do
  progress <- liftEffect getAllLevelProgress
  asks (_.levelProgress) >>= (liftEffect <<< Ref.write progress)

levelProgress :: forall m. MonadAsk GlobalState m => MonadEffect m => m (Object (Object (Maybe LevelProgress)))
levelProgress =
  asks (_.levelProgress) >>= (liftEffect <<< Ref.read)

setLevelProgress :: forall m. MonadAsk GlobalState m => MonadEffect m =>
  LevelId -> LevelProgress -> m Unit
setLevelProgress levelId@(LevelId { suiteName, levelName }) progress = do

  let o = O.singleton suiteName (O.singleton levelName (Just progress))
  ref <- asks (_.levelProgress)
  liftEffect $ Ref.modify_ (append o)  ref

  liftEffect $ saveProgress levelId progress

lookupLevelId :: forall m. MonadAsk GlobalState m => MonadEffect m =>
  String -> m (Maybe LevelId)
lookupLevelId levelName = do
  progress <- levelProgress
  case findWithIndex (\_ levels -> O.member levelName levels) progress of
    Just { index: suiteName, value } -> pure (Just (LevelId { levelName, suiteName }))
    Nothing -> pure Nothing


signalRadix :: forall m. MonadAsk GlobalState m => MonadEffect m => m Radix
signalRadix = asks (_.signalRadix) >>= (liftEffect <<< Ref.read)

setSignalRadix :: forall m. MonadAsk GlobalState m => MonadEffect m => Radix -> m Unit
setSignalRadix radix = asks (_.signalRadix) >>= (liftEffect <<< Ref.write radix)

logLevel :: forall m. MonadAsk GlobalState m => MonadEffect m => m LogLevel
logLevel = asks (_.logLevel) >>= (liftEffect <<< Ref.read)

setLogLevel :: forall m. MonadAsk GlobalState m => MonadEffect m => LogLevel -> m Unit
setLogLevel radix = asks (_.logLevel) >>= (liftEffect <<< Ref.write radix)