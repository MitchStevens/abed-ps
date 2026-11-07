module Game.Piece.Catalogue.Arithmetic where

import Prelude

import Data.Maybe (fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..), doubleCapacity)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..))
import Game.Port (inputPort, noPort, outputPort)

succPiece :: Piece
succPiece = mkSuccPiece TwoBit

mkSuccPiece :: Capacity -> Piece
mkSuccPiece capacity = Piece
  { op: Operation.Succ capacity
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      ]
  }

mkAdder :: Capacity -> Piece
mkAdder capacity = Piece
  { op: Operation.Adder capacity
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort capacity)
      , Tuple Direction.Down (outputPort OneBit)
      ]
  }

mkMultiplier :: Capacity -> Piece
mkMultiplier capacity = Piece
  { op: Operation.Multiplier
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left (inputPort capacity)
      , Tuple Direction.Up (inputPort capacity)
      , Tuple Direction.Right (outputPort $ fromMaybe EightBit $ doubleCapacity capacity)
      ]
  }
