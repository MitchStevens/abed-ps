module Game.Piece.TypeSafe.PieceSpec where

import Prelude

import Data.Array (fold)
import Data.Exists (Exists)
import Data.Map (Map)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, over, over2)
import Data.Symbol (class IsSymbol)
import Data.Variant (Variant)
import Game.Piece (CardinalDirection, Piece(..), PieceId(..), shouldRipple)
import Game.Piece as Piece
import Game.Piece.TypeSafe.Capacity (Capacity)
import Halogen.HTML (object)
import Partial.Unsafe (unsafeCrashWith)
import Prim.Row (class Cons, class Lacks, class Nub, class Union)
import Prim.RowList (class RowToList, Nil)
import Record (disjointUnion)
import Record.Builder (Builder)
import Record.Builder as Builder
import Type.Proxy (Proxy(..))
import Unsafe.Coerce (unsafeCoerce)

{-
  A `PieceSpec` contains the following information:
    - the inputs of the piece (encoded at the type level)
    - the outputs of the piece (encoded at the type level)
    - The additional configuration for the piece

-}
newtype PieceSpec :: Row Capacity -> Row Capacity -> Row Type -> Row Type -> Type
newtype PieceSpec i o r1 r2 = PieceSpec (Builder (Record r1) (Record r2))
derive instance Newtype (PieceSpec i o r1 r2) _

instance Semigroupoid (PieceSpec i o) where
  compose (PieceSpec f) (PieceSpec g) = PieceSpec (compose f g)

instance Category (PieceSpec i o) where
  identity = PieceSpec identity

class ValidPieceSpec :: Row Capacity -> Row Capacity -> Row Type -> Row Type -> Constraint
class ValidPieceSpec i o r1 r2
  





{-
  For a `PieceSpec` to be valid, it doesn't need to be 
  
  doesn't need to 

  `PieceSpec` is a builder

-}


insert :: forall @l a r1 r2 i o
  .  Cons l a r1 r2 
  => Lacks l r1 
  => IsSymbol l 
  => a -> PieceSpec i o r1 r2
insert a = PieceSpec (Builder.insert (Proxy :: Proxy l) a)

--complexity :: forall i o r. Piece.Complexity -> PieceSpec i o r { complexity :: Piece.Complexity | r }
complexity = insert @"complexity"

--ports :: forall i o.