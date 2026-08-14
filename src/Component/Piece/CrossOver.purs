module Component.Piece.CrossOver
  ( crossOverComponent
  , renderCrossOverComponent
  ) where

import Prelude

import Component.Piece (PieceComponent, mkPieceComponent)
import Component.Piece.Render (ChildSlots)
import Component.Piece.Types as Piece
import Component.Rendering.CrossOver (renderCrossOver)
import Effect.Aff.Class (class MonadAff)
import Halogen (ComponentHTML)

crossOverComponent :: forall m. MonadAff m => PieceComponent m
crossOverComponent = mkPieceComponent { renderPiece: \st -> [ renderCrossOverComponent st ] }

renderCrossOverComponent :: forall m. Piece.State -> ComponentHTML Piece.Action ChildSlots m
renderCrossOverComponent st = renderCrossOver st.portStates
