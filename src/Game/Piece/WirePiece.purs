module Game.Piece.WirePiece where

import Prelude

import Control.Alternative (guard)
import Data.Foldable (all, length)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.APiece (APiece(..), mkPiece)
import Game.Piece.Class (class Piece, PieceId(..), defaultGetCapacity, defaultUpdateCapacity, getCapacity, updateCapacity)
import Game.Piece.Port (Capacity(..), PortType(..), inputPort, isInput, isOutput, outputPort)
import Game.Piece.Port as Port
import Game.Signal (Signal(..))


{-
  wire pieces must:
  - have exactly 1 input   on the left
  - have at least 1 output
  - send the input signal directly to all of th  outputs
-}
newtype WirePiece = Wire
  { pieceId :: PieceId
  , capacity :: Capacity
  , outputPorts :: Map CardinalDirection Unit
  }
derive instance Newtype WirePiece _

instance Piece WirePiece where
  name (Wire piece) = piece.pieceId
  eval (Wire piece) inputs = piece.outputPorts $> signal
    where signal = fromMaybe (Signal 0) (M.lookup Direction.Left inputs)
  getCapacity = defaultGetCapacity
  updateCapacity = defaultUpdateCapacity
  getPorts (Wire piece) = M.insert Direction.Left (inputPort piece.capacity) 
    (piece.outputPorts $> outputPort piece.capacity)
  updatePort dir port (Wire piece) = do
    guard (dir /= Direction.Left)
    guard (all (eq Input) port)
    let outputPorts = maybe (M.delete dir) (\_ -> M.insert dir unit) port $ piece.outputPorts 
    if M.isEmpty outputPorts
      then pure $ Wire (piece { outputPorts = M.singleton Direction.Right unit} )
      else pure $ Wire (piece { outputPorts = outputPorts })

allWirePieces :: Array APiece
allWirePieces = [ idPiece ]

idPiece :: APiece
idPiece = mkPiece $ Wire
  { pieceId: PieceId "id"
  , capacity: OneBit
  , outputPorts: M.fromFoldable [ Tuple Direction.Right unit ] 
  }