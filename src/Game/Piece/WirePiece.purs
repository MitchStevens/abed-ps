module Game.Piece.WirePiece where

import Prelude

import Control.Alternative (guard)
import Data.Foldable (all, length)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.APiece (APiece(..), mkPiece)
import Game.Piece.Class (class Piece, PieceId(..), defaultGetCapacity, defaultUpdateCapacity, getCapacity, updateCapacity)
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
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
  complexity _ = Complexity.space 1.0
  
  shouldRipple _ = true
  getCapacity = defaultGetCapacity
  updateCapacity = defaultUpdateCapacity

  getPorts (Wire piece) = M.insert Direction.Left (inputPort piece.capacity) 
    (piece.outputPorts $> outputPort piece.capacity)
  updatePort Direction.Left _ _ = Nothing
  updatePort dir portType (Wire piece) = do
    case portType of
      Just Input -> do
        let newOutputs = M.insert dir unit piece.outputPorts 
        guard (piece.outputPorts /= newOutputs)
        pure $ Wire (piece { outputPorts = newOutputs })
      Just Output -> Nothing
      Nothing -> do
        let newOutputs = M.delete dir piece.outputPorts 
        guard (piece.outputPorts /= newOutputs)
        if M.isEmpty newOutputs
          then pure $ Wire (piece { outputPorts = M.singleton Direction.Right unit} )
          else pure $ Wire (piece { outputPorts = newOutputs })

wirePiece :: PieceId -> Set CardinalDirection -> WirePiece
wirePiece pieceId directions = Wire
  { pieceId
  , capacity: OneBit
  , outputPorts: S.toMap directions
  }

allWirePieces :: Array APiece
allWirePieces = [ idPiece, leftPiece, rightPiece, superPiece ]

idPiece :: APiece
idPiece = mkPiece $ wirePiece (PieceId "id-piece") (S.fromFoldable [ Direction.Right ])

leftPiece :: APiece
leftPiece = mkPiece $ wirePiece (PieceId "left-piece") (S.fromFoldable [Direction.Up])

rightPiece :: APiece
rightPiece = mkPiece $ wirePiece (PieceId "right-piece") (S.fromFoldable [Direction.Down])

superPiece :: APiece
superPiece = mkPiece $ wirePiece (PieceId "super-piece") (S.fromFoldable [Direction.Up, Direction.Right, Direction.Down])
