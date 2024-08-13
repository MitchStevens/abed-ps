module Game.Piece.TypeSafe.MkPiece where

import Prelude

import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Game.Piece.Complexity as Complexity
import Game.Piece.TypeSafe.Capacity (Capacity)
import Game.Piece.TypeSafe.Eval (HasEval)
import Game.Piece.TypeSafe.Name (HasName, specName)
import Game.Piece.TypeSafe.PieceSpec (class ValidPieceSpec, PieceSpec(..), insert)
import Game.Piece.TypeSafe.Port (class ValidPortSpec, HasPorts, specPorts)
import Game.Piece.Types (Piece(..), PieceId(..))
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
  , Lacks "ports" r
  , ValidPortSpec i
  , ValidPortSpec o
  , IsSymbol name
  ) => ReadyToBuild name i o r where
    toMkPiece spec =
      let PieceSpec builder = spec >>> specName @name  >>> specPorts @i @o
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
      { complexity: Complexity.space 0.0
      , shouldRipple: false
      , updateCapacity: \_ _ -> Nothing
      , updatePort: \_ _ -> Nothing
      , isSimplifiable: Nothing
      }