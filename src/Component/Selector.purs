module Component.Selector where

import Prelude

import Component.DataAttribute (availablePiece)
import Component.DataAttribute as DA
import Component.Piece as Piece
import Component.Rendering.Piece (renderPiece)
import Data.Array as A
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Maybe (Maybe(..))
import Game.Location (location)
import Game.Piece (Piece(..), PieceId(..), name)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, HalogenQ, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent)

type Input = { availablePieces :: NonEmptyArray Piece }

type State = Input

data Action
  = AddPiece PieceId
  | PieceDropped PieceId
  {-
    the sidebar creates little icons using the same piece rendering as pieces. the type of HTML used in piece rendering is:
      `ComponentHTML Piece.Action s m`
    
    When the sidebar renders the little icons, it requires HTML of type
      `ComponentHTML Sidebar.Action s m`
    
    We use the function `mapActionOverHTML :: (a -> a') -> ComponentHTML a s m -> ComponentHTML a' s m` to convert between the two HTML types, but this requires a mapping between between piece actions and sidebar actions. The simplest such function is:
      (\_ -> DoNothing) :: Piece.Action -> Sidebar.Action)
  -}
  | DoNothing

data Query a

type Output = Action

component :: forall m. Component Query Input Output m
component = mkComponent { initialState: identity, eval, render }

eval :: forall m. HalogenQ Query Action Input ~> HalogenM State Action () Output m
eval = mkEval
  { handleAction: \action -> H.raise action
  , handleQuery: \_ -> pure Nothing
  , receive: \_ -> Nothing
  , initialize: Nothing
  , finalize: Nothing
  }

render :: forall m. State -> ComponentHTML Action () m
render { availablePieces } = 
  HH.div 
    [ HP.id "selector-component" ]
    [ HH.span
      [ HP.class_ (ClassName "pieces") ]
      (renderAvailablePiece <$> (A.fromFoldable availablePieces))
    , HH.h2_ [ HH.text "Available pieces"]
    ]
  where
    renderAvailablePiece piece =
      HH.div 
        [ DA.attr DA.availablePiece pieceId
        , HP.draggable true
        , HP.classes [ ClassName "available-piece" ]
        , HE.onDragEnd (\_ -> PieceDropped pieceId)
        , HE.onClick (\_ -> AddPiece pieceId)
        ]
        [ mapActionOverHTML (\_ -> DoNothing) (renderPiece (Piece.initialState { piece, location: location 0 0 }))
        , HH.text (show pieceId) 
        ]
      where
        pieceId = name piece

slot :: Proxy "selector"
slot = Proxy