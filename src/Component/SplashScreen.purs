module Component.SplashScreen where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Class (class MonadEffect)
import Halogen (HalogenM, HalogenQ)
import Halogen as H
import Halogen.HTML as HH

type Input = Unit

type State = Unit

data Query a

data Action

data Output

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = unit

  render state = HH.text "hello world"

  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: \_ -> pure unit 
    , handleQuery: case _ of
      _ -> pure Nothing
    , initialize: Nothing
    , receive: const Nothing -- :: input -> Maybe action
    }
