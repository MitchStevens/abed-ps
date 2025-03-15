module GlobalState where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Game.Board (standardBoard)
import Game.Direction (CardinalDirection)
import Game.GameEvent (BoardEvent, GameEvent(..))
import Game.Signal (Base(..), Signal)
import Halogen.Store.Monad (updateStore)
import Halogen.Store.Select (Selector, select)

data GlobalStateAction
  = NewGameEvent GameEvent
  | SetBase Base
  | NewBoardSize Int

type GlobalState = 
  { lastGameEvent :: GameEvent
  , enableDemonstrations :: Boolean
  , base :: Base
  , boardInputs :: Map CardinalDirection Signal
  , boardSize :: Int
  }

initialGlobalState :: GlobalState
initialGlobalState = 
  { lastGameEvent: GameStarted
  , enableDemonstrations: true 
  , base: Binary
  , boardInputs: M.empty
  , boardSize: 3
  }

reduce :: GlobalState -> GlobalStateAction -> GlobalState
reduce state = case _ of
  NewGameEvent gameEvent -> state { lastGameEvent = gameEvent }
  SetBase base -> state { base = base }
  NewBoardSize boardSize -> state { boardSize = boardSize }

newBoardEvent :: BoardEvent -> GlobalStateAction
newBoardEvent boardEvent = NewGameEvent (BoardEvent boardEvent)

baseSelector :: Selector GlobalState Base
baseSelector = select eq (_.base)

boardSizeSelector :: Selector GlobalState Int
boardSizeSelector = select eq (_.boardSize)