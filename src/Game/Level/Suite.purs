module Game.Level.Suite where

import Prelude

import Data.Foldable (class Foldable, foldr)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Level (Level(..))
import Partial.Unsafe (unsafeCrashWith)

newtype LevelId = LevelId
  { suiteName :: String
  , levelName :: String
  }
derive instance Eq LevelId
derive instance Ord LevelId
instance Show LevelId where
  show (LevelId { suiteName, levelName }) = suiteName <> "-" <> levelName

type LevelSuite = 
  { suiteName :: String
  , levels :: Object Level
  }

toLevelSuite :: forall f. Foldable f => String -> f Level -> LevelSuite
toLevelSuite suiteName levels =
  { suiteName
  , levels: foldr (\(Level l) -> O.insert l.name (Level l)) O.empty levels
  }

lookupLevelId :: LevelSuite -> String -> Maybe LevelId
lookupLevelId { suiteName, levels } levelName =
  if O.member levelName levels
    then Just (LevelId { suiteName, levelName })
    else Nothing
