module Game.Piece.WirePiece where

import Prelude

import Control.Alternative (guard)
import Data.Foldable (all, elem, length)
import Data.Int (toNumber)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, fromMaybe', maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Port (Capacity(..))
import Game.Piece.Port (Capacity(..), PortType(..), inputPort, isInput, isOutput, outputPort)
import Game.Piece.Port as Port
import Game.Piece.Types (Piece(..), PieceId(..), name)
import Game.Signal (Signal(..))
import Partial.Unsafe (unsafeCrashWith)


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

wirePieceNames :: Map (Set CardinalDirection) PieceId
wirePieceNames =
  M.fromFoldable
    [ Tuple (up)                  (PieceId "left-piece") 
    , Tuple (right)               (PieceId "id-piece") 
    , Tuple (down)                (PieceId "right-piece") 
    , Tuple (up <> right)         (PieceId "intersection-left-piece") 
    , Tuple (up <> down)          (PieceId "intersection-junction-piece") 
    , Tuple (right <> down)       (PieceId "intersection-right-piece") 
    , Tuple (up <> right <> down) (PieceId "super-piece") 
    ]
  where
    up    = S.singleton Direction.Up
    right = S.singleton Direction.Right
    down  = S.singleton Direction.Down


mkWirePiece :: WirePiece -> Piece
mkWirePiece wire = Piece
  { name: fromMaybe' (\_ -> unsafeCrashWith "impossible to create wirePiece with no outputs") (M.lookup wire.outputs wirePieceNames)
  , eval: \inputs -> 
      let signal = fromMaybe (Signal 0) (M.lookup Direction.Left inputs)
      in S.toMap wire.outputs $> signal
  , complexity: Complexity.space (toNumber (length wire.outputs))

  , shouldRipple: true
  , updateCapacity: \_ capacity -> Just (mkWirePiece (wire { capacity = capacity }))

  , ports: M.insert Direction.Left (inputPort wire.capacity) 
      (S.toMap wire.outputs $> outputPort wire.capacity)

  , updatePort: \dir portType -> case dir, portType of
      Direction.Left, _ -> Nothing
      _, Just Input -> do
          let newOutputs = S.insert dir wire.outputs 
          guard (wire.outputs /= newOutputs)
          pure $ mkWirePiece (wire { outputs = newOutputs })
      _, Just Output -> Nothing
      _, Nothing -> do
          let newOutputs = S.delete dir wire.outputs 
          guard (wire.outputs /= newOutputs)
          if S.isEmpty newOutputs
            then pure $ mkWirePiece (wire { outputs = S.singleton Direction.Right} )
            else pure $ mkWirePiece (wire { outputs = newOutputs })
  }

isWirePiece :: Piece -> Boolean
isWirePiece piece = name piece `elem` wirePieceNames

allWirePieces :: Array Piece
allWirePieces = [ idPiece, leftPiece, rightPiece, superPiece ]

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
