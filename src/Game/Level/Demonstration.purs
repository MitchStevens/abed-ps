module Game.Level.Demonstration where

import Prelude

import Data.MediaType (MediaType(..))
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

type Demonstration = 
  { title :: String
  , html :: PlainHTML
  }

type VideoDemonstration =
  { title :: String
  , videoUrl :: String
  , description :: String
  }

videoDemonstration :: VideoDemonstration -> Demonstration
videoDemonstration { title, videoUrl, description } = { title, html }
  where
    html =
      HH.div_
        [ HH.video
          [ HP.controls false
          , HP.autoplay true 
          , HP.muted true
          , HP.loop true
          ]
          [ HH.source
            [ HP.src videoUrl
            , HP.type_ (MediaType "video/mp4")
            ] 
          ]
        , HH.text description
        ]