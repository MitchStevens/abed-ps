module Game.Piece.WirePiece where

import Prelude

import Control.Alternative (guard)
import Data.Foldable (all, length)
import Data.Int (toNumber)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Port (Capacity(..))
import Game.Piece.Port (Capacity(..), PortType(..), inputPort, isInput, isOutput, outputPort)
import Game.Piece.Port as Port
import Game.Piece.Types (Piece(..), PieceId(..))
import Game.Signal (Signal(..))


{-
  wire pieces must:
  - have exactly 1 input   on the left
  - have at least 1 output
  - send the input signal directly to all of th  outputs
-}
type WirePiece =
  { name :: PieceId
  , capacity :: Capacity
  , outputs :: Set CardinalDirection
  }

wirePiece :: WirePiece -> Piece
wirePiece wire = Piece
  { name: wire.name
  , eval: \inputs -> 
      let signal = fromMaybe (Signal 0) (M.lookup Direction.Left inputs)
      in S.toMap wire.outputs $> signal
  , complexity: Complexity.space (toNumber (length wire.outputs))

  , shouldRipple: true
  , updateCapacity: \_ capacity -> Just (wirePiece (wire { capacity = capacity }))

  , ports: M.insert Direction.Left (inputPort wire.capacity) 
      (S.toMap wire.outputs $> outputPort wire.capacity)

  , updatePort: \dir portType -> case dir, portType of
      Direction.Left, _ -> Nothing
      _, Just Input -> do
          let newOutputs = S.insert dir wire.outputs 
          guard (wire.outputs /= newOutputs)
          pure $ wirePiece (wire { outputs = newOutputs })
      _, Just Output -> Nothing
      _, Nothing -> do
          let newOutputs = S.delete dir wire.outputs 
          guard (wire.outputs /= newOutputs)
          if S.isEmpty newOutputs
            then pure $ wirePiece (wire { outputs = S.singleton Direction.Right} )
            else pure $ wirePiece (wire { outputs = newOutputs })
  }


allWirePieces :: Array Piece
allWirePieces = [ idPiece, leftPiece, rightPiece, superPiece ]

idPiece :: Piece
idPiece = wirePiece
  { name: PieceId "id-piece"
  , capacity: OneBit
  , outputs: S.fromFoldable [ Direction.Right ]
  }

leftPiece :: Piece
leftPiece = wirePiece
  { name: PieceId "left-piece"
  , capacity: OneBit 
  , outputs: S.fromFoldable [Direction.Up]
  }

rightPiece :: Piece
rightPiece = wirePiece 
  { name: PieceId "right-piece"
  , capacity: OneBit
  , outputs: S.fromFoldable [Direction.Down]
  }

superPiece :: Piece
superPiece = wirePiece 
  { name: PieceId "super-piece"
  , capacity: OneBit
  , outputs: S.fromFoldable [Direction.Up, Direction.Right, Direction.Down]
  }
