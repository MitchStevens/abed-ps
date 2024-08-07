module Component.LevelSelect where

import Prelude

import Capability.LocalStorage.LevelProgress (LevelProgress(..))
import Capability.Navigate (Route(..), navigateTo)
import Component.DataAttribute (attr)
import Component.DataAttribute as DA
import Component.Layout.DefaultLayout (defaultLayout)
import Control.Alternative (guard)
import Control.Monad.Reader (class MonadAsk, class MonadReader, asks)
import Data.FoldableWithIndex (foldMapWithIndex)
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Data.Traversable (foldMap, foldl, for, maximum)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Foreign.Object (Object)
import Foreign.Object as O
import Game.Level.Suite (LevelId(..))
import GlobalState (GlobalState)
import GlobalState as GlobalState
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (HTML, IProp, PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP


type State = { levelProgress :: Object (Object (Maybe LevelProgress)) }

data Action = Initialise | NavigateTo LevelId

component :: forall q i o m. MonadAsk GlobalState m => MonadEffect m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { levelProgress: O.empty }

  render state =  
    defaultLayout $
      HH.div [ HP.id "puzzle-select-component" ]
        [ HH.h1_ [ HH.text "Level Select" ] 
        , HH.div [HP.class_ (ClassName "level-suites")]  do
            Tuple suiteName suiteLevels <- O.toUnfoldable state.levelProgress
            let maybeTotalProgress = join $ maximum suiteLevels

            pure $ HH.div [ HP.class_ (ClassName "level-suite")]
              [ HH.h3
                [ DA.maybeAttr DA.progress maybeTotalProgress ]
                [ HH.text suiteName ]
              , HH.ul_ do
                  Tuple levelName progress <- O.toUnfoldable suiteLevels
                  guard (isJust progress)
                  [ HH.li_ [ renderPuzzle suiteName levelName progress ] ]
              ]
        ]

    where
      renderPuzzle suiteName levelName progress =
        HH.a
          [ HE.onClick (\_ -> NavigateTo (LevelId {suiteName, levelName}))
          , DA.maybeAttr DA.progress progress
          , progressTitle progress
          ]
          [ HH.text levelName ]
      
      progressTitle :: forall p i. Maybe LevelProgress -> IProp (title :: String | p) i
      progressTitle =
        HP.title <<< maybe "Not yet unlocked" show
    
    --renderLevelProgress = case _ of
    --  Just Completed ->  HH.span [ attr DA.progress Completed ]  [ HH.text "  ✔" ]
    --  Just Incomplete -> HH.span [ attr DA.progress Incomplete ] [ HH.text " ✶" ]
    --  Just Unlocked ->  HH.span [ attr DA.progress Unlocked ]  [ ]
    --  Nothing -> HH.text "🔒"
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        Initialise -> do
          progress <- GlobalState.levelProgress
          H.modify_ (_ { levelProgress = progress})
        NavigateTo levelId@(LevelId {suiteName, levelName}) -> do
          GlobalState.setLevelProgress levelId Incomplete
          navigateTo (Level suiteName levelName)
    , initialize = Just Initialise
    }



