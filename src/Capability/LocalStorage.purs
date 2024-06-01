module Capability.LocalStorage where

import Prelude

import Control.Bind (bindFlipped)
import Data.Maybe (Maybe, maybe)
import Effect (Effect)
import Web.HTML (window)
import Web.HTML.Window (localStorage)
import Web.Storage.Storage (clear, getItem, removeItem, setItem)

{-

-}
class (Show k, Show v, Semigroup v) <= LocalStorage k v where
  itemName :: String
  parseValue :: String -> Maybe v

keyName :: forall @k @v. LocalStorage k v => k -> String
keyName key = itemName @k @v <> "-" <> show key

saveProgress :: forall k v. LocalStorage k v => k -> v -> Effect Unit
saveProgress key value = do
  storage <- window >>= localStorage
  oldValue <- getItem (keyName @k @v key) storage
  let newValue = maybe value (_ <> value) (oldValue >>= parseValue @k)
  setItem (keyName @k @v key) (show newValue) storage

getProgress :: forall k v. LocalStorage k v => k -> Effect (Maybe v)
getProgress key = do
  str <- window >>= localStorage >>= getItem (keyName @k @v key)
  pure (str >>= parseValue @k)

updateProgress :: forall k v. LocalStorage k v => k -> Maybe v -> Effect Unit
updateProgress key = maybe (removeProgress @k @v key) (saveProgress key)

removeProgress :: forall @k @v. LocalStorage k v => k -> Effect Unit
removeProgress key = window >>= localStorage >>= removeItem (keyName @k @v key)

deleteProgress :: Effect Unit
deleteProgress = window >>= localStorage >>= clear