-- | Every piece a player can place, keyed by name.
module Game.Piece.Catalogue
  ( allPieces
  , pieceLookup
  , pieceVault
  ) where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe')
import Data.Tuple (Tuple(..))
import Game.Piece.Catalogue.Basic (allBasicPieces)
import Game.Piece.Catalogue.Fuse (allFusePieces)
import Game.Piece.Catalogue.Wire (allWirePieces)
import Game.Piece.PieceId (PieceId)
import Game.Piece.Types (Piece, name)
import Partial.Unsafe (unsafeCrashWith)

allPieces :: Array Piece
allPieces = allBasicPieces <> allWirePieces <> allFusePieces

pieceVault :: Map PieceId Piece
pieceVault = M.fromFoldable $ map (\piece -> Tuple (name piece) piece) allPieces

pieceLookup :: PieceId -> Piece
pieceLookup pieceId =
  fromMaybe' (\_ -> unsafeCrashWith message) (M.lookup pieceId pieceVault)
    where message = "piece lookup crash on " <> show pieceId <> "... WITH NO SURVIVORS"
