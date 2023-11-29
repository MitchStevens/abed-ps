module Game.Piece.WirePiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (any)
import Data.Foldable (class Foldable, all, length)
import Data.List (List)
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Expression (Signal(..))
import Game.Piece.APiece (APiece(..), mkPiece)
import Game.Piece.Class (class Piece, PieceId(..), defaultGetCapacity, defaultUpdateCapacity, name)
import Game.Piece.Port (Capacity(..), inputPort, isInput, isOutput, matchingPortType, outputPort, portType)
import Game.Piece.Port as Port


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

  updatePort dir adjPortType (Wire piece) = do
    -- a wire piece has exactly 1 input on the left, no port changes on the left
    guard (dir /= Direction.Left)

    -- if the adjacent port already matches the piece port, no port changes
    let currentPortType = M.lookup dir piece.outputPorts $> Port.Output
    guard (currentPortType /= map matchingPortType adjPortType)

    case adjPortType of
      -- a wire piece has exactly 1 input, additional input ports will not be created
      Just Port.Output -> do Nothing
      Just Port.Input -> do
        let outputPorts = M.insert dir unit piece.outputPorts 
        pure $ Wire (piece {outputPorts = outputPorts})
      Nothing -> do
        let outputPorts = M.delete dir piece.outputPorts 
        -- if removing this port would create a wire with no outputs, add an output to the right
        if M.isEmpty outputPorts
          then pure $ Wire (piece { outputPorts = M.singleton Direction.Right unit} )
          else pure $ Wire (piece { outputPorts = outputPorts })


allWirePieces :: Array APiece
allWirePieces = [ idPiece, leftPiece, rightPiece, superPiece ]

isWirePiece :: PieceId -> Boolean
isWirePiece pieceId = any (\p -> name p == pieceId) allWirePieces

idPiece :: APiece
idPiece = wire (PieceId "id") [ Direction.Right ]

leftPiece :: APiece
leftPiece = wire (PieceId "left") [ Direction.Up ]

rightPiece :: APiece
rightPiece = wire (PieceId "right") [ Direction.Down ]

superPiece :: APiece
superPiece = wire (PieceId "super") [ Direction.Up, Direction.Right, Direction.Down ]


wire :: forall f. Foldable f => PieceId -> f CardinalDirection -> APiece
wire pieceId outputs = mkPiece $ Wire
  { pieceId
  , capacity: OneBit
  , outputPorts: M.fromFoldable $ (\d -> Tuple d unit) <$> (L.fromFoldable outputs)
  }