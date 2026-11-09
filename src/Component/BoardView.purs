-- | A board, only drawn: no events, no editing. Takes a `BoardView` (see
-- | `Component.Board.ViewModel`) and draws every level of it it's given,
-- | nested boards and all.
-- |
-- | Used for whatever `Component.Board` shows but doesn't let you touch: the
-- | boards nested in its slots, and the board around it while zoomed in.
-- | Only redraws when its input actually changes, so the board around it
-- | redrawing (a mouse moving over it, the evaluation tick) costs nothing
-- | here.
module Component.BoardView
  ( Input
  , Layout(..)
  , Query
  , Slots
  , component
  )
  where

import Prelude

import Component.Board.Layout (boardPortSvg, gridLayoutStyle, gridTemplateStyle, pieceGridLayout, portGridLayout)
import Component.Board.ViewModel (BoardView, CellView(..))
import Component.DataAttribute as DA
import Component.Piece.Visual as Visual
import Data.Array (range)
import Data.Array as A
import Data.Foldable (intercalate)
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Game.Direction (CardinalDirection)
import Game.Frame (PieceIndex)
import Game.Frame as Frame
import Game.Location (Location, location)
import Game.PortInfo (PortInfo, clampPortInfo, hasPortInfo)
import Game.Rotation (toDegrees)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, Slot, defaultEval, get, mkComponent, mkEval, put)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))

data Layout
  -- laid out like the board itself: on the full-size grid, with its port
  -- tracks and ports
  = Framed
  -- filling whatever it's put in, without ports: a board in a slot
  | Bare

derive instance Eq Layout

type Input =
  { view :: BoardView
  , layout :: Layout
  , classes :: Array ClassName
  -- a slot to leave out, for the board being zoomed into. `preview` is drawn
  -- there instead, if given
  , hole :: Maybe { location :: Location, preview :: Maybe BoardView }
  }

type State = Input

data Action = Receive Input

data Query a

-- | Each piece by where it is relative to the board this draws, so even
-- | pieces of different nested boards never share a key.
type Slots = ( piece :: Slot Visual.Query Visual.Output PieceIndex )

component :: forall o m. MonadAff m => Component Query Input o m
component =
  mkComponent
    { initialState: identity
    , render
    , eval: mkEval $ defaultEval
        { handleAction = handleAction
        , receive = Just <<< Receive
        }
    }

handleAction :: forall o m. Action -> HalogenM State Action Slots o m Unit
handleAction (Receive input) = do
  old <- get
  when (input /= old) (put input)

render :: forall m. MonadAff m => State -> ComponentHTML Action Slots m
render { view, layout, classes, hole } = case layout of
  Framed -> renderFramed classes hole view
  Bare -> renderBare classes Nil view

-- | On the full-size grid. Its slots are `.piece`s, so they're bordered just
-- | like the interactive board's.
renderFramed
  :: forall m. MonadAff m
  => Array ClassName
  -> Maybe { location :: Location, preview :: Maybe BoardView }
  -> BoardView
  -> ComponentHTML Action Slots m
renderFramed classes hole bv =
  HH.div
    [ HP.classes ([ ClassName "board-view", ClassName "framed" ] <> classes)
    , HP.style (gridTemplateStyle bv.size)
    ]
    (slots <> ports)
  where
    slots = renderSlot <$> range 0 (bv.size - 1) <*> range 0 (bv.size - 1)

    renderSlot i j =
      HH.div
        [ DA.attr DA.location loc
        , HP.class_ (ClassName "piece")
        , HP.style (gridLayoutStyle (pieceGridLayout bv.size (Tuple i j)))
        ]
        contents
      where
        loc = location i j
        contents = case hole of
          Just h | h.location == loc ->
            maybe [] (\p -> [ renderBare [ ClassName "nested", ClassName "fading-out" ] (L.singleton loc) p ]) h.preview
          _ -> maybe [] (\cell -> [ renderCell true (L.singleton loc) cell ]) (M.lookup loc bv.cells)

    ports = A.fromFoldable (mapWithIndex renderPort (Frame.toMapBy hasPortInfo bv.ports))

    renderPort :: CardinalDirection -> PortInfo -> ComponentHTML Action Slots m
    renderPort dir info =
      HH.div
        [ HP.class_ (ClassName "board-port")
        , DA.attr DA.direction dir
        , HP.style (gridLayoutStyle (portGridLayout dir))
        ]
        [ boardPortSvg dir info ]

-- | Filling its box, one track per slot. `index` is where it sits relative to
-- | the board `render` was given.
renderBare :: forall m. MonadAff m => Array ClassName -> PieceIndex -> BoardView -> ComponentHTML Action Slots m
renderBare classes index bv =
  HH.div
    [ HP.classes ([ ClassName "board-view", ClassName "bare" ] <> classes)
    , HP.style $ intercalate "; "
        [ "grid-template-columns: repeat(" <> show bv.size <> ", 1fr)"
        , "grid-template-rows: repeat(" <> show bv.size <> ", 1fr)"
        ]
    ]
    (renderSlot <$> range 0 (bv.size - 1) <*> range 0 (bv.size - 1))
  where
    renderSlot i j =
      HH.div
        [ HP.class_ (ClassName "board-view-slot")
        , HP.style ("grid-column: " <> show (i + 1) <> "; grid-row: " <> show (j + 1))
        ]
        (maybe [] (\cell -> [ renderCell false (index <> L.singleton loc) cell ]) (M.lookup loc bv.cells))
      where
        loc = location i j

-- | `framed` slots get a full `.piece-component` (its background and all),
-- | like the interactive board's pieces; a slot preview just the drawing.
renderCell :: forall m. MonadAff m => Boolean -> PieceIndex -> CellView -> ComponentHTML Action Slots m
renderCell framed index = case _ of
  LeafView { piece, rotation, portStates } ->
    HH.div
      [ HP.class_ (ClassName (if framed then "piece-component" else "board-view-piece")) ]
      [ HH.div
          [ HP.class_ (ClassName "board-view-rotation")
          , HP.style ("transform: rotate(" <> show (toDegrees rotation) <> "deg)")
          ]
          [ HH.slot_ (Proxy :: _ "piece") index Visual.component
              { piece, portStates: map clampPortInfo portStates }
          ]
      ]
  NestedView inner -> renderBare [ ClassName "nested" ] index inner
  TooDeep -> HH.div [ HP.classes [ ClassName "board-view", ClassName "too-deep" ] ] []
