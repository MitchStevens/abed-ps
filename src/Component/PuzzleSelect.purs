module Component.PuzzleSelect where

import Prelude

import Capability.Navigate (class Navigate, Route(..), navigateTo)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Foreign.Object as O
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import IO.Puzzles (puzzles)


type State = {}

data Action = NavigateTo Route

component :: forall q i o m. MonadAff m => Navigate m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render state =  
    HH.div [ HP.class_ (ClassName "puzzle-select-component") ]
      [ HH.h1_ [ HH.text "Puzzle Select" ]
      , HH.ul_ $
        flip O.foldMap puzzles \name input ->
          [ HH.li_
            [ HH.a
              [ HE.onClick (\_ -> NavigateTo (Puzzle name)) ]
              [ HH.text name ]
            ]
          ]
      ]
          
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        NavigateTo route -> navigateTo route



    }