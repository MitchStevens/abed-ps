module Game.Piece.FusePiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Foldable (fold, foldMap)
import Data.Int.Bits (and, or, shl, shr)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece.Complexity as Complexity
import Game.Piece.Port (Capacity(..), doubleCapacity, halveCapacity, inputPort, outputPort, toInt)
import Game.Piece.Types (Piece(..), PieceId(..))
import Game.Signal (Signal(..))

allFusePieces :: Array Piece
allFusePieces = [ fusePiece, severPiece ]

fusePiece :: Piece
fusePiece = mkFusePiece { inputCapacity: OneBit }


severPiece :: Piece
severPiece = mkSeverPiece { outputCapacity: OneBit }

--------------------------


type FusePiece = { inputCapacity :: Capacity }

mkFusePiece :: FusePiece -> Piece
mkFusePiece { inputCapacity } = Piece
  { name: PieceId "fuse-piece"
  , eval: \inputs -> 
      let high = fold (M.lookup Direction.Up inputs)
          low  = fold (M.lookup Direction.Down inputs)
      in M.singleton Direction.Right (fuseSignals inputCapacity high low)
  , complexity: Complexity.space 1.0

  , shouldRipple: false
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
  
  , ports: fromMaybe M.empty do
      outputCapacity <- doubleCapacity inputCapacity
      pure $ M.fromFoldable
        [ Tuple Direction.Up    (inputPort inputCapacity)
        , Tuple Direction.Down  (inputPort inputCapacity)
        , Tuple Direction.Right (outputPort outputCapacity)
        ]
  , updatePort: \_ _ -> Nothing
  }
  
fuseSignals :: Capacity -> Signal -> Signal -> Signal
fuseSignals inputCapacity (Signal high) (Signal low) = Signal (shl high n `or` (low `and` (shl 1 n - 1)))
  where
    n = toInt inputCapacity


type SeverPiece = { outputCapacity :: Capacity }

mkSeverPiece :: SeverPiece -> Piece
mkSeverPiece { outputCapacity } = Piece
  { name: PieceId "sever-piece"
  , eval: \inputs ->
      let Tuple high low = foldMap (severSignal outputCapacity) (M.lookup Direction.Left inputs)
      in M.fromFoldable
        [ Tuple Direction.Up high
        , Tuple Direction.Down low
        ]
  , complexity: Complexity.space 1.0

  , shouldRipple: false
  , updateCapacity: \dir capacity -> case dir of
      Direction.Right -> Nothing
      Direction.Left -> do
        outputCapacity' <- halveCapacity capacity
        guard (outputCapacity /= outputCapacity')
        pure (mkSeverPiece { outputCapacity: outputCapacity' })
      _ -> do
        guard (capacity /= outputCapacity)
        pure (mkSeverPiece {outputCapacity: capacity})
  
  , ports: fromMaybe M.empty do
      inputCapacity <- doubleCapacity outputCapacity
      pure $ M.fromFoldable
        [ Tuple Direction.Left  (inputPort  inputCapacity)
        , Tuple Direction.Up    (outputPort outputCapacity)
        , Tuple Direction.Down  (outputPort outputCapacity)
        ]
  , updatePort: \_ _ -> Nothing
  }

severSignal :: Capacity -> Signal -> Tuple Signal Signal
severSignal outputCapacity (Signal s) = Tuple (Signal high) (Signal low)
  where
    high = shr s n
    low = s `and` (shl 1 n - 1)
    n = toInt outputCapacity
