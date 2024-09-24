module Game.Piece.FusePiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Foldable (fold, foldMap)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Data.UInt (fromInt, shl, shr, (.&.), (.|.))
import Game.Capacity (Capacity(..), doubleCapacity, halveCapacity, toInt)
import Game.Direction as Direction
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), mkPiece)
import Game.Port (inputPort, outputPort)
import Game.Signal (Signal(..), over2Signal, overSignal)

allFusePieces :: Array Piece
allFusePieces = [ fusePiece, severPiece ]

fusePiece :: Piece
fusePiece = mkFusePiece { inputCapacity: OneBit }

severPiece :: Piece
severPiece = mkSeverPiece { outputCapacity: OneBit }


type FusePiece = { inputCapacity :: Capacity }

mkFusePiece :: FusePiece -> Piece
mkFusePiece { inputCapacity } = mkPiece
  { name: PieceId "fuse-piece"
  , eval: \inputs -> 
      let high = fold (M.lookup Direction.Up inputs)
          low  = fold (M.lookup Direction.Down inputs)
      in M.singleton Direction.Right (fuseSignals inputCapacity high low)

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
  }
  
fuseSignals :: Capacity -> Signal -> Signal -> Signal
fuseSignals inputCapacity = over2Signal $ \high low -> 
  shl high n .|. (low .&. (shl one n - one))
  where
    n = fromInt (toInt inputCapacity)


type SeverPiece = { outputCapacity :: Capacity }

mkSeverPiece :: SeverPiece -> Piece
mkSeverPiece { outputCapacity } = mkPiece
  { name: PieceId "sever-piece"
  , eval: \inputs ->
      let Tuple high low = foldMap (severSignal outputCapacity) (M.lookup Direction.Left inputs)
      in M.fromFoldable
        [ Tuple Direction.Up high
        , Tuple Direction.Down low
        ]

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
  }

severSignal :: Capacity -> Signal -> Tuple Signal Signal
severSignal outputCapacity signal = Tuple high low
  where
    high = overSignal (\s -> shr s n) signal
    low = overSignal (\s -> s .&. (shl one n - one)) signal
    n = fromInt (toInt outputCapacity)