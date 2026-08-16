module Component.About where

import Prelude

import Capability.Progress (deleteProgress)
import Component.Layout.DefaultLayout (defaultLayout)
import Data.Time.Duration (Milliseconds(..), Seconds(..), fromDuration)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (message)
import Effect.Now (nowTime)
import Halogen (ClassName(..), HalogenM, HalogenQ, defaultEval, modify_)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Web.HTML (window)
import Web.HTML.Window (confirm, localStorage)
import Web.Storage.Storage (clear)


type State = {}

data Action
  = DeleteProgress
  -- | NavigateTo Route

component :: forall q i o m. MonadAff m => H.Component q i o m
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {} 

  render state =  
    defaultLayout $
      HH.div [ HP.class_ (ClassName "about-component") ]
        [ HH.h2_ [ HH.text "About ABED" ]
        , HH.p_
          [ HH.text "Note: I am not a \"\"\"web developer\"\"\". As a result, I don't know CSS and I have no idea how this will look on your browser. Since I know this \"\"game\"\"\" works on my machine, I suggest you play this using:"
          , HH.ul_
            [ HH.li_ [ HH.text "Brave browser, chrome is probably also fine." ]
            , HH.li_ [ HH.text "At least 768px screen width; if you use phone you're gonna have a bad time."]
            ]
          , HH.br_
          , HH.text "This game was originally written in Java in 2015ish, then in Scala a little bit later. This version is written in "
          , HH.a [ HP.href "purescript.org" ] [ HH.text "Purescript" ]
          , HH.text " which can be considered a stricter dialect of Haskell."
          ]

        , HH.h2_ [ HH.text "Who are you?" ]
        , HH.p_
          [ HH.text "Created by Mitch Stevens 🇦🇺"
          , HH.br_
          , HH.text "email: mitchstevens95 at gmail dot com"
          ]

        , HH.h2_ [ HH.text "Why Purescript?" ]
        , HH.p_
          [ HH.text "Gosh I think I started this version back in 2023 so I can't really remember! I think I had a little bit of experience in Purescript from a "
          , HH.a [ HP.href "https://github.com/MitchStevens/GuitarNeck" ] [ HH.text "previous project" ]
          , HH.text " that involved calculating guitar chords on a guitar neck. "
          , HH.text "This was back in 2018, so my choices for front end development in Haskell were:"
          , HH.ol_
            [ HH.li_ [ HH.text "try to get GHCJS to compile Haskell into leviathan JS-Monstrosities (i was never able to figure this out 😔), or" ]
            , HH.li_ [ HH.text "use Elm, or" ]
            , HH.li_ [ HH.text "use Purescript." ]
            ] 
          , HH.text "I was super into Haskell after spending time at the Canberra Functional Programming meetups (died of COV19, RIP), and Elm wasn't Haskell-ish enough for my now refined tastes. "
          , HH.text "Seems like Elm is now somewhat dead and Purescript is ", HH.b_ [ HH.text "DEAD" ], HH.text " dead, so maybe I picked the wrong horse. "
          , HH.br_
          , HH.img [ HP.src "static/images/it-dont-matter-none-of-this-matters.webp", HP.height 300 ]
          ]


        , HH.h2_ [ HH.text "Is this vibe slop?" ]
        , HH.p_
        [ HH.text "NGL, I've been vibe sloppin' away at the front end. I don't care about how CSS classes work, and I refuse to learn because it seems unsatisfying like that time I tried to figure out how magnets work (fundamentally magnets just be like that, for those wondering). "
        , HH.text "Most of the core logic was typed by human fingers, but who knows how long that'll be true. All the code for this site is available on "
        , HH.a [ HP.href "github.com/MitchStevens/abed-ps" ] [ HH.text "GitHub" ]
        , HH.text " for the subset of you interested in that (∅)."
        ]

        , HH.br_
        , HH.button  [ HE.onClick (\_ -> DeleteProgress ) ]
          [ HH.text "Delete all progress" ] 
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o m
  eval = H.mkEval H.defaultEval
    { handleAction = case _ of
        DeleteProgress -> liftEffect do
          confirmDelete <- window >>= confirm "Really delete all progress?"
          when confirmDelete do
            deleteProgress
    }