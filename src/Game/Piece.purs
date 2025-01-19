module Game.Piece
  ( pieceLookup
  , pieceVault
  , module Game.Piece.ArithmeticPiece
  , module Game.Piece.Complexity
  , module Game.Piece.FusePiece
  , module Game.Piece.Types
  , module Game.Piece.UnaryOperationPiece
  , module Game.Piece.BinaryAssociativePiece
  , module Game.Piece.WirePiece
  , allPieces
  ) where

import Game.Piece.ArithmeticPiece
import Game.Piece.Complexity
import Game.Piece.FusePiece
import Game.Piece.Types
import Game.Piece.UnaryOperationPiece
import Game.Piece.BinaryAssociativePiece
import Game.Piece.WirePiece
import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe, fromMaybe, fromMaybe')
import Data.Tuple (Tuple(..))
import Partial.Unsafe (unsafeCrashWith)

allPieces :: Array Piece
allPieces = allWirePieces <> allFusePieces <> allBinaryAssociativePieces <> allUnaryOperationPieces

pieceVault :: Map PieceId Piece
pieceVault = M.fromFoldable $ map (\(Piece p) -> Tuple p.name (Piece p)) allPieces

pieceLookup :: PieceId -> Piece
pieceLookup pieceId = 
  fromMaybe' (\_ -> unsafeCrashWith message) (M.lookup pieceId pieceVault)
    where message = "piece lookup crash on " <> show pieceId <> "... WITH NO SURVIVORS"
