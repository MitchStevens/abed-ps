module Component.Instructions.BoardDiagram where

import Prelude

import AppM (AppM)
import Component.Board as Board
import Control.Monad.Free (liftF)
import Data.Array as A
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map (Map)
import Data.Traversable (for, for_)
import Game.Board (Board(..))
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM(..), Slot, Tell)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Query.ChildQuery (ChildQueryBox)
import Type.Proxy (Proxy(..))

type Input = 
  { board :: Board
  , initialize :: Array (Tell Board.Query)
  , actions :: Map String (Array (Tell Board.Query))
  , description :: String
  }

type State = Input

data Action
  = Initialise Input
  | ButtonClicked (Array (Tell Board.Query))

data Query a 

type Output = Void

type Slots =
  ( board :: Slot Board.Query Board.Output Unit)

slot = Proxy :: Proxy "boardDiagram"

component :: Component Query Input Output AppM
component = H.mkComponent { eval, render, initialState: identity}
  where
    eval = H.mkEval (
      H.defaultEval
        { handleAction = case _ of
          ButtonClicked boardTells -> 
            for_ boardTells (H.tell Board.slot unit)
        , initialize
        }
    )
    
    render :: State -> ComponentHTML Action Slots AppM
    render state = 
      HH.span 
        [ HP.class_ (ClassName "board-diagram") ]
        [ HH.slot_ Board.slot unit Board.component { board: state.board }
        , buttons
        , HH.span 
          [ HP.class_ (ClassName "board-diagram-description")] 
          [ HH.text state.description]
        ]
      where
        buttons =
          HH.div 
            [ HP.class_ (ClassName "board-diagram-pieces") ] $
            A.fromFoldable $ flip mapWithIndex state.actions \text childQueryBox ->
              HH.button
                [ HE.onClick (\_ -> ButtonClicked childQueryBox) ]
                [ HH.text text ]