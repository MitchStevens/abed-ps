module Component.Marginalium where

import Prelude

import Control.Monad.Logger.Class (class MonadLogger)
import Control.Monad.State.Class (gets, modify_)
import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff, forkAff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen (HalogenM, liftAff)
import Halogen as H
import Halogen.HTML (HTML, object)
import Halogen.HTML as HH
import Web.DOM (Element)
import Web.HTML (Location)

data Marginalium =
  Glosses String

type Input = 
  { marginalium :: Marginalium
  , displayOn :: Aff (Maybe Element)
  , removeOn :: Aff Unit
  }

type State = 
  { marginalium :: Marginalium
  , displayOn :: Aff (Maybe Element)
  , removeOn :: Aff Unit
  , isShowing :: Boolean
  , pointingAt :: Maybe Element
  }

data Action
  = Initialise
  | Display Element
  | Remove

data Query :: Type -> Type
data Query a

data Output =
  Removed

component :: forall m
  .  MonadAff m 
  => MonadLogger m
  => H.Component Query Input Output m
component = H.mkComponent { eval, initialState, render }
  where 
    initialState { marginalium, displayOn, removeOn } =
      { marginalium, displayOn, removeOn, isShowing: false, pointingAt: Nothing }

    render state =
      HH.div []
        [ renderMarginalium state.marginalium
        ]

    eval = H.mkEval (H.defaultEval
      { handleAction = handleAction
      , initialize = Just Initialise
      , finalize = Just Remove
      }
    )


--handleQuery :: forall slots m a
--  .  MonadAff m
--  => Query a -> HalogenM State Action slots Output m (Maybe a)
--handleQuery _ = pure Nothing

handleAction :: forall slots m
  .  MonadAff m
  => MonadLogger m 
  => Action -> HalogenM State Action slots Output m Unit
handleAction = case _ of
  Initialise -> do
    displayOn <- gets (_.displayOn)
    removeOn <- gets (_.removeOn)
    _ <- H.fork $
      (liftAff displayOn) >>= traverse_ \element -> handleAction (Display element)
    _ <- H.fork $
      liftAff removeOn *> handleAction Remove 
    pure unit
  Display element -> do
    modify_ (_ { isShowing = true, pointingAt = Just element })
  Remove -> do
    H.raise Removed

renderMarginalium :: forall p i. Marginalium -> HTML p i
renderMarginalium = case _ of
  Glosses text -> HH.div_
    [ HH.text text ]