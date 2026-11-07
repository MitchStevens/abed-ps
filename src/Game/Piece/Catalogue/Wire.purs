module Game.Piece.Catalogue.Wire where

import Prelude

import Data.Foldable (elem)
import Data.Map (Map)
import Data.Map as M
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece.Operation as Operation
import Game.Piece.PieceId (wirePieceNames)
import Game.Piece.Types (Piece(..), name)
import Game.Port (inputPort, noPort, outputPort)


{-
  wire pieces must:
  - have exactly 1 input   on the left
  - have at least 1 output
  - send the input signal directly to all of th  outputs


  wires are also able to be modified by 
-}
type WirePiece =
  { capacity :: Capacity
  , outputs :: Set CardinalDirection
  }

mkWirePiece :: WirePiece -> Piece
mkWirePiece { outputs, capacity } = Piece
  { op: Operation.Connection connections
  , ports: Frame.tabulate case _ of
      Direction.Left -> inputPort capacity
      dir | dir `elem` outputs -> outputPort capacity
      _ -> noPort
  }
  where
    connections :: Map CardinalDirection CardinalDirection
    connections = M.fromFoldable $ S.map (\out -> Tuple out Direction.Left) outputs


{-
  (Piece -> Piece) -> Piece

-}


isWirePiece :: Piece -> Boolean
isWirePiece piece = name piece `elem` wirePieceNames

allWirePieces :: Array Piece
allWirePieces =
  [ idPiece, leftPiece, rightPiece, superPiece 
  , crossPiece , cornerCutPiece , chickenPiece , reverseChickenPiece
  ]

idPiece :: Piece
idPiece = mkWirePiece
  { capacity: OneBit
  , outputs: S.fromFoldable [ Direction.Right ]
  }

leftPiece :: Piece
leftPiece = mkWirePiece
  { capacity: OneBit 
  , outputs: S.fromFoldable [Direction.Up]
  }

rightPiece :: Piece
rightPiece = mkWirePiece 
  { capacity: OneBit
  , outputs: S.fromFoldable [Direction.Down]
  }

superPiece :: Piece
superPiece = mkWirePiece 
  { capacity: OneBit
  , outputs: S.fromFoldable [Direction.Up, Direction.Right, Direction.Down]
  }

intersectionRightPiece :: Piece
intersectionRightPiece = mkWirePiece 
  { capacity: OneBit
  , outputs: S.fromFoldable [Direction.Right, Direction.Down]
  }


type DualWirePiece =
  { capacity :: Capacity
  , output1 :: CardinalDirection
  , input2 :: CardinalDirection
  , output2 :: CardinalDirection
  }

dualWirePiece :: DualWirePiece -> Piece
dualWirePiece dualWire = Piece
  { op: Operation.Connection connections
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left   (inputPort  dualWire.capacity)
      , Tuple dualWire.input2  (inputPort  dualWire.capacity)
      , Tuple dualWire.output1 (outputPort dualWire.capacity)
      , Tuple dualWire.output2 (outputPort dualWire.capacity)
      ]
  }
  where
    connections :: Map CardinalDirection CardinalDirection
    connections = M.fromFoldable
      [ Tuple dualWire.output1 Direction.Left
      , Tuple dualWire.output2 dualWire.input2
      ]

crossPiece :: Piece
crossPiece = dualWirePiece
  { capacity: OneBit
  , output1: Direction.Right
  , input2: Direction.Up
  , output2: Direction.Down
  }

cornerCutPiece :: Piece
cornerCutPiece = dualWirePiece
  { capacity: OneBit
  , output1: Direction.Down
  , input2: Direction.Up
  , output2: Direction.Right
  }

chickenPiece :: Piece
chickenPiece = dualWirePiece
  { capacity: OneBit
  , output1: Direction.Down
  , input2: Direction.Right
  , output2: Direction.Up
  }

reverseChickenPiece :: Piece
reverseChickenPiece = dualWirePiece
  { capacity: OneBit
  , output1: Direction.Up
  , input2: Direction.Right
  , output2: Direction.Down
  }