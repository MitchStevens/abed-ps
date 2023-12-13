module Game.Piece.Arithmetic where

import Prelude

import Data.Foldable (fold)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece.APiece (APiece, mkPiece)
import Game.Piece.Class (PieceId(..), complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.PieceSpec (PieceSpec(..))
import Game.Piece.Port (Capacity(..), inputPort, maxValue, outputPort)

succPiece :: APiece
succPiece = mkPiece (succ TwoBit)

succ :: Capacity -> PieceSpec
succ capacity = PieceSpec
  { name: PieceId "succ"
  , eval: \m ->
      let s = fold (M.lookup Direction.Left m)
      in  M.singleton Direction.Right (if s == maxValue capacity then zero else s + one)
  , complexity: Complexity.space 10.0

  , shouldRipple: false
  , getCapacity: Just capacity
  , updateCapacity: \_ capacity' -> Just (succ capacity')

  , getPorts: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      ]
  , updatePort: \_ _ -> Nothing
  }
