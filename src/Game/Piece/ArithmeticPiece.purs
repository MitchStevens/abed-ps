module Game.Piece.ArithmeticPiece where

import Prelude

import Control.Alternative (guard)
import Data.Foldable (fold)
import Data.Int as Int
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, fromMaybe')
import Data.Tuple (Tuple(..))
import Game.Piece.Capacity (Capacity(..), doubleCapacity, halveCapacity, maxValue, toInt)
import Game.Piece.Complexity as Complexity
import Game.Piece.Direction as Direction
import Game.Piece.Port (inputPort, outputPort)
import Game.Piece.Signal (Signal(..))
import Game.Piece.Types (Piece(..), PieceId(..), mkPiece, shouldRipple)
import Partial.Unsafe (unsafeCrashWith)
import Web.DOM.Document (doctype)

succPiece :: Piece
succPiece = mkSuccPiece TwoBit

mkSuccPiece :: Capacity -> Piece
mkSuccPiece capacity = mkPiece
  { name: PieceId "succ"
  , eval: \m ->
      let s = fold (M.lookup Direction.Left m)
      in  M.singleton Direction.Right (if s == maxValue capacity then zero else s + one)
  , complexity: Complexity.space 10.0

  , updateCapacity: \_ capacity' -> Just (mkSuccPiece capacity')

  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      ]
  }

mkHalfAdder :: Capacity -> Piece
mkHalfAdder capacity = mkPiece
  { name: PieceId "half-adder-piece"
  , eval: \m ->
      let Signal a = fold (M.lookup Direction.Left m)
          Signal b = fold (M.lookup Direction.Up m)
          sum = a+b `mod` (Int.pow 2 (toInt capacity))
          carry = if a+b > Int.pow 2 (toInt capacity) then 1 else 0
      in  M.fromFoldable 
            [ Tuple Direction.Right (Signal sum)
            , Tuple Direction.Down (Signal carry)
            ]
  , complexity: Complexity.space 10.0

  , updateCapacity: \_ capacity' -> Just (mkHalfAdder capacity')

  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      , Tuple Direction.Down (outputPort OneBit)
      ]
  }

-- capacity <= `FourBit`
mkFullAdder :: Capacity -> Piece
mkFullAdder capacity = mkPiece
  { name: PieceId "full-adder-piece"
  , eval: \m ->
      let Signal a = fold (M.lookup Direction.Left m)
          Signal b = fold (M.lookup Direction.Up m)
          Signal c = fold (M.lookup Direction.Down m)
      in M.singleton Direction.Right (Signal $ a + b + if c == 1 then Int.pow 2 (toInt capacity) else 0)

  , updateCapacity: \dir capacity' -> case dir of
      Direction.Right -> mkFullAdder <$> halveCapacity capacity'
      Direction.Down -> Nothing
      _ -> do
        guard (capacity' <= FourBit)
        pure (mkFullAdder capacity')

  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort outputCapacity)
      , Tuple Direction.Down (inputPort OneBit)
      ]
  }
  where
    outputCapacity = fromMaybe' (\_ -> unsafeCrashWith "mkFullAdder error") (doubleCapacity capacity)

mkMultiplier :: Capacity -> Piece
mkMultiplier capacity = mkPiece
  { name: PieceId "multiplier-piece"
  , eval: \m ->
      let Signal a = fold (M.lookup Direction.Left m)
          Signal b = fold (M.lookup Direction.Up m)
      in  M.singleton Direction.Right (Signal (a * b))
  , complexity: Complexity.space 10.0

  , updateCapacity: \dir capacity' -> case dir of
      Direction.Right -> 
        if capacity == capacity'
          then Just (mkMultiplier capacity)
          else mkMultiplier <$> halveCapacity capacity'
      Direction.Down -> Nothing
      _ -> Just (mkMultiplier capacity')

  , ports: M.fromFoldable
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort $ fromMaybe EightBit $ doubleCapacity capacity)
      ]
  }