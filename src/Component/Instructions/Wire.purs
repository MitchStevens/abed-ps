module Component.Instructions.Wire where

import Prelude

import AppM (AppM)
import Component.Instructions.Adapting as Adapting
import Component.Instructions.InstructionalBoard as InstructionalBoard
import Component.Layout.DefaultLayout (defaultLayout)
import Data.Maybe (Maybe)
import Data.MediaType (MediaType(..))
import Effect.Aff.Class (class MonadAff)
import Halogen (Component, HalogenM, HalogenQ, Slot)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

type VoidF a = Void

type State = {}

type Slots = ( instructionalBoard :: Slot InstructionalBoard.Query InstructionalBoard.Output Unit )

data Action

component :: forall q i o. Component q i o AppM
component = H.mkComponent { eval , initialState , render }
  where
  initialState _ = {}

  render :: State -> H.ComponentHTML Action Slots AppM
  render _ =
    defaultLayout $
      HH.div
        [ HP.id "instructions-component" ]
        [ HH.h1_ [ HH.text "What's this all then?" ]
        , HH.p_
        [ HH.text "You are"
        , HH.text "Pieces have inputs that take binary signals, transform those signals in some way, then output the transformation."

        ]
        , HH.h2_ [ HH.text "Directions: Left, Right, Up, Down" ]
        , HH.p_
        [
        ]
        , HH.h2_ [ HH.text "Placing Pieces" ]
        , HH.p_
        [
        ]
        , HH.h2_ [ HH.text "Adding a piece" ]
        , HH.p_
        [
        ]
        , HH.h2_ [ HH.text "Rotating a piece" ]
        , HH.p_
        [
        ]
        , HH.h2_ [ HH.text "Removing a piece" ]
        , HH.p_
        [
        ]

        , HH.h2_ [ HH.text "Wires" ]
        , HH.p_
          [ HH.text "A wire doesn't do anything to a signal on its own, it just carries it from one piece to another. "
          , HH.text "Use one to connect a piece's output to the next piece's input, or to route a signal around the board to wherever you actually need it." ]
        , HH.p_
          [ HH.text "Click and drag across the board to lay one down: click on a cell, drag through however many cells you want it to pass through, and let go. "
          , HH.text "The wire follows wherever you dragged."
          , HH.figure_
            [ demoVideo "./static/images/demonstrations/single-wire.mp4"
            , HH.figcaption_ [ HH.text "Create wires by clicking and dragging on a tile." ]
            ]
          ]
        , HH.p_
          [ HH.text "A single drag isn't limited to one tile. "
          , HH.text "Keep dragging the mouse through adjacent tiles and the wire will follow, laying itself across as many tiles as you like."
          , HH.figure_
            [ demoVideo "./static/images/demonstrations/long_wire.mp4"
            , HH.figcaption_ [ HH.text "One drag can lay wire across several tiles at once." ]
            ]
          ]
        , HH.p_
          [ HH.text "Drop a piece against the side of a wire that isn't connected to anything yet, and the wire will reach out and connect to it on its own. You'll see it turn into a double-headed arrow, carrying the same signal out in two directions at once."
          , HH.figure_
            [ demoVideo "./static/images/demonstrations/split_long_wire.mp4"
            , HH.figcaption_ [ HH.text "One input can be branched to several outputs." ]
            ]
          ]
        -- The Gates
        -- Not — flips a single input
        -- And, Or, Xor — two inputs (Left and Up), one output (Right)

        , HH.slot_ InstructionalBoard.slot unit InstructionalBoard.component
            { availablePieces: []
            , objectives:
                [ InstructionalBoard.madeAWire
                , InstructionalBoard.madeADoubleLengthWire
                , InstructionalBoard.forkedAWire
                ]
            }
        ]
  
  eval :: forall slots. HalogenQ q Action i ~> HalogenM State Action slots o AppM
  eval = H.mkEval H.defaultEval

-- | A short, silent, looping instructional clip -- same autoplay/muted/loop
-- | convention as Game.Level.Demonstration's videoDemonstration, just
-- | embedded inline in the page instead of behind a "Demonstrate" popup.
demoVideo :: forall p i. String -> HTML p i
demoVideo videoUrl =
  HH.video
    [ HP.controls false
    , HP.autoplay true
    , HP.muted true
    , HP.loop true
    ]
    [ HH.source
        [ HP.src videoUrl
        , HP.type_ (MediaType "video/mp4")
        ]
    ]