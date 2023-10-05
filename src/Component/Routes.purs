module Component.Routes where

import Prelude

import Capability.GlobalKeyDown (class GlobalKeyDown)
import Capability.Navigate (class Navigate, Route(..))
import Component.About as About
import Component.Home as Home
import Component.Puzzle as Puzzle
import Component.PuzzleSelect as PuzzleSelect
import Data.Foldable (oneOf)
import Data.Maybe (Maybe(..), fromMaybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class.Console (log)
import Foreign.Object as Object
import Halogen (Component, Slot, mkEval)
import Halogen as H
import Halogen.HTML as HH
import IO.Puzzles (allPuzzles)
import Record as Record
import Routing.Match (Match, lit, str)
import Type.Proxy (Proxy(..))
import Web.UIEvent.KeyboardEvent (KeyboardEvent)

route :: Match Route
route = oneOf
  [ Home <$ lit "home"
  , About <$ lit "about"
  , PuzzleSelect <$ lit "puzzle-select"
  , Puzzle <$> (lit "puzzle" *> str) <*> str
  ]

type Input = {}

type State = 
  { route :: Maybe Route }

data Query a
  = Navigate Route a

data Action


data Output

type Slots =
  ( home          :: forall q. Slot q Void Unit
  , about         :: forall q. Slot q Void Unit
  , puzzleSelect  :: forall q. Slot q Void Unit
  , puzzle        ::           Slot Puzzle.Query Void Unit
  )

component :: forall m.
  MonadAff m =>
  Navigate m =>
  GlobalKeyDown m =>
  Component Query Unit Void m
component = H.mkComponent { eval, initialState, render }
  where
  initialState _ = { route: Just Home }
  
  render :: State -> H.ComponentHTML Action Slots m
  render { route } = case route of
    Just r -> case r of
      Home -> 
        HH.slot_ (Proxy :: _ "home") unit Home.component unit
      About ->
        HH.slot_ (Proxy :: _ "about") unit About.component unit
      PuzzleSelect ->
        HH.slot_ (Proxy :: _ "puzzleSelect") unit PuzzleSelect.component unit
      Puzzle suiteName puzzleName -> fromMaybe (HH.text "coublent find tht roblem" ) do
        puzzleSuite <- Object.lookup suiteName allPuzzles
        input <- Object.lookup puzzleName puzzleSuite
        pure $ HH.slot_ (Proxy :: _ "puzzle") unit Puzzle.component $
          (Record.union { puzzleId: { suiteName, puzzleName } } input :: Puzzle.Input)
    Nothing ->
      HH.div_ [ HH.text "Oh no! That page wasn't found." ]

  eval = mkEval 
    { finalize: Nothing 
    , handleAction: case _ of
        _ -> pure unit
    , handleQuery: case _ of
        Navigate dest a -> do
          { route } <- H.get
          when (route /= Just dest) do
            log "navigate"
            H.modify_ (_ { route = Just dest })
          pure (Just a)
    , initialize: Nothing
    , receive: \_ -> Nothing
    }
--component :: forall m. MonadAff m => H.Component Query Input Output m
--component state
--  where
--  render :: State -> H.ComponentHTML Action ChildSlots m
--  render state@{ route, currentUser } =
--    navbarPageWrapper state $ case route of
--      Nothing ->
--        HH.h1_ [ HH.text "Oh no! That page wasn't found" ]
--      Just Home ->
--        HH.slot_ (Proxy :: _ "home") unit Home.component unit
--          
--      Just Login ->
--        HH.slot_ (Proxy :: _ "login") unit Login.component ({ redirect: true } :: Login.Input)
--          
--      Just Secrets ->
--        authorize currentUser $
--          HH.slot_ (Proxy :: _ "secrets") unit Secrets.component unit