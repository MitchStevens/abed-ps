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
import Game.Piece.APiece (APiece, mkPiece)
import Game.Piece.Class (class Piece, PieceId(..), updateCapacity)
import Game.Piece.Port (Capacity(..), doubleCapacity, halveCapacity, inputPort, outputPort, toInt)
import Game.Signal (Signal(..))

allFusePieces :: Array APiece
--allFusePieces = [ fusePiece, severPiece ]
allFusePieces = [ fusePiece, severPiece ]

newtype FusePiece = Fuse { inputCapacity :: Capacity }

instance Piece FusePiece where
  name _ = PieceId "fuse"
  eval (Fuse { inputCapacity }) m = M.singleton Direction.Right (fuseSignals inputCapacity high low)
    where
      high = fold (M.lookup Direction.Up m)
      low  = fold (M.lookup Direction.Down m)

  shouldRipple _ = false
  getCapacity (Fuse { inputCapacity }) = Just inputCapacity
  updateCapacity dir capacity (Fuse {inputCapacity}) = case dir of
    Direction.Left -> Nothing
    Direction.Right -> do
      inputCapacity' <- halveCapacity capacity
      guard (inputCapacity' /= inputCapacity)
      pure $ Fuse { inputCapacity: inputCapacity' }
    _ -> do
      guard (capacity /= inputCapacity)
      _ <- doubleCapacity capacity
      pure $ Fuse { inputCapacity: capacity }
  
  getPorts (Fuse { inputCapacity }) = fromMaybe M.empty do
    outputCapacity <- doubleCapacity inputCapacity
    pure $ M.fromFoldable
      [ Tuple Direction.Up    (inputPort inputCapacity)
      , Tuple Direction.Down  (inputPort inputCapacity)
      , Tuple Direction.Right (outputPort outputCapacity)
      ]
  updatePort _ _ _ = Nothing

fusePiece :: APiece
fusePiece = mkPiece (Fuse {inputCapacity: OneBit})

fuseSignals :: Capacity -> Signal -> Signal -> Signal
fuseSignals inputCapacity (Signal high) (Signal low) = Signal (shl high n `or` (low `and` (shl 1 n - 1)))
  where
    n = toInt inputCapacity


newtype SeverPiece = Sever { outputCapacity :: Capacity }

instance Piece SeverPiece where
  name _ = PieceId "sever"
  eval (Sever { outputCapacity }) m =
    M.fromFoldable
      [ Tuple Direction.Up high
      , Tuple Direction.Down low
      ]
    where
      Tuple high low = foldMap (severSignal outputCapacity) (M.lookup Direction.Left m)
      --signal = fromMaybe (Signal 0) (M.lookup Direction.Left m)

  shouldRipple _ = false
  getCapacity _ = Nothing
  updateCapacity dir capacity (Sever {outputCapacity}) = case dir of
    Direction.Right -> Nothing
    Direction.Left -> do
      outputCapacity' <- halveCapacity capacity
      guard (outputCapacity /= outputCapacity')
      pure (Sever { outputCapacity: outputCapacity' })
    _ -> do
      guard (capacity /= outputCapacity)
      pure (Sever {outputCapacity: capacity})

  getPorts (Sever { outputCapacity }) = fromMaybe M.empty do
    inputCapacity <- doubleCapacity outputCapacity
    pure $ M.fromFoldable
      [ Tuple Direction.Left  (inputPort  inputCapacity)
      , Tuple Direction.Up    (outputPort outputCapacity)
      , Tuple Direction.Down  (outputPort outputCapacity)
      ]
  updatePort _ _ _ = Nothing

severPiece :: APiece
severPiece = mkPiece (Sever {outputCapacity: OneBit})

severSignal :: Capacity -> Signal -> Tuple Signal Signal
severSignal outputCapacity (Signal s) = Tuple (Signal high) (Signal low)
  where
    high = shr s n
    low = s `and` (shl 1 n - 1)
    n = toInt outputCapacity
