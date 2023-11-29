module Game.Piece.MultiplexerPiece where

import Prelude

import Data.Int.Bits (and, or, shl, shr)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Expression (Signal(..))
import Game.Piece.APiece (APiece, mkPiece)
import Game.Piece.Class (class Piece, PieceId(..))
import Game.Piece.Port (Capacity(..), doubleCapacity, halveCapacity, inputPort, outputPort, toInt)
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


--demuxPiece :: APiece
--demuxPiece = mkPiece (Demultiplexer { inputCapacity: OneBit } )
--
--newtype DemultiplexerPiece = Demultiplexer { inputCapacity :: Capacity }
--
--instance Piece DemultiplexerPiece where
--  name _ = PieceId "demux"
--  eval (Demultiplexer { inputCapacity }) m = M.singleton Direction.Right signal
--    where
--      Signal highBits = fromMaybe (Signal 0) (M.lookup Direction.Up m)
--      Signal lowBits  = fromMaybe (Signal 0) (M.lookup Direction.Left m)
--      signal = Signal (shl highBits n `or` lowBits)
--      n = toInt inputCapacity
--      
--  getCapacity (Demultiplexer { inputCapacity }) = Just inputCapacity
--  updateCapacity capacity _ = do
--    _ <- doubleCapacity capacity
--    pure $ Demultiplexer { inputCapacity: capacity }
--
--  getPorts (Demultiplexer { inputCapacity }) = fromMaybe M.empty do
--    outputCapacity <- doubleCapacity inputCapacity
--    pure $ M.fromFoldable
--      [ Tuple Direction.Up    (inputPort inputCapacity)
--      , Tuple Direction.Left  (inputPort inputCapacity)
--      , Tuple Direction.Right (outputPort outputCapacity)
--      ]
--  --updatePort Direction.Left (Just (Port.Output capacity)) old = fromMaybe old do
--  --  newCapacity <- halveCapacity capacity
--  --  pure $ Multiplexer { capacity: newCapacity }
--  updatePort _ _ _ = Nothing