module Component.PuzzleSelect where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Capability.Progress (PuzzleProgress(..), savePuzzleProgress)
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
import Game.Puzzle (PuzzleId)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import IO.Puzzles (allPuzzles, getAllPuzzleProgress)


type State = { puzzleProgress :: Map PuzzleId PuzzleProgress }

data Action = Initialise | NavigateTo PuzzleId

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { puzzleProgress: M.empty } 

  render state =  
    HH.div [ HP.id "puzzle-select-component" ]
      [ HH.h1_ [ HH.text "Puzzle Select" ] 
      , HH.div_  do
          Tuple suiteName puzzleSuite <- O.toUnfoldable allPuzzles
          [ HH.h2_ [ HH.text suiteName ]
          , HH.ul_ do
            Tuple puzzleName _ <- O.toUnfoldable puzzleSuite
            [ HH.li_ [ renderPuzzle suiteName puzzleName ] ]
          ]
      ]

    where
    renderPuzzle suiteName puzzleName =
      HH.a
        [ HE.onClick (\_ -> NavigateTo {suiteName, puzzleName}) ]
        [ HH.text puzzleName
        , case M.lookup {suiteName, puzzleName} state.puzzleProgress of
            Just Completed ->  HH.span [ attr DataAttr.progress Completed ]  [ HH.text "  ✔" ]
            Just Incomplete -> HH.span [ attr DataAttr.progress Incomplete ] [ HH.text " ✶" ]
            Nothing -> HH.text ""
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        Initialise -> do
          puzzleProgress <- liftEffect getAllPuzzleProgress
          log (show puzzleProgress)
          H.modify_ (_ { puzzleProgress = puzzleProgress})
        NavigateTo puzzleId -> do
          savePuzzleProgress puzzleId Incomplete
          navigateTo (Puzzle puzzleId.suiteName puzzleId.puzzleName)
    , initialize = Just Initialise
    }



