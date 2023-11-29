module Game.Piece.CommutativePiece where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Foldable (class Foldable, all, foldl, foldr, length)
import Data.HeytingAlgebra (ff, tt)
import Data.Int.Bits (and, xor)
import Data.List (List)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe)
import Data.Newtype (class Newtype, over2)
import Data.Semigroup.Commutative (class Commutative)
import Data.Tuple (Tuple(..))
import Game.Expression (Signal(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.APiece (APiece(..))
import Game.Piece.Class (class Piece, PieceId(..), defaultGetCapacity, defaultUpdateCapacity, updateCapacity)
import Game.Piece.Port (Capacity(..), Port, isInput, isOutput)
import Game.Piece.Port as Port

{-
  comm pieces must
    - have exactly 1 output to the right
    - have exactly 1 input to the left

    - have between 1 and 2 inputs on the top and bottom
-}
newtype CommutativePiece = Commutative
  { pieceId :: PieceId
  , capacity :: Capacity
  , ports :: Map CardinalDirection Port
  , eval :: List Signal -> Signal
  }

derive instance Newtype CommutativePiece _

--instance Piece CommutativePiece where
--  name (Commutative piece) = piece.pieceId
--  eval (Commutative piece) inputs = 
--    M.filter (not <<< isInput) piece.ports $> (piece.eval (M.values inputs))
--
--  getCapacity = defaultGetCapacity
--  updateCapacity = defaultUpdateCapacity
--
--  getPorts (Commutative piece) = piece.ports
--  updatePort =
--    preserveStandardPorts \dir port (Commutative piece) ->
--      fromMaybe (Commutative piece) do
--        guard (all isInput port)
--        pure $ Commutative (piece { ports = M.alter (\_ -> port) dir piece.ports})
    
--commutative :: String -> Capacity -> (List Signal -> Signal) -> CommutativePiece
--commutative name capacity eval = Commutative
--  { pieceId: PieceId name
--  , capacity
--  , ports: M.fromFoldable
--    [ Tuple Direction.Left  (Port.Input capacity)
--    , Tuple Direction.Up    (Port.Output capacity)
--    , Tuple Direction.Right (Port.Output capacity)
--    ]
--  , eval
--  }

allCommutativePieces :: Array APiece
allCommutativePieces = [  ]

--orPiece :: APiece
--orPiece = mkPiece $ commutative "or" OneBit (foldl (over2 Signal and) ff)


--orPiece :: APiece
--orPiece = mkPiece $ commutative "or" OneBit (foldl (over2 Signal and) ff)
--
--andPiece :: APiece
--andPiece = mkPiece $ commutative "and" OneBit (foldl (over2 Signal and) tt)
--
--xorPiece :: APiece
--xorPiece = mkPiece $ commutative "xor" OneBit (foldl (over2 Signal xor) ff)
