module Component.PuzzleSelect where

import Prelude

import Capability.Navigate (class Navigate, Route(..), navigateTo)
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
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import IO.Progress (PuzzleId, PuzzleProgress(..), getAllPuzzleProgress, puzzleProgress)
import IO.Puzzles (PuzzleSuite, allPuzzles)
import Web.HTML.HTMLDocument.ReadyState (ReadyState(..))


type State = { puzzleProgress :: Map PuzzleId PuzzleProgress }

data Action = Initialise | NavigateTo Route

component :: forall q i o m. MonadAff m => Navigate m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = { puzzleProgress: M.empty } 

  render state =  
    HH.div [ HP.class_ (ClassName "puzzle-select-component") ]
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
        [ HE.onClick (\_ -> NavigateTo (Puzzle suiteName puzzleName)) ]
        [ HH.text puzzleName
        , if M.lookup {suiteName, puzzleName} state.puzzleProgress == Just Completed
            then HH.text "  ✔"
            else HH.text ""
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        Initialise -> do
          puzzleProgress <- liftEffect getAllPuzzleProgress
          log (show puzzleProgress)
          H.modify_ (_ { puzzleProgress = puzzleProgress})
        NavigateTo route -> navigateTo route
    , initialize = Just Initialise
    }



