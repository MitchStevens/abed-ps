module Component.Home where

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Component.Layout.DefaultLayout (defaultLayout)
import Effect.Class (class MonadEffect)
import Halogen (ClassName(..), ComponentHTML, HalogenM, HalogenQ)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

type State = Unit

data Action
  = NavigateTo Route

-- | The six gate glyphs (see dist/static/images/*-piece.png) rendered as a
-- | quiet divider between the title and the menu -- reads as "this is a
-- | game about logic circuits" without a word of explanation.
pieceGlyphs :: Array String
pieceGlyphs = [ "and", "or", "not", "xor", "fuse", "sever" ]

component :: forall q i o m. MonadEffect m => H.Component q i o m
component = H.mkComponent { eval, initialState, render }
  where
  initialState _ = unit

  render :: forall s. State -> ComponentHTML Action s m
  render _ = defaultLayout $
    HH.div
      [ HP.id "home-component" ]
      [ HH.p
          [ HP.class_ (ClassName "tagline") ]
          [ HH.text "Logic circuits, bound in old parchment." ]
      , HH.div
          [ HP.class_ (ClassName "piece-row") ]
          (map renderGlyph pieceGlyphs)
      , HH.nav
          [ HP.class_ (ClassName "menu") ]
          [ menuItem LevelSelect "Choose a level" "Pick up where you left off"
          , menuItem Instructions "How to play" "Learn the pieces and the goal"
          , menuItem About "About" "Who made this, and why"
          ]
      ]
    where
    renderGlyph name =
      HH.img
        [ HP.src ("static/images/" <> name <> "-piece.png")
        , HP.class_ (ClassName "piece-glyph")
        , HP.alt (name <> " piece")
        ]

    menuItem route label description =
      HH.a
        [ HE.onClick (\_ -> NavigateTo route)
        , HP.class_ (ClassName "menu-item")
        ]
        [ HH.span [ HP.class_ (ClassName "menu-label") ] [ HH.text label ]
        , HH.span [ HP.class_ (ClassName "menu-description") ] [ HH.text description ]
        ]

  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        NavigateTo route -> navigateTo route
    }
