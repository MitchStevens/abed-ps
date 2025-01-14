module Game.Piece.ArithmeticPiece where

import Prelude

import Data.Foldable (fold)
import Data.Int as Int
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..), doubleCapacity, halveCapacity)
import Game.Direction as Direction
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), mkPieceNoGlob, shouldRipple)
import Game.Port (inputPort, outputPort)
import Game.Signal (Signal(..), maxValue)

succPiece :: Piece
succPiece = mkSuccPiece TwoBit

mkSuccPiece :: Capacity -> Piece
mkSuccPiece capacity = mkPieceNoGlob
  { name: PieceId "succ"
  , eval: \m ->
      let s = fold (M.lookup Direction.Left m)
      in  M.singleton Direction.Right (if s == maxValue capacity then zero else s + one)
  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      ]
  , complexity: Complexity.space 10.0
  , shouldRipple: false
  , updateCapacity: \_ capacity' -> Just (mkSuccPiece capacity')
  , isSimplifiable: Nothing
  }

mkAdder :: Capacity -> Piece
mkAdder capacity = mkPieceNoGlob
  { name: PieceId "adder-piece"
  , eval: \m ->
      let a = fold (M.lookup Direction.Left m)
          b = fold (M.lookup Direction.Up m)
          sum = a + b
          carry = if a+b > maxValue capacity then one else zero
      in  M.fromFoldable 
            [ Tuple Direction.Right sum
            , Tuple Direction.Down carry
            ]
  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      , Tuple Direction.Down (outputPort OneBit)
      ]
  , complexity: Complexity.space 10.0

  , shouldRipple: false
  , updateCapacity: \_ capacity' -> Just (mkAdder capacity')
  , isSimplifiable: Nothing
  }

mkMultiplier :: Capacity -> Piece
mkMultiplier capacity = mkPieceNoGlob
  { name: PieceId "multiplier-piece"
  , eval: \m ->
      let a = fold (M.lookup Direction.Left m)
          b = fold (M.lookup Direction.Up m)
      in  M.singleton Direction.Right (a * b)
  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort $ fromMaybe EightBit $ doubleCapacity capacity)
      ]
  , complexity: Complexity.space 10.0

  , shouldRipple: false
  , updateCapacity: \dir capacity' -> case dir of
      Direction.Right -> 
        if capacity == capacity'
          then Just (mkMultiplier capacity)
          else mkMultiplier <$> halveCapacity capacity'
      Direction.Down -> Nothing
      _ -> Just (mkMultiplier capacity')

  , isSimplifiable: Nothing
  }