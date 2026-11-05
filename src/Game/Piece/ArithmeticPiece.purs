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
import Game.Frame as Frame
import Game.Piece.Complexity as Complexity
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..), PieceId(..), mkPieceNoAdapt, shouldRipple)
import Game.Port (inputPort, noPort, outputPort)

succPiece :: Piece
succPiece = mkSuccPiece TwoBit

mkSuccPiece :: Capacity -> Piece
mkSuccPiece capacity = mkPieceNoAdapt
  { name: PieceId "succ"
  , op: Operation.Succ capacity
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      ]
  , complexity: Complexity.space 10.0
  , shouldRipple: false
  , updateCapacity: \_ capacity' -> Just (mkSuccPiece capacity')
  , isSimplifiable: Nothing
  }

mkAdder :: Capacity -> Piece
mkAdder capacity = mkPieceNoAdapt
  { name: PieceId "adder-piece"
  , op: Operation.Adder capacity
  , ports: Frame.fromFoldable noPort
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
mkMultiplier capacity = mkPieceNoAdapt
  { name: PieceId "multiplier-piece"
  , op: Operation.Multiplier
  , ports: Frame.fromFoldable noPort
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