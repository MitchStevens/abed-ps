module Component.Instructions where

import Prelude

import Component.Layout.DefaultLayout (defaultLayout)
import Effect.Aff.Class (class MonadAff)
import Halogen (Component, HalogenM, HalogenQ)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH

type State = {}

data Action

component :: forall q i o m. MonadAff m => Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render state = 
    defaultLayout $
      HH.div_ 
        [ HH.h1_ [ HH.text "How to play"]
        , HH.h2_ [ HH.text "Pieces" ]
        , HH.h2_ [ HH.text "Board" ]
        , HH.h2_ [ HH.text "Specification" ]
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval