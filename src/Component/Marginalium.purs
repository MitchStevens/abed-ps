module Component.Marginalium where

import Prelude

import Halogen.HTML (object)
import Halogen.HTML as HH
import Web.DOM (Element)
import Web.HTML (Location)

data Marginalium
  = Glosses String -- a short definition or note
  | Drollerie -- an image

{-
  Scheduling:
  - When should marginalia appear?
  - When should marginalia disappear

-} 








type Input = {}

type State = 
  { currentlyShowing :: Array Element
  , 
  }

data Action
  = DisplayMarginalium Marginalia (a -> Element) --
  | RemoveMarginal Element

data Query a
  = AddMarginalia Marginalia

data Output

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where 
    initialState = {}

    render _ = HH.text ""

    eval :: = 
    

  }


handleQuery :: forall m a
  .  MonadAff m
  => MonadLogger m
  => Query a -> HalogenM State Action Slots Output m (Maybe a)
handleQuery = case _ of

handleAction :: forall m
  .  MonadAff m
  => MonadLogger m 
  => Action -> HalogenM State Action Slots Output m Unit
handleAction = case _ of
