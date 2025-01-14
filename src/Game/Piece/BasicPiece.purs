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
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), mkPieceNoGlob)
import Game.Port (PortType(..), createPort, inputPort, outputPort)
import Game.Signal (Signal(..), xor)

type BasicPiece =
  { name :: PieceId
  , eval :: Map CardinalDirection Signal -> Map CardinalDirection Signal
  , ports :: Map CardinalDirection PortType
  , capacity :: Capacity
  }

basicPiece :: BasicPiece -> Piece
basicPiece basic = mkPieceNoGlob
  { name: basic.name
  , eval: basic.eval
  , ports: map (\portType -> createPort portType basic.capacity) basic.ports
  , complexity: Complexity.space 1.0

  , shouldRipple: true
  , updateCapacity: \dir capacity -> do
      guard (M.member dir basic.ports)
      pure $ basicPiece (basic { capacity = capacity })
  , isSimplifiable: Nothing
  }

allBasicPieces :: Array Piece
allBasicPieces =
  [ notPiece, orPiece, andPiece, xorPiece ]

notPiece :: Piece
notPiece = basicPiece
  { name: PieceId "not-piece"
  , eval: \m ->
      let l = fromMaybe zero (M.lookup Left m)
      in M.singleton Right (not l)
  , ports: M.fromFoldable
    [ Tuple Left Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

orPiece :: Piece
orPiece = basicPiece
  { name: PieceId "or-piece"
  , eval: \m ->
      let l = fromMaybe zero (M.lookup Left m)
          u = fromMaybe zero (M.lookup Up m)
      in M.singleton Right (l || u)
  , ports: M.fromFoldable
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

andPiece :: Piece
andPiece = basicPiece
  { name: PieceId "and-piece" 
  , eval: \m ->
      let l = fromMaybe zero (M.lookup Left m)
          u = fromMaybe zero (M.lookup Up m)
      in M.singleton Right (l && u)
  , ports: M.fromFoldable
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }

xorPiece :: Piece
xorPiece = basicPiece 
  { name: PieceId "xor-piece" 
  , eval: \m ->
      let l = fromMaybe zero (M.lookup Left m)
          u = fromMaybe zero (M.lookup Up m)
      in M.singleton Right (xor l u)
  , ports: M.fromFoldable
    [ Tuple Left Input
    , Tuple Up Input
    , Tuple Right Output
    ]
  , capacity: OneBit
  }