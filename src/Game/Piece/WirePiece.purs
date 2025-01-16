module Game.Piece.WirePiece where

import Prelude

import Control.Alternative (guard)
import Control.Lazy (fix)
import Data.Foldable (all, elem, length)
import Data.Int (toNumber)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, fromMaybe', maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (Piece(..), PieceId(..), Simplification(..), isSimplifiable, mkPieceNoGlob, name, shouldRipple, unglob)
import Game.Port (PortType(..), inputPort, outputPort)
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

{-


  mk :: Piece -> WirePiece -> Piece -> Piece
  mk unglob wire this = ...
-}


mkWirePiece :: WirePiece -> Piece
mkWirePiece wire = fix go unit
  where
    go :: (Unit -> Piece) -> Unit -> Piece
    go this _ = Piece
      { name: fromMaybe' nameErr (M.lookup wire.outputs wirePieceNames)
      , eval: \inputs -> 
          let signal = fromMaybe zero (M.lookup Direction.Left inputs)
          in S.toMap wire.outputs $> signal
      , complexity: Complexity.space (toNumber (length wire.outputs))

      , shouldRipple: true
      , updateCapacity: \_ capacity -> Just (mkWirePiece (wire { capacity = capacity }))

      , ports: M.insert Direction.Left (inputPort wire.capacity) 
          (S.toMap wire.outputs $> outputPort wire.capacity)

      , glob: \dir portType -> case dir, portType of
          Direction.Left, _ -> this
          _, Just Input -> do
              let newOutputs = S.insert dir wire.outputs 
              if wire.outputs == newOutputs
                then this
                else \_ -> mkWirePiece (wire { outputs = newOutputs })
          _, Just Output -> this
          _, Nothing -> do
              let newOutputs = S.delete dir wire.outputs 
              if wire.outputs == newOutputs
                then this
                else if S.isEmpty newOutputs
                  then \_ -> mkWirePiece (wire { outputs = S.singleton Direction.Right} )
                  else \_ -> mkWirePiece (wire { outputs = newOutputs })
      , unglob: this
      , isSimplifiable:
          let connections = M.fromFoldable $ S.map (\out -> Tuple out Direction.Left) wire.outputs
          in Just (Connection connections)
      }

    nameErr :: Unit -> PieceId
    nameErr _ =  unsafeCrashWith $
      "Can't find wire piece with outputs: " <> show wire.outputs


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
  { name :: PieceId
  , capacity :: Capacity
  , output1 :: CardinalDirection
  , input2 :: CardinalDirection
  , output2 :: CardinalDirection
  }

dualWirePiece :: DualWirePiece -> Piece
dualWirePiece dualWire = mkPieceNoGlob
  { name: dualWire.name
  , eval: \m ->
      let a1 = fromMaybe zero (M.lookup Direction.Left m)
          a2 = fromMaybe zero (M.lookup dualWire.input2 m)
      in M.fromFoldable
          [ Tuple dualWire.output1 a1
          , Tuple dualWire.output2 a2
          ]
  , ports: M.fromFoldable
      [ Tuple Direction.Left   (inputPort  dualWire.capacity)
      , Tuple dualWire.input2  (inputPort  dualWire.capacity)
      , Tuple dualWire.output1 (outputPort dualWire.capacity)
      , Tuple dualWire.output2 (outputPort dualWire.capacity)
      ]
  , complexity: Complexity.space 1.0
  , shouldRipple: true
  , updateCapacity: \_ capacity -> Just $ dualWirePiece (dualWire { capacity = capacity})
  , isSimplifiable: Just $ Connection $ M.fromFoldable
      [ Tuple dualWire.output1 Direction.Left
      , Tuple dualWire.output2 dualWire.input2
      ]
  }

crossPiece :: Piece
crossPiece = dualWirePiece
  { name: PieceId "cross-piece"
  , capacity: OneBit
  , output1: Direction.Right
  , input2: Direction.Up
  , output2: Direction.Down
  }

cornerCutPiece :: Piece
cornerCutPiece = dualWirePiece
  { name: PieceId "corner-cut-piece"
  , capacity: OneBit
  , output1: Direction.Down
  , input2: Direction.Up
  , output2: Direction.Right
  }

chickenPiece :: Piece
chickenPiece = dualWirePiece
  { name: PieceId "chicken-piece"
  , capacity: OneBit
  , output1: Direction.Down
  , input2: Direction.Right
  , output2: Direction.Up
  }

reverseChickenPiece :: Piece
reverseChickenPiece = dualWirePiece
  { name: PieceId "reverse-chicken-piece"
  , capacity: OneBit
  , output1: Direction.Right
  , input2: Direction.Up
  , output2: Direction.Down
  }