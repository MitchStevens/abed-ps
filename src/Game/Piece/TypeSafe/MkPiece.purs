module Game.Piece.TypeSafe.MkPiece where

import Prelude

import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Game.Piece (Piece(..), PieceId(..))
import Game.Piece as Piece
import Game.Piece.TypeSafe.Capacity (Capacity)
import Game.Piece.TypeSafe.Eval (HasEval)
import Game.Piece.TypeSafe.Name (HasName, specName)
import Game.Piece.TypeSafe.PieceSpec (class ValidPieceSpec, PieceSpec(..), insert)
import Game.Piece.TypeSafe.Port (class ValidPortSpec, HasPorts, specPorts)
import Partial.Unsafe (unsafeCrashWith)
import Prim.Row (class Cons, class Lacks)
import Prim.RowList (class RowToList, Nil)
import Record.Builder (Builder, buildFromScratch)
import Record.Builder as Builder
import Record.Unsafe.Union (unsafeUnion)
import Type.Proxy (Proxy(..))
import Type.Row (RowApply, type (+))

{-
  Goals:
    - puts constraints on the 
    - no performance hit to pieces created type safely
    - syntax to create pieces should be shorter than using `Piece.mkPiece`

  Constraints on PieceSpec i o s a:
    - `Record s` must contain field `"eval" :: `

  


  Minimal Syntax to create a piece:

    ```
      mkPiece "identity" @(l :: OneBit) @(r :: OneBit) do
        eval $ \{ l } -> { r: l }
    ```

-}
--class MkPiece i o s where
--  mkPiece :: forall r. PieceSpec i o () (Piece.MkPiece r) -> Piece

--instance 
--  ( ValidPortSpec i
--  , ValidPortSpec o
--  , No
--  ) => MkPiece (PieceSpec i o s Unit) where
--    mkPiece (PieceSpec s _) = Piece.mkPiece
--      { name: PieceId "hello"
--      , eval: identity
--      , ports: getPorts @i @o
--      }

class ReadyToBuild :: Symbol -> Row Capacity -> Row Capacity -> Row Type -> Constraint
class 
  ( Lacks "name" r 
  , Lacks "ports" r
  , ValidPortSpec i
  , ValidPortSpec o
  , IsSymbol name
  ) <= ReadyToBuild name i o r where
    toMkPiece :: PieceSpec i o () (HasEval r) -> Record (HasName + HasEval + HasPorts + r)
instance
  ( Lacks "name" r
  , Cons "eval" (Map Piece.CardinalDirection Piece.Signal -> Map Piece.CardinalDirection Piece.Signal) rest r2
  , Lacks "ports" r
  , ValidPortSpec i
  , ValidPortSpec o
  , IsSymbol name
  ) => ReadyToBuild name i o r where
    toMkPiece spec =
      let PieceSpec builder = spec >>> specName @name  >>> specPorts @i @o :: PieceSpec i o () (HasName + HasEval + HasPorts + r)
      in buildFromScratch builder
    
    
  


mkPiece :: forall @name i o r
  .  ReadyToBuild name i o r
  => PieceSpec i o () (HasEval + r)
  -> Piece
mkPiece spec = Piece (unsafeUnion piece defaultPiece)
  where
    piece :: Record (HasName + HasEval + HasPorts + r)
    piece = toMkPiece @name spec

    defaultPiece =
      { complexity: Piece.space 0.0
      , shouldRipple: false
      , updateCapacity: \_ _ -> Nothing
      , updatePort: \_ _ -> Nothing
      , isSimplifiable: Nothing
      }