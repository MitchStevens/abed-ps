module Game.Piece.Transform.Adapt
  ( adapt
  ) where

import Prelude

import Control.Alternative (guard)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Set as S
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Operation (PieceOperation(..), wireOutputs)
import Game.Piece.Types (Piece(..))
import Game.Piece.Catalogue.Wire (mkWirePiece)
import Game.Port (Port, PortType(..), getPortType, portCapacity)

{-
  rules for adapting:
    if d1 /= d2 then adapt d1 t1 <<< adapt d2 t2 = adapt d2 t2 <<< adapt d1 t1
    adapt is idempotent: adapt d t <<< adapt d t = adapt d t
    adapt d noPort p <= p
    p <= adapt d port p      (for any real port)

  Only single wire pieces adapt: every other piece is returned unchanged.
-}
-- | Adapt `piece` to whatever port its neighbour presents on side `dir`:
-- | `noPort` when the neighbour has none.
adapt :: CardinalDirection -> Port -> Piece -> Piece
adapt dir port piece@(Piece p) = fromMaybe piece do
  outputs <- case p.op of
    Connection connections -> wireOutputs connections
    _ -> Nothing
  let capacity = portCapacity (Frame.index Direction.Left p.ports)
  case dir, getPortType port of
    Direction.Left, _ -> Nothing
    _, Input -> do
      let newOutputs = S.insert dir outputs
      guard (outputs /= newOutputs)
      pure $ mkWirePiece { capacity, outputs: newOutputs }
    _, Output -> Nothing
    _, NoPort -> do
      let newOutputs = S.delete dir outputs
      guard (outputs /= newOutputs && newOutputs /= S.empty)
      pure $ mkWirePiece { capacity, outputs: newOutputs }
