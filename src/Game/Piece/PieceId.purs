module Game.Piece.PieceId
  ( PieceId(..)
  , pieceId
  , wirePieceNames
  ) where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe')
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.Operation (PieceOperation(..), wireOutputs)

newtype PieceId = PieceId String
derive instance Newtype PieceId _
derive instance Eq PieceId
derive instance Ord PieceId
instance Show PieceId where
  show (PieceId id) = id

{-
  The name of a piece, derived from its operation. This name should be unique: if pieces with the same name are added to the `pieceVault`, pieceVault will not contain all of Pieces available.

  Capacity isn't part of the name: a 1 bit and an 8 bit not piece are both "not-piece".
-}
pieceId :: PieceOperation -> PieceId
pieceId = case _ of
  Not -> PieceId "not-piece"
  Or -> PieceId "or-piece"
  And -> PieceId "and-piece"
  Xor -> PieceId "xor-piece"

  Connection connections ->
    fromMaybe' (\_ -> PieceId ("connection-" <> show connections)) $
      case wireOutputs connections of
        Just outputs -> M.lookup outputs wirePieceNames
        Nothing -> M.lookup connections dualWirePieceNames

  Succ _ -> PieceId "succ"
  Adder _ -> PieceId "adder-piece"
  Multiplier -> PieceId "multiplier-piece"

  Fuse _ -> PieceId "fuse-piece"
  Sever _ -> PieceId "sever-piece"

  ShiftLeft _ -> PieceId "shift-left-piece"
  ShiftRight _ -> PieceId "shift-right-piece"
  TwoBitCrossOver -> PieceId "two-bit-cross-over"

  Equal -> PieceId "equal-piece"
  GreaterThan -> PieceId "greater-than-piece"
  LessThan -> PieceId "less-than-piece"



-- | Single wire pieces, by the set of sides they output to.
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

-- | Dual wire pieces, by their connections (output side -> the input side it copies).
dualWirePieceNames :: Map (Map CardinalDirection CardinalDirection) PieceId
dualWirePieceNames =
  M.fromFoldable
    [ Tuple (connections Direction.Right Direction.Up Direction.Down)    (PieceId "cross-piece")
    , Tuple (connections Direction.Down Direction.Up Direction.Right)    (PieceId "corner-cut-piece")
    , Tuple (connections Direction.Down Direction.Right Direction.Up)    (PieceId "chicken-piece")
    , Tuple (connections Direction.Up Direction.Right Direction.Down)    (PieceId "reverse-chicken-piece")
    ]
  where
    connections output1 input2 output2 = M.fromFoldable
      [ Tuple output1 Direction.Left
      , Tuple output2 input2
      ]
