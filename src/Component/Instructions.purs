module Component.Instructions where

import Prelude

import AppM (AppM)
import Component.Instructions.Globbing as Globbing
import Component.Layout.DefaultLayout (defaultLayout)
import Data.Maybe (Maybe)
import Effect.Aff.Class (class MonadAff)
import Halogen (Component, HalogenM, HalogenQ)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

type VoidF a = Void

type State = {}

data Action

component :: forall q i o. Component q i o AppM
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render _ = 
    defaultLayout $
      HH.div
        [ HP.id "instructions-component" ]
        [ HH.h1_ [ HH.text "How to play"]
        , HH.h2_ [ HH.text "Pieces" ]
        , HH.h2_ [ HH.text "Board" ]
        , HH.h2_ [ HH.text "Specification" ]
        , HH.slot_ Globbing.slot unit Globbing.component unit
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o AppM
  eval = H.mkEval H.defaultEval