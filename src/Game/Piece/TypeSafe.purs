module Game.Piece.TypeSafe where

import Prelude hiding (bind, discard)

import Game.Piece (Piece(..))
import Game.Piece.TypeSafe.Types (PieceSpec(..))
import Halogen.HTML (object)
import Partial.Unsafe (unsafeCrashWith)
import Prim.Row (class Union)
import Unsafe.Coerce (unsafeCoerce)

pure  :: forall a. a -> PieceSpec () () a
pure a = PieceSpec a

bind :: forall i1 i2 i3 o1 o2 o3 a b c
  .  Union i1 i2 i3
  => Union o1 i2 i3
  => PieceSpec i1 o1 a 
  -> PieceSpec i2 o2 b
  -> PieceSpec i3 o3 c
bind = unsafeCrashWith ""

discard :: forall i1 i2 i3 o1 o2 o3 a b c
  .  Union i1 i2 i3
  => Union o1 i2 i3
  => PieceSpec i1 o1 a
  -> PieceSpec i2 o2 b 
  -> PieceSpec i3 o3 c
discard = unsafeCrashWith ""

--discard :: forall i1 i2 i3 o1 o2 o3 a b c
--  .  Union i1 i2 i3
--  => Union o1 i2 i3
--  => (PieceSpec i1 o1 a -> PieceSpec i2 o2 b)
--  -> (PieceSpec i2 o2 b -> PieceSpec i3 o3 c)
--  -> (PieceSpec i1 o1 a -> PieceSpec i3 o3 c)
--bind = (>>>)