module Game.Piece.Catalogue.Basic where

import Prelude

import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection(..))
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..))
import Game.Port (PortType(..), createPort)

type BasicPiece =
  { op :: PieceOperation
  , ports :: Frame PortType
  , capacity :: Capacity
  }

basicPiece :: BasicPiece -> Piece
basicPiece basic = Piece
  { op: basic.op
  , ports: (\portType -> createPort portType basic.capacity) <$> basic.ports
  }

allBasicPieces :: Array Piece
allBasicPieces =
  [ notPiece, orPiece, andPiece, xorPiece ]

notPiece :: Piece
notPiece = basicPiece
  { op: Operation.Not
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

orPiece :: Piece
orPiece = basicPiece
  { op: Operation.Or
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

andPiece :: Piece
andPiece = basicPiece
  { op: Operation.And
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

xorPiece :: Piece
xorPiece = basicPiece 
  { op: Operation.Xor
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }