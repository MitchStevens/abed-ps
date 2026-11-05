module Game.Piece.BasicPiece where

import Prelude

import Control.Alt ((<|>))
import Control.Alternative (guard)
import Data.HeytingAlgebra (ff, tt)
import Data.List (List)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (class Newtype)
import Data.Traversable (class Foldable, traverse)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection(..))
import Game.Direction as Direction
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Piece.Types (Piece(..), PieceId(..), mkPieceNoAdapt)
import Game.Port (PortType(..), createPort, inputPort, outputPort)

type BasicPiece =
  { name :: PieceId
  , op :: PieceOperation
  , ports :: Frame PortType
  , capacity :: Capacity
  }

basicPiece :: BasicPiece -> Piece
basicPiece basic = mkPieceNoAdapt
  { name: basic.name
  , op: basic.op
  , ports: (\portType -> createPort portType basic.capacity) <$> basic.ports
  , complexity: Complexity.space 1.0

  , shouldRipple: true
  , updateCapacity: \dir capacity -> do
      guard (Frame.index dir basic.ports /= NoPort)
      pure $ basicPiece (basic { capacity = capacity })
  , isSimplifiable: Nothing
  }

allBasicPieces :: Array Piece
allBasicPieces =
  [ notPiece, orPiece, andPiece, xorPiece ]

notPiece :: Piece
notPiece = basicPiece
  { name: PieceId "not-piece"
  , op: Operation.Not
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

orPiece :: Piece
orPiece = basicPiece
  { name: PieceId "or-piece"
  , op: Operation.Or
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

andPiece :: Piece
andPiece = basicPiece
  { name: PieceId "and-piece" 
  , op: Operation.And
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

xorPiece :: Piece
xorPiece = basicPiece 
  { name: PieceId "xor-piece" 
  , op: Operation.Xor
  , ports: Frame.fromFoldable NoPort
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }