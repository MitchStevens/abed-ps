module Data.Piece.MultiplexerPiece where

import Prelude

import Data.Int.Bits (and, or, shl, shr)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece.APiece (APiece, mkPiece)
import Game.Piece.Class (class Piece, PieceId(..))
import Game.Piece.Port (Capacity(..), doubleCapacity, halveCapacity, inputPort, outputPort, toInt)
import Game.Signal (Signal(..))

--import Game.Piece.Port as Port

allMultiplexerPieces :: Array APiece
--allMultiplexerPieces = [ muxPiece, demuxPiece ]
allMultiplexerPieces = [ muxPiece ]

muxPiece :: APiece
muxPiece = mkPiece (Multiplexer { inputCapacity: TwoBit } )

newtype MultiplexerPiece = Multiplexer { inputCapacity :: Capacity }

instance Piece MultiplexerPiece where
  name _ = PieceId "mux"
  eval (Multiplexer { inputCapacity }) m =
    M.fromFoldable
      [ Tuple Direction.Right (Signal highBits)
      , Tuple Direction.Down  (Signal lowBits)
      ]
    where
      Signal s = fromMaybe (Signal 0) (M.lookup Direction.Left m)
      highBits = shr s n
      lowBits =  and (shl 1 n) s
      n = toInt inputCapacity

  getCapacity (Multiplexer { inputCapacity }) = Just inputCapacity
  updateCapacity capacity _ = do
    _ <- halveCapacity capacity
    pure $ Multiplexer { inputCapacity: capacity }

  getPorts (Multiplexer { inputCapacity }) = fromMaybe M.empty do
    outputCapacity <- halveCapacity inputCapacity
    pure $ M.fromFoldable
      [ Tuple Direction.Left  (inputPort  inputCapacity)
      , Tuple Direction.Right (outputPort outputCapacity)
      , Tuple Direction.Down  (outputPort outputCapacity)
      ]
  updatePort _ _ _ = Nothing
