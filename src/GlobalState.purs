module GlobalState where
{- always import qualified as GlobalState, many functions here shadow other functions -}

import Prelude

import Capability.LocalStorage (saveProgress)
import Capability.LocalStorage.LevelProgress (LevelProgress)
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks)
import Data.Foldable (foldMap)
import Data.FoldableWithIndex (findWithIndex, foldMapWithIndex)
import Data.Maybe (Maybe(..))
import Data.Maybe.First (First(..))
import Data.Newtype (ala, alaF)
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Level.Suite (LevelId(..))
import Game.Level.Suite as Suite


type GlobalState = {
  levelProgress :: Ref (Object (Object (Maybe LevelProgress)))
}

levelProgress :: forall m. MonadAsk GlobalState m => MonadEffect m => m (Object (Object (Maybe LevelProgress)))
levelProgress = do
  ref <- asks (_.levelProgress)
  liftEffect $ Ref.read ref

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
  let First maybeLevelId = foldMapWithIndex (\suiteName levels -> First $ if O.member levelName levels then Just (LevelId { levelName, suiteName }) else Nothing ) progress
  pure maybeLevelId