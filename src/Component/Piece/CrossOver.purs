module Component.Piece.CrossOver
  ( crossOverComponent
  , renderCrossOverComponent
  ) where

import Prelude

import Component.Piece (PieceComponent, mkPieceComponent)
import Component.Piece.Types as Piece
import Component.Rendering.CrossOver (renderCrossOver)
import Effect.Class (class MonadEffect)
import Halogen (ComponentHTML)

crossOverComponent :: forall m. MonadEffect m => PieceComponent m
crossOverComponent = mkPieceComponent { renderPiece: \st -> [ renderCrossOverComponent st ] }

renderCrossOverComponent :: forall m. Piece.State -> ComponentHTML Piece.Action () m
renderCrossOverComponent st = renderCrossOver st.portStates
