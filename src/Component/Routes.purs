module Component.Routes where

import Prelude

import Data.Foldable (oneOf)
import Routing.Match (Match, lit, str)

data Route
  = Home
  | About
  | PuzzleSelect
  | Puzzle String

route :: Match Route
route = oneOf
  [ Home <$ lit "home"
  , About <$ lit "about"
  , PuzzleSelect <$ lit "puzzle-select"
  , Puzzle <$> (lit "puzzle" *> str)
  ]

data Input

data State

data Query a = Navigate Route a

data Action


data Output


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