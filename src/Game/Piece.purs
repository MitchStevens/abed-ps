module Game.Piece
  ( pieceLookup
  , pieceVault
  , module Game.Piece.ArithmeticPiece
  , module Game.Piece.BivariatePiece
  , module Game.Piece.UnivariatePiece
  , module Game.Piece.Capacity
  , module Game.Piece.Complexity
  , module Game.Piece.ConnectionPiece
  , module Game.Piece.Direction
  , module Game.Piece.FusePiece
  , module Game.Piece.Signal
  , module Game.Piece.Port
  , module Game.Piece.Types
  ) where

import Game.Piece.ArithmeticPiece
import Game.Piece.BivariatePiece
import Game.Piece.Capacity
import Game.Piece.Complexity
import Game.Piece.ConnectionPiece
import Game.Piece.Direction
import Game.Piece.UnivariatePiece
import Game.Piece.FusePiece
import Game.Piece.Port
import Game.Piece.Signal
import Game.Piece.Types
import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe, fromMaybe, fromMaybe')
import Data.Tuple (Tuple(..))
import Debug (trace)
import Partial.Unsafe (unsafeCrashWith)

allPieces :: Array Piece
allPieces = allConnectionPieces <> allUnivariatePieces <> allBivariatePieces <> allFusePieces

pieceVault :: Map PieceId Piece
pieceVault = M.fromFoldable $ map (\(Piece p) -> Tuple p.name (Piece p)) allPieces

pieceLookup :: PieceId -> Piece
pieceLookup pieceId = 
  fromMaybe' (\_ -> unsafeCrashWith message) (M.lookup pieceId pieceVault)
    where message = "piece lookup crash on " <> show pieceId <> "... WITH NO SURVIVORS"
