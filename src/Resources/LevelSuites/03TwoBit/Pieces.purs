module Resources.LevelSuites.TwoBit.Pieces where

import Prelude

import Data.Foldable (fold)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction as Direction
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), mkPiece)
import Game.Piece.Port (inputPort, outputPort)
import Game.Piece.Signal (Signal(..), nthBit)

twoBitCrossOver :: Piece
twoBitCrossOver = mkPiece
  { name: PieceId "two-bit-cross-over"
  , eval: \m -> 
      let s = fold (M.lookup Direction.Left m)
          output = Signal $ (if nthBit s 0 then 2 else 0) + (if nthBit s 1 then 1 else 0)
      in M.singleton Direction.Right output
  , complexity: Complexity.space 20.0
  
  , ports: M.fromFoldable
    [ Tuple Direction.Left (inputPort TwoBit)
    , Tuple Direction.Right (outputPort TwoBit)
    ]
  }
