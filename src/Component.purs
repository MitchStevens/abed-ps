module Component where

import Prelude

import Data.String (Pattern(..), Replacement(..))
import Data.String as String

toCssSelectorString :: String -> String
toCssSelectorString = String.toLower <<< String.replace (Pattern " ") (Replacement "-")