module Component.Piece.Wire
  ( wireComponent
  , renderWireComponent
  ) where

import Prelude

import Component.Piece (PieceComponent, mkPieceComponent)
import Component.Piece.Types as Piece
import Component.Rendering.Wire (renderWire)
import Effect.Class (class MonadEffect)
import Halogen (ComponentHTML)

wireComponent :: forall m. MonadEffect m => PieceComponent m
wireComponent = mkPieceComponent { renderPiece: \st -> [ renderWireComponent st ] }

renderWireComponent :: forall m. Piece.State -> ComponentHTML Piece.Action () m
renderWireComponent st = renderWire st.piece st.portStates
