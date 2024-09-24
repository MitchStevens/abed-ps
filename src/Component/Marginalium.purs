module Component.Marginalium
  ( Action(..)
  , Input
  , Output(..)
  , Query
  , State
  , component
  )
  where

import Prelude

import AppM (AppM)
import Component.GameEventLogger (selectGameEvents)
import Component.Marginalia.Types (Marginalia, MarginaliaNode(..), MarginaliumDescription)
import Control.Monad.Logger.Class (class MonadLogger, info)
import Control.Monad.State.Class (gets, modify_)
import Data.DateTime.Instant (Instant)
import Data.Foldable (traverse_)
import Data.List (List(..))
import Data.List.NonEmpty as NE
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Predicate (Predicate)
import Data.Time.Duration (fromDuration)
import Data.UUID.Random (UUIDv4)
import Effect.Aff (Aff, delay, forkAff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (log)
import Game.GameEvent (GameEvent)
import Halogen (ClassName(..), HalogenM, lift, liftAff)
import Halogen as H
import Halogen.HTML (HTML, object)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Store.Connect (subscribe)
import Web.DOM (Element)
import Web.HTML (Location)

type Input = 
  { uuid :: UUIDv4
  , marginalia :: Marginalia
  }

type State =
  { uuid :: UUIDv4
  , description :: Maybe MarginaliumDescription
  , removeOn :: Predicate GameEvent
  , nextMarginalia :: List MarginaliaNode
  --, createdAt :: Instant
  , isDisplaying :: Boolean
  }

data Action
  = Initialise
  | NewGameEvent GameEvent
  | Display
  | Remove

data Query :: Type -> Type
data Query a

data Output
  = TriggerNext Marginalia
  | RemoveThis UUIDv4

component :: H.Component Query Input Output AppM
component = H.mkComponent { eval, initialState, render }
  where 
    initialState { uuid, marginalia } = { uuid, description, removeOn, nextMarginalia: tail, isDisplaying: false }
      where
        {head, tail} = NE.uncons marginalia
        { description, removeOn } = case head of
          Description desc -> { description: Just desc, removeOn: desc.removeOn }
          WaitingOn removeOn -> { description: Nothing, removeOn }

    render state =
      HH.div
        [ HP.class_ (ClassName "marginalium")]
        [ --HH.div [ HP.class_ (ClassName "parchment") ] []
        HH.div_ $
          if state.isDisplaying
            then maybe [] (renderMarginalium >>> pure) state.description
            else []
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

handleAction :: forall slots. Action -> HalogenM State Action slots Output AppM Unit
handleAction = case _ of
  Initialise -> do
    gets (_.description) >>= traverse_ \desc -> do
      _ <- H.fork do
        lift $ info M.empty "start lead timer"
        liftAff $ delay (fromDuration desc.leadTime)
        lift $ info M.empty "end lead timer"
        handleAction Display
      _ <- H.fork do
        liftAff $ delay (fromDuration desc.maxTimeToDisplay)
        handleAction Remove
      pure unit
    subscribe selectGameEvents NewGameEvent

  Display -> do
    modify_ (_ {isDisplaying = true})

  NewGameEvent gameEvent -> do
    log "GOT GAME event from marginalia" 
    pred <- gets (_.removeOn)
    when (unwrap pred gameEvent) do
      gets (_.nextMarginalia >>> NE.fromList) >>= case _ of
        Just marginalia -> do
          H.raise (TriggerNext marginalia)
          handleAction Remove
        Nothing -> do
          handleAction Remove

  Remove -> do
      uuid <- gets (_.uuid)
      H.raise (RemoveThis uuid)

renderMarginalium :: forall p i. MarginaliumDescription -> HTML p i
renderMarginalium description = 
  HH.div_
    [ HH.text description.message ]