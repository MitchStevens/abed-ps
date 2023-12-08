module Game.Piece.PieceSpec where

import Prelude

import Data.Foldable (fold)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.APiece (APiece, mkPiece)
import Game.Piece.Class (class Piece, PieceId(..), getCapacity, shouldRipple, updateCapacity, updatePort)
import Game.Piece.Port (Capacity(..), Port(..), PortType, inputPort, outputPort, portType)
import Game.Signal (Signal(..), nthBit)

newtype PieceSpec = PieceSpec
  { name :: PieceId
  , eval :: Map CardinalDirection Signal -> Map CardinalDirection Signal

  , shouldRipple :: Boolean
  , getCapacity :: Maybe Capacity
  , updateCapacity :: CardinalDirection -> Capacity -> Maybe PieceSpec

  , getPorts :: Map CardinalDirection Port
  , updatePort :: CardinalDirection -> Maybe PortType -> Maybe PieceSpec
  }
derive instance Newtype PieceSpec _

instance Piece PieceSpec where
  name (PieceSpec spec) = spec.name
  eval (PieceSpec spec) = spec.eval

  shouldRipple (PieceSpec spec) = spec.shouldRipple
  getCapacity (PieceSpec spec) = spec.getCapacity
  updateCapacity dir capacity (PieceSpec spec) = spec.updateCapacity dir capacity

  getPorts (PieceSpec spec) = spec.getPorts
  updatePort dir portType (PieceSpec spec) = spec.updatePort dir portType

twoBitCrossOver :: APiece
twoBitCrossOver = mkPiece $ PieceSpec
  { name: PieceId "two-bit-cross-over"
  , eval: \m -> 
      let s = fold (M.lookup Direction.Left m)
          output = Signal $ (if nthBit s 0 then 2 else 0) + (if nthBit s 1 then 1 else 0)
      in M.singleton Direction.Right output
  
  , shouldRipple: false
  , getCapacity: Nothing
  , updateCapacity: \_ _ -> Nothing

  , getPorts: M.fromFoldable
    [ Tuple Direction.Left (inputPort TwoBit)
    , Tuple Direction.Right (outputPort TwoBit)
    ]
  , updatePort: \_ _ -> Nothing
  }

