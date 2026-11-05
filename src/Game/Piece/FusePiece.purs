module Game.Piece.FusePiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Foldable (fold, foldMap)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..), doubleCapacity, halveCapacity)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Complexity as Complexity
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..), PieceId(..), isSimplifiable, mkPieceNoAdapt)
import Game.Port (inputPort, noPort, outputPort)

allFusePieces :: Array Piece
allFusePieces = [ fusePiece, severPiece ]

fusePiece :: Piece
fusePiece = mkFusePiece { inputCapacity: OneBit }

severPiece :: Piece
severPiece = mkSeverPiece { outputCapacity: OneBit }


type FusePiece = { inputCapacity :: Capacity }

mkFusePiece :: FusePiece -> Piece
mkFusePiece { inputCapacity } = mkPieceNoAdapt
  { name: PieceId "fuse-piece"
  , op: Operation.Fuse inputCapacity
  , ports: fromMaybe (pure noPort) do
      outputCapacity <- doubleCapacity inputCapacity
      pure $ Frame.fromFoldable noPort
        [ Tuple Direction.Up    (inputPort inputCapacity)
        , Tuple Direction.Down  (inputPort inputCapacity)
        , Tuple Direction.Right (outputPort outputCapacity)
        ]
  , complexity: Complexity.space 1.0
  , shouldRipple: true
  , updateCapacity: \dir capacity -> case dir of
      Direction.Left -> Nothing
      Direction.Right -> do
        inputCapacity' <- halveCapacity capacity
        guard (inputCapacity' /= inputCapacity)
        pure $ mkFusePiece { inputCapacity: inputCapacity' }
      _ -> do
        guard (capacity /= inputCapacity)
        _ <- doubleCapacity capacity
        pure $ mkFusePiece { inputCapacity: capacity }
  , isSimplifiable: Nothing
  }
  
type SeverPiece = { outputCapacity :: Capacity }

mkSeverPiece :: SeverPiece -> Piece
mkSeverPiece { outputCapacity } = mkPieceNoAdapt
  { name: PieceId "sever-piece"
  , op: Operation.Sever outputCapacity
  , ports: fromMaybe (pure noPort) do
      inputCapacity <- doubleCapacity outputCapacity
      pure $ Frame.fromFoldable noPort
        [ Tuple Direction.Left  (inputPort  inputCapacity)
        , Tuple Direction.Up    (outputPort outputCapacity)
        , Tuple Direction.Down  (outputPort outputCapacity)
        ]
  , complexity: Complexity.space 1.0
  , shouldRipple: true
  , updateCapacity: \dir capacity -> case dir of
      Direction.Right -> Nothing
      Direction.Left -> do
        outputCapacity' <- halveCapacity capacity
        guard (outputCapacity /= outputCapacity')
        pure (mkSeverPiece { outputCapacity: outputCapacity' })
      _ -> do
        guard (capacity /= outputCapacity)
        pure (mkSeverPiece {outputCapacity: capacity})
  , isSimplifiable: Nothing
  }
