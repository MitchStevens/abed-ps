module Game.Piece.ArithmeticPiece where

import Prelude

import Data.Foldable (fold)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.Complexity as Complexity
import Game.Piece.Port (Capacity(..), inputPort, maxValue, outputPort)
import Game.Piece.Types (Piece(..), PieceId(..))
import Game.Signal (Signal(..))


succPiece :: Piece
succPiece = mkSuccPiece TwoBit

mkSuccPiece :: Capacity -> Piece
mkSuccPiece capacity = Piece
  { name: PieceId "succ"
  , eval: \m ->
      let s = fold (M.lookup Direction.Left m)
      in  M.singleton Direction.Right (if s == maxValue capacity then zero else s + one)
  , complexity: Complexity.space 10.0

  , shouldRipple: false
  , updateCapacity: \_ capacity' -> Just (mkSuccPiece capacity')

  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      ]
  , updatePort: \_ _ -> Nothing
  }
