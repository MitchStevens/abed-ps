module Game.Piece.BinaryAssociativePiece where

import Prelude

import Control.Alternative (guard)
import Control.Lazy (fix)
import Data.Array.NonEmpty as NE
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Set (Set)
import Data.Set as S
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), getInputDirs)
import Game.Port (PortType(..), inputPort, outputPort)
import Game.Signal (Signal)
import Game.Signal as Signal

type BinaryAssociativePiece =
  { name :: PieceId
  , op :: Signal -> Signal -> Signal
  , inputs :: Set CardinalDirection
  , capacity :: Capacity
  }

mkBinaryAssociativePiece :: BinaryAssociativePiece -> Piece
mkBinaryAssociativePiece = Lazy.force <<< fix <<< go
  where
    go :: BinaryAssociativePiece -> Lazy Piece -> Lazy Piece
    go piece@{ name, op,  inputs, capacity } unglob = Lazy.defer \_ -> Piece
      { name
      , eval: \m -> 
        let inputSignals = maybe (NE.singleton zero) (map (\d -> fromMaybe zero (M.lookup d m))) (NE.fromFoldable inputs)
        in M.singleton Direction.Right (NE.foldl1 op inputSignals)
      , ports: M.union (M.singleton Direction.Right (outputPort capacity)) (S.toMap inputs $> inputPort capacity)
      , complexity: Complexity.space 1.0

      , shouldRipple: true
      , updateCapacity: \dir capacity' -> 
        if dir == Direction.Right || dir `S.member` inputs
          then Just $ Lazy.force $ go (piece { capacity = capacity'}) unglob
          else Nothing
      
      , glob: \dir portType -> case dir, portType of
          Direction.Right, _ -> Nothing
          _, Just Input -> Nothing
          _, Just Output -> do
            let newInputs = S.insert dir inputs
            guard (not (dir `S.member` inputs))
            pure $ Lazy.force $ go (piece {inputs = newInputs} ) unglob
          _, Nothing -> do
            let newInputs = S.delete dir inputs
            guard (not (dir `S.member`  getInputDirs (Lazy.force unglob)))
            pure $ Lazy.force $ go (piece {inputs = newInputs} ) unglob

      , unglob
      , isSimplifiable: Nothing
      }

allBinaryAssociativePieces :: Array Piece
allBinaryAssociativePieces = [ orPiece, andPiece, xorPiece ]

orPiece :: Piece
orPiece = mkBinaryAssociativePiece
  { name: PieceId "or-piece"
  , op: (||)
  , inputs: S.fromFoldable [ Direction.Left, Direction.Up ]
  , capacity: OneBit
  }

andPiece :: Piece
andPiece = mkBinaryAssociativePiece
  { name: PieceId "and-piece" 
  , op: (&&)
  , inputs: S.fromFoldable [ Direction.Left, Direction.Up ]
  , capacity: OneBit
  }

xorPiece :: Piece
xorPiece = mkBinaryAssociativePiece 
  { name: PieceId "xor-piece" 
  , op: Signal.xor
  , inputs: S.fromFoldable [ Direction.Left, Direction.Up ]
  , capacity: OneBit
  }
