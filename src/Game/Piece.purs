module Game.Piece
  ( pieceLookup
  , pieceVault
  , module Game.Piece.ArithmeticPiece
  , module Game.Piece.BasicPiece
  , module Game.Piece.CommutativePiece
  , module Game.Piece.FusePiece
  , module Game.Piece.Port
  , module Game.Piece.TwoBitSuite
  , module Game.Piece.Types
  , module Game.Piece.WirePiece
  ) where

import Game.Piece.ArithmeticPiece
import Game.Piece.BasicPiece
import Game.Piece.CommutativePiece
import Game.Piece.FusePiece
import Game.Piece.Port
import Game.Piece.TwoBitSuite
import Game.Piece.Types
import Game.Piece.WirePiece
import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe, fromMaybe, fromMaybe')
import Data.Tuple (Tuple(..))
import Debug (trace)
import Partial.Unsafe (unsafeCrashWith)

allPieces :: Array Piece
allPieces = allBasicPieces <> allCommutativePieces <> allWirePieces <> allFusePieces

pieceVault :: Map PieceId Piece
pieceVault = M.fromFoldable $ map (\(Piece p) -> Tuple p.name (Piece p)) allPieces

pieceLookup :: PieceId -> Piece
pieceLookup pieceId = 
  fromMaybe' (\_ -> unsafeCrashWith message) (M.lookup pieceId pieceVault)
    where message = "piece lookup crash on " <> show pieceId <> "... WITH NO SURVIVORS"
