module Game.Piece.Catalogue.Fuse where

import Prelude

import Data.Maybe (fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..), doubleCapacity)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..))
import Game.Port (inputPort, noPort, outputPort)

allFusePieces :: Array Piece
allFusePieces = [ fusePiece, severPiece ]

fusePiece :: Piece
fusePiece = mkFusePiece { inputCapacity: OneBit }

severPiece :: Piece
severPiece = mkSeverPiece { outputCapacity: OneBit }


type FusePiece = { inputCapacity :: Capacity }

mkFusePiece :: FusePiece -> Piece
mkFusePiece { inputCapacity } = Piece
  { op: Operation.Fuse inputCapacity
  , ports: fromMaybe (pure noPort) do
      outputCapacity <- doubleCapacity inputCapacity
      pure $ Frame.fromFoldable noPort
        [ Tuple Direction.Up    (inputPort inputCapacity)
        , Tuple Direction.Down  (inputPort inputCapacity)
        , Tuple Direction.Right (outputPort outputCapacity)
        ]
  }
  
type SeverPiece = { outputCapacity :: Capacity }

mkSeverPiece :: SeverPiece -> Piece
mkSeverPiece { outputCapacity } = Piece
  { op: Operation.Sever outputCapacity
  , ports: fromMaybe (pure noPort) do
      inputCapacity <- doubleCapacity outputCapacity
      pure $ Frame.fromFoldable noPort
        [ Tuple Direction.Left  (inputPort  inputCapacity)
        , Tuple Direction.Up    (outputPort outputCapacity)
        , Tuple Direction.Down  (outputPort outputCapacity)
        ]
  }
