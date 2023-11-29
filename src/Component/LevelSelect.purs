module Component.LevelSelect where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Capability.Progress (LevelProgress(..), saveLevelProgress)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Level (LevelId)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import IO.LevelSuites (allLevelSuites, getAllLevelProgress)


type State = { levelProgress :: Map LevelId LevelProgress }

data Action = Initialise | NavigateTo LevelId

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { levelProgress: M.empty } 

  render state =  
    HH.div [ HP.id "puzzle-select-component" ]
      [ HH.h1_ [ HH.text "Puzzle Select" ] 
      , HH.div_  do
          Tuple suiteName levelSuite <- O.toUnfoldable allLevelSuites
          [ HH.h2_ [ HH.text suiteName ]
          , HH.ul_ do
            Tuple levelName _ <- O.toUnfoldable levelSuite
            [ HH.li_ [ renderPuzzle suiteName levelName ] ]
          ]
      ]

    where
    renderPuzzle suiteName levelName =
      HH.a
        [ HE.onClick (\_ -> NavigateTo {suiteName, levelName}) ]
        [ HH.text levelName
        , case M.lookup {suiteName, levelName} state.levelProgress of
            Just Completed ->  HH.span [ attr DataAttr.progress Completed ]  [ HH.text "  ✔" ]
            Just Incomplete -> HH.span [ attr DataAttr.progress Incomplete ] [ HH.text " ✶" ]
            Nothing -> HH.text ""
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        Initialise -> do
          levelProgress <- liftEffect getAllLevelProgress
          log (show levelProgress)
          H.modify_ (_ { levelProgress = levelProgress})
        NavigateTo levelId -> do
          saveLevelProgress levelId Incomplete
          navigateTo (Level levelId.suiteName levelId.levelName)
    , initialize = Just Initialise
    }



