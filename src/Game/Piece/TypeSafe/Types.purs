module Game.Piece.TypeSafe.Types where

import Prelude

import Data.Array (fold)
import Data.Exists (Exists)
import Data.Map (Map)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe)
import Data.Variant (Variant)
import Game.Piece (CardinalDirection, Piece(..), PieceId(..))
import Game.Piece as Piece
import Game.Piece.Port (Port(..))
import Game.Piece.Signal (Signal(..))
import Halogen.HTML (object)
import Partial.Unsafe (unsafeCrashWith)
import Prim.Row (class Cons, class Union)
import Prim.RowList (class RowToList, Nil)
import Unsafe.Coerce (unsafeCoerce)

data Capacity
foreign import data OneBit   :: Capacity
foreign import data TwoBit   :: Capacity
foreign import data FourBit  :: Capacity
foreign import data EightBit :: Capacity

class CapacityValue (capacity :: Capacity) where
  getCapacityValue :: Piece.Capacity

instance CapacityValue OneBit   where getCapacityValue = Piece.OneBit
instance CapacityValue TwoBit   where getCapacityValue = Piece.TwoBit
instance CapacityValue FourBit  where getCapacityValue = Piece.FourBit
instance CapacityValue EightBit where getCapacityValue = Piece.EightBit

class DirectionValue (symbol :: Symbol) where
  getDirectionValue :: Piece.CardinalDirection

instance DirectionValue "u" where getDirectionValue = Piece.Up
instance DirectionValue "r" where getDirectionValue = Piece.Right
instance DirectionValue "d" where getDirectionValue = Piece.Down
instance DirectionValue "l" where getDirectionValue = Piece.Left

class ValidPortSpec :: Row Capacity -> Constraint
class ValidPortSpec portSpec where
  ports :: Map Piece.CardinalDirection Piece.Capacity

instance
  ( Cons dir capacity p p'
  , ValidPortSpec p
  , DirectionValue dir
  , CapacityValue capacity
  ) => ValidPortSpec p' where
    ports = M.union
      (Map.singleton (getDirectionValue @dir) (getCapacityValue @capacity))
      (ports @p)
else instance 
  ( RowToList p Nil
  ) => ValidPortSpec p where
    ports = Map.empty


data PieceSpec :: Row Capacity -> Row Capacity -> Type -> Type
data PieceSpec i o a = PieceSpec a

class ValidPieceSpec :: Type -> Constraint
class ValidPieceSpec pieceSpec where
  inputPorts  :: Map CardinalDirection Port
  outputPorts :: Map CardinalDirection Port

instance
  (Cons dir capacity i i'
  , ValidPieceSpec (PieceSpec i o a)
  ) => ValidPieceSpec (PieceSpec i' o a) where
  inputPorts = Map.empty
  outputPorts = Map.empty
else instance
  (Cons dir capacity o o'
  , ValidPieceSpec (PieceSpec i o a)
  ) => ValidPieceSpec (PieceSpec i o' a) where
  inputPorts = Map.empty
  outputPorts = Map.empty
else instance
  ( RowToList i Nil
  , RowToList o Nil
  ) => ValidPieceSpec (PieceSpec i o' a) where
  inputPorts = Map.empty
  outputPorts = Map.empty





type Up = "u"
type Right = "r"
type Down = "d"
type Left = "l"

input :: forall @dir (@capacity :: Capacity) i i' o a.
  Cons dir capacity i i' =>
  PieceSpec i o a ->
  PieceSpec i' o a
input = unsafeCoerce

output :: forall @dir (@capacity :: Capacity) i o o' a.
  Cons dir capacity o o' =>
  PieceSpec i o a ->
  PieceSpec i o' a
output = unsafeCoerce

mkPiece :: forall i o a. (PieceSpec () () a -> PieceSpec i o a) -> Piece
mkPiece = unsafeCoerce