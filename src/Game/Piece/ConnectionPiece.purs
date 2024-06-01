module Game.Piece.ConnectionPiece
  ( ConnectionPiece
  , allConnectionPieces
  , chickenPiece
  , cornerCutPiece
  , crossPiece
  , idPiece
  , isWirePiece
  , leftPiece
  , mkConnectionPiece
  , reverseChickenPiece
  , rightPiece
  , superPiece
  )
  where

import Prelude

import Control.Alternative (guard)
import Data.Array as A
import Data.FoldableWithIndex (allWithIndex, foldMapWithIndex)
import Data.FunctorWithIndex (mapWithIndex)
import Data.List (List(..), elem, (:))
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, fromMaybe')
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Piece.Capacity (Capacity(..))
import Game.Piece.Direction (CardinalDirection)
import Game.Piece.Direction as Direction
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Types (IsSimplifiable(..), Piece(..), PieceId(..), mkPiece, name)
import Game.Piece.Port (inputPort, outputPort)
import Game.Piece.Port as Port
import Game.Piece.Signal (Signal(..))
import Partial.Unsafe (unsafeCrashWith)


{-
  A connection piece:

-}
type ConnectionPiece =
  { outputs :: Set CardinalDirection
  , capacity :: Capacity
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

isWirePiece :: Piece -> Boolean
isWirePiece piece = name piece `elem` wirePieceNames

mkConnectionPiece :: ConnectionPiece  -> Piece
mkConnectionPiece piece = mkPiece
  { name: fromMaybe' (\_ -> unsafeCrashWith "impossible to create wirePiece with no outputs") (M.lookup piece.outputs wirePieceNames)
  , eval: \inputs -> 
      let signal = fromMaybe (Signal 0) (M.lookup Direction.Left inputs)
      in  M.fromFoldable $ S.map (\d -> Tuple d signal) piece.outputs
  , complexity: Complexity.space 1.0
  
  , shouldRipple: true
  , updateCapacity: \dir capacity -> Just $ mkConnectionPiece (piece {capacity = capacity})
  
  , ports:
      M.union
        (M.singleton Direction.Left (inputPort piece.capacity))
        (M.fromFoldable $ S.map (\d -> Tuple d (outputPort piece.capacity)) piece.outputs)
  , updatePort: \dir portType -> case dir, portType of
    Direction.Left, _ -> Nothing
    _, Just Port.Input -> do
        let newOutputs = S.insert dir piece.outputs 
        guard (piece.outputs /= newOutputs)
        pure $ mkConnectionPiece (piece { outputs = newOutputs })
    _, Just Port.Output -> Nothing
    _, Nothing -> do
        let newOutputs = S.delete dir piece.outputs 
        guard (piece.outputs /= newOutputs)
        if S.isEmpty newOutputs
          then pure $ mkConnectionPiece (piece { outputs = S.singleton Direction.Right} )
          else pure $ mkConnectionPiece (piece { outputs = newOutputs }) 

  , isSimplifiable: Just $ IsConnection $
      M.fromFoldable $ S.map (\d -> Tuple d Direction.Left) piece.outputs
  }

{-
-}
type MultipleInputConnectionPiece = 
  { name :: PieceId
  , conn1 :: { from :: CardinalDirection, to :: CardinalDirection, capacity :: Capacity}
  , conn2 :: { from :: CardinalDirection, to :: CardinalDirection, capacity :: Capacity}
  }

mkMultipleInputConnectionPiece :: MultipleInputConnectionPiece -> Piece
mkMultipleInputConnectionPiece piece = mkPiece
  { name: piece.name
  , eval:
     \inputs -> 
        let in1 = fromMaybe (Signal 0) (M.lookup piece.conn1.from inputs)
            in2 = fromMaybe (Signal 0) (M.lookup piece.conn2.from inputs)
        in M.fromFoldable [ Tuple piece.conn1.to in1, Tuple piece.conn2.to in2 ]
  , complexity: Complexity.space 3.0

  , shouldRipple: true
  , updateCapacity: \dir capacity -> 
      if dir == piece.conn1.from || dir == piece.conn2.to
        then Just $ mkMultipleInputConnectionPiece (piece { conn1 { capacity = capacity } })
        else Just $ mkMultipleInputConnectionPiece (piece { conn2 { capacity = capacity } })
  
  , ports:
      M.fromFoldable
        [ Tuple piece.conn1.from (inputPort  piece.conn1.capacity)
        , Tuple piece.conn1.to   (outputPort piece.conn1.capacity)
        , Tuple piece.conn2.from (inputPort  piece.conn2.capacity)
        , Tuple piece.conn2.to   (outputPort piece.conn2.capacity)
        ]

  , isSimplifiable: Just $ IsConnection $
      M.fromFoldable
        [ Tuple piece.conn1.to piece.conn1.from
        , Tuple piece.conn2.to piece.conn2.from
        ]
  }

allConnectionPieces :: Array Piece
allConnectionPieces = 
  [ idPiece, leftPiece, rightPiece, superPiece
  , crossPiece, cornerCutPiece, chickenPiece, reverseChickenPiece
  ]

idPiece :: Piece
idPiece = mkConnectionPiece
  { capacity: OneBit
  , outputs: S.fromFoldable [ Direction.Right ]
  }

leftPiece :: Piece
leftPiece = mkConnectionPiece
  { capacity: OneBit 
  , outputs: S.fromFoldable [Direction.Up]
  }

rightPiece :: Piece
rightPiece = mkConnectionPiece 
  { capacity: OneBit
  , outputs: S.fromFoldable [Direction.Down]
  }

superPiece :: Piece
superPiece = mkConnectionPiece 
  { capacity: OneBit
  , outputs: S.fromFoldable [Direction.Up, Direction.Right, Direction.Down]
  }



crossPiece :: Piece
crossPiece = mkMultipleInputConnectionPiece
  { name: PieceId "cross-piece"
  , conn1:
    { from: Direction.Left
    , to: Direction.Right
    , capacity: OneBit
    }
  , conn2:
    { from: Direction.Up
    , to: Direction.Down
    , capacity: OneBit
    }
  }

cornerCutPiece :: Piece
cornerCutPiece = mkMultipleInputConnectionPiece
  { name: PieceId "corner-cut-piece"
  , conn1:
    { from: Direction.Left
    , to: Direction.Down
    , capacity: OneBit
    }
  , conn2:
    { from: Direction.Up
    , to: Direction.Right
    , capacity: OneBit
    }
  }

chickenPiece :: Piece
chickenPiece = mkMultipleInputConnectionPiece
  { name: PieceId "chicken-piece"
  , conn1:
    { from: Direction.Left
    , to: Direction.Down
    , capacity: OneBit
    }
  , conn2:
    { from: Direction.Right
    , to: Direction.Up
    , capacity: OneBit
    }
  }

reverseChickenPiece :: Piece
reverseChickenPiece = mkMultipleInputConnectionPiece
  { name: PieceId "reverse-chicken-piece"
  , conn1:
    { from: Direction.Left
    , to: Direction.Up
    , capacity: OneBit
    }
  , conn2:
    { from: Direction.Right
    , to: Direction.Down
    , capacity: OneBit
    }
  }