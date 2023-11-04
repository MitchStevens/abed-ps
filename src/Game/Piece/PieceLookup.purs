module Game.Piece.PieceLookup where

import Game.Piece.BasicPiece
import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe)
import Data.Tuple (Tuple(..))
import Game.Piece (APiece(..), PieceId(..), name)

allPieces :: Array APiece
allPieces = allBasicPieces

pieceVault :: Map PieceId APiece
pieceVault = M.fromFoldable $ map (\p -> Tuple (name p) p) allPieces

pieceLookup :: PieceId -> Maybe APiece
pieceLookup pieceId = M.lookup pieceId pieceVault