module GlobalState where

import Data.Maybe (Maybe(..))
import Game.Level.Demonstration (Demonstration)

data GlobalStateAction
  = RequestDemonstration Demonstration

type GlobalState =
  { enableDemonstrations :: Boolean
  , requestedDemonstration :: Maybe Demonstration
  }

initialGlobalState :: GlobalState
initialGlobalState = { enableDemonstrations: true, requestedDemonstration: Nothing }

reduce :: GlobalState -> GlobalStateAction -> GlobalState
reduce state = case _ of
  RequestDemonstration demonstration -> state { requestedDemonstration = Just demonstration }
