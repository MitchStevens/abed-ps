module Component.Piece.Wire
  ( wireComponent
  , renderWireComponent
  ) where

import Prelude

import Component.Piece (PieceComponent, mkPieceComponent)
import Component.Piece.Render (ChildSlots)
import Component.Piece.Types as Piece
import Component.Rendering.Wire (renderWire)
import Effect.Aff.Class (class MonadAff)
import Halogen (ComponentHTML)

wireComponent :: forall m. MonadAff m => PieceComponent m
wireComponent = mkPieceComponent { renderPiece: \st -> [ renderWireComponent st ] }

renderWireComponent :: forall m. Piece.State -> ComponentHTML Piece.Action ChildSlots m
renderWireComponent st = renderWire st.portStates
