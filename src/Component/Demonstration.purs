module Component.Demonstration where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Game.Level.Demonstration (Demonstration)
import GlobalState (GlobalState, GlobalStateAction)
import Halogen (ClassName(..), Component, HalogenM, HalogenQ, ComponentHTML, defaultEval, mkComponent, mkEval, modify_)
import Halogen.HTML (fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Store.Connect (subscribe)
import Halogen.Store.Monad (class MonadStore)
import Halogen.Store.Select (Selector, select)
import Type.Proxy (Proxy(..))

type Input = Unit

-- | Nothing when nothing's showing; Just d while `d` is up. No separate
-- | "isShowing" flag any more -- there's nothing a Just could mean other
-- | than "showing this".
type State = Maybe Demonstration

-- | No queries any more -- driven entirely by the store (see
-- | `selectRequestedDemonstration`) rather than being told directly by
-- | whichever ancestor happens to own this slot.
data Query a

data Action
  = Initialise
  | NewDemonstrationRequest (Maybe Demonstration)
  | CloseButton

type Output = Void

-- | Never treats two requests as equal, even the same `Demonstration`
-- | clicked twice in a row -- clicking "Show me" again while the popup is
-- | closed always has to reopen it, and `Demonstration` carries a
-- | `PlainHTML`, which has no `Eq` instance to compare structurally anyway.
selectRequestedDemonstration :: Selector GlobalState (Maybe Demonstration)
selectRequestedDemonstration = select (\_ _ -> false) (_.requestedDemonstration)

component :: forall m. MonadAff m => MonadStore GlobalStateAction GlobalState m => Component Query Input Output m
component = mkComponent { initialState, eval, render }
  where
    initialState :: Input -> State
    initialState _ = Nothing

    eval :: HalogenQ Query Action Input ~> HalogenM State Action () Output m
    eval = mkEval $ defaultEval
      { handleAction = case _ of
          Initialise ->
            subscribe selectRequestedDemonstration NewDemonstrationRequest
          NewDemonstrationRequest demonstration ->
            modify_ (const demonstration)
          CloseButton ->
            modify_ (const Nothing)
      , initialize = Just Initialise
      }

    render :: State -> ComponentHTML Action () m
    render state = case state of
      Just demonstration ->
        HH.div
          [ HP.id "demonstration-component" ]
          [ HH.div_
            [ HH.h2_ [ HH.text demonstration.title ]
            , fromPlainHTML demonstration.html
            , HH.button
              [ HE.onClick (\_ -> CloseButton) ]
              [ HH.text "Close demonstration" ]
            ]
          , HH.div [ HP.class_ (ClassName "parchment")] []
          ]
      Nothing -> HH.text ""

slot = Proxy :: Proxy "demonstration"
