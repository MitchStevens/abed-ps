module Web.Animation (
    WebAnimation,
    module Web.Animation.Keyframe,
    animate,
    cancel,
    finish,
    play,
    pause,
    updatePlaybackRate,
    reverse,
    persist
) where

import Prelude

import Web.DOM.Element (Element)
import Web.Animation.Keyframe
import Effect (Effect)

foreign import data WebAnimation :: Type

foreign import animate :: Element -> Array Keyframe -> Int -> Effect WebAnimation

foreign import cancel :: WebAnimation -> Effect Unit
foreign import finish :: WebAnimation -> Effect Unit
foreign import play :: WebAnimation -> Effect Unit
foreign import pause :: WebAnimation -> Effect Unit
foreign import updatePlaybackRate :: WebAnimation -> Number -> Effect Unit
foreign import reverse :: WebAnimation -> Effect Unit
foreign import persist :: WebAnimation -> Effect Unit