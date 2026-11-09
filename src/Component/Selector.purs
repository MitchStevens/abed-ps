module Component.Selector where

import Prelude

import Component.Board.ViewModel (maxDepth, staticSource, viewBoard)
import Component.BoardView as BoardView
import Component.DataAttribute as DA
import Component.Piece.Visual as Visual
import Data.Array as A
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..))
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Set as S
import Effect.Aff.Class (class MonadAff)
import Game.Board (Cell(..), cellId)
import Game.Piece (defaultPortInfo)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, HalogenQ, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))

type Input = { availablePieces :: Set Cell }

type State = Input

-- | Keyed by position in the selector.
type Slots =
  ( piece :: H.Slot Visual.Query Visual.Output Int
  , boardView :: H.Slot BoardView.Query Void Int
  )

data Action
  = AddPiece Cell
  | PieceDropped Cell

data Query a

type Output = Action

component :: forall m. MonadAff m => Component Query Input Output m
component = mkComponent { initialState: identity, eval, render }

eval :: forall m. MonadAff m => HalogenQ Query Action Input ~> HalogenM State Action Slots Output m
eval = mkEval
  { handleAction: \action -> H.raise action
  , handleQuery: \_ -> pure Nothing
  , receive: \_ -> Nothing
  , initialize: Nothing
  , finalize: Nothing
  }

render :: forall m. MonadAff m => State -> ComponentHTML Action Slots m
render { availablePieces } =
  if S.isEmpty availablePieces
    then HH.text ""
    else
      HH.div
        [ HP.id "selector-component" ]
        [ HH.h2_ [ HH.text "Available pieces"]
        , HH.span
          [ HP.class_ (ClassName "pieces") ]
          (mapWithIndex renderAvailablePiece (A.fromFoldable availablePieces))
        ]
  where
    renderAvailablePiece index cell =
      HH.div
        [ DA.attr DA.availablePiece (cellId cell)
        , HP.draggable true
        , HP.classes [ ClassName "available-piece" ]
        , HE.onDragEnd (\_ -> PieceDropped cell)
        , HE.onClick (\_ -> AddPiece cell)
        ]
        [ renderCell index cell
        , HH.text (show (cellId cell))
        ]

    renderCell index = case _ of
      Leaf piece -> HH.slot_ (Proxy :: _ "piece") index Visual.component
        { piece, portStates: defaultPortInfo piece }
      Nested board -> HH.slot_ (Proxy :: _ "boardView") index BoardView.component
        { view: viewBoard staticSource maxDepth Nil board
        , layout: BoardView.Bare
        , classes: [ ClassName "nested" ]
        , hole: Nothing
        }

slot :: Proxy "selector"
slot = Proxy