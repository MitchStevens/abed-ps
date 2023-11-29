module Game.Piece
  ( pieceLookup
  , module Game.Piece.APiece
  , module Game.Piece.BasicPiece
  , module Game.Piece.Class
  , module Game.Piece.CommutativePiece
  , module Game.Piece.MultiplexerPiece
  , module Game.Piece.Port
  , module Game.Piece.PortInfo
  , module Game.Piece.WirePiece
  ) where

import Game.Piece.APiece
import Game.Piece.BasicPiece
import Game.Piece.Class
import Game.Piece.CommutativePiece
import Game.Piece.MultiplexerPiece
import Game.Piece.Port
import Game.Piece.PortInfo
import Game.Piece.WirePiece
import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe, fromMaybe, fromMaybe')
import Data.Tuple (Tuple(..))
import Debug (trace)
import Partial.Unsafe (unsafeCrashWith)

allPieces :: Array APiece
allPieces = allBasicPieces <> allCommutativePieces <> allWirePieces <> allMultiplexerPieces

pieceVault :: Map PieceId APiece
pieceVault = M.fromFoldable $ map (\p -> Tuple (name p) p) allPieces

pieceLookup :: PieceId -> APiece
pieceLookup pieceId = 
  fromMaybe' (\_ -> unsafeCrashWith message) (M.lookup pieceId pieceVault)
    where message = "piece lookup crash on " <> show pieceId <> "... WITH NO SURVIVORS"