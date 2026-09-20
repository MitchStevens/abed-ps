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
import Game.Frame as Frame
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), isSimplifiable, mkPieceNoAdapt)
import Game.Port (inputPort, noPort, outputPort)
import Game.Signal (Signal(..), over2Signal, overSignal)

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
  , eval: \inputs -> 
      let high = Frame.index Direction.Up inputs
          low  = Frame.index Direction.Down inputs
      in Frame.singleton zero Direction.Right (fuseSignals inputCapacity high low)
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
  
fuseSignals :: Capacity -> Signal -> Signal -> Signal
fuseSignals inputCapacity = over2Signal $ \high low -> 
  shl high n .|. (low .&. (shl one n - one))
  where
    n = fromInt (toInt inputCapacity)


type SeverPiece = { outputCapacity :: Capacity }

mkSeverPiece :: SeverPiece -> Piece
mkSeverPiece { outputCapacity } = mkPieceNoAdapt
  { name: PieceId "sever-piece"
  , eval: \inputs ->
      let Tuple high low = severSignal outputCapacity (Frame.index Direction.Left inputs)
      in Frame.fromFoldable zero
        [ Tuple Direction.Up high
        , Tuple Direction.Down low
        ]
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

severSignal :: Capacity -> Signal -> Tuple Signal Signal
severSignal outputCapacity signal = Tuple high low
  where
    high = overSignal (\s -> shr s n) signal
    low = overSignal (\s -> s .&. (shl one n - one)) signal
    n = fromInt (toInt outputCapacity)