module Component.LevelSelect where

import Prelude

import Capability.Navigate (Route(..), navigateTo, level)
import Capability.Navigate as Navigate
import Capability.Progress (LevelProgress(..), saveLevelProgress)
import Component.DataAttribute (attr)
import Component.DataAttribute as DA
import Component.DataAttribute as DataAttr
import Component.Layout.DefaultLayout (defaultLayout)
import Data.Array as A
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Data.Traversable (foldMap, for)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Level (LevelId, LevelSuite)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML, ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Resources.LevelSuites (allLevelSuites, getAllLevelProgress)


type State = { levelProgress :: Map LevelId LevelProgress }

data Action = Initialise | NavigateTo LevelId

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
    initialState _ = { levelProgress: M.empty } 

    render :: State -> ComponentHTML Action () m
    render state =  
      defaultLayout $
        HH.div [ HP.id "puzzle-select-component" ]
          [ HH.h1_ [ HH.text "Level Select" ] 
          , HH.div [HP.id "level-suites" ] (A.fromFoldable (mapWithIndex renderLevelSuite allLevelSuites))
          ]


      where
        renderLevelSuite :: String -> LevelSuite -> ComponentHTML Action () m
        renderLevelSuite suiteName levelSuite =
          HH.div
            [ HP.class_ (ClassName "level-suite")]
            [ HH.h2_
              [ HH.text suiteName
              , renderLevelProgress maybeTotalProgress
              ]
            , HH.ul_ do
              Tuple levelName _ <- O.toUnfoldable levelSuite
              [ HH.li_ [ renderPuzzle suiteName levelName ] ]
            ]
          where
            maybeTotalProgress = foldMap (\levelName -> M.lookup {suiteName, levelName} state.levelProgress) (O.keys levelSuite :: Array String)

        renderPuzzle suiteName levelName =
          HH.a
            [ HE.onClick (\_ -> NavigateTo {suiteName, levelName}) ]
            [ HH.text levelName
            , renderLevelProgress (M.lookup {suiteName, levelName} state.levelProgress)
            ]

        renderLevelProgress maybeProgress = case maybeProgress of
          Just Completed ->  HH.span [ attr DataAttr.progress Completed ]  [ HH.text "  ✔" ]
          Just Incomplete -> HH.span [ attr DataAttr.progress Incomplete ] [ HH.text " ✶" ]
          Nothing -> HH.text ""
    
    eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
    eval = H.mkEval H.defaultEval
      { handleAction = case _ of
          Initialise -> do
            progress <- liftEffect getAllLevelProgress
            log (show progress)
            H.modify_ (_ { levelProgress = progress})
          NavigateTo levelId -> do
            saveLevelProgress levelId Incomplete
            navigateTo (level levelId)
      , initialize = Just Initialise
      }
