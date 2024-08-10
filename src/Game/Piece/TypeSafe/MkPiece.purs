module Game.Piece.TypeSafe.MkPiece where

import Prelude

import Data.Map (Map)
import Data.Newtype (unwrap)
import Data.Symbol (reflectSymbol)
import Game.Piece (Piece(..), PieceId(..))
import Game.Piece as Piece
import Game.Piece.TypeSafe.PieceSpec (class ValidPieceSpec, PieceSpec(..), insert)
import Game.Piece.TypeSafe.Port (class ValidPortSpec, buildPortsSpec)
import Prim.Row (class Cons, class Lacks)
import Prim.RowList (class RowToList, Nil)
import Record.Builder as Builder
import Type.Proxy (Proxy(..))

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
type MkBuild r = 
  ( eval :: Map Piece.CardinalDirection Piece.Signal -> Map Piece.CardinalDirection Piece.Signal | r
  )

class ReadyToBuild i o r1 r2
instance
  ( Lacks "name" r2
  , RowToList r1 Nil
  , Cons "eval" (Map Piece.CardinalDirection Piece.Signal -> Map Piece.CardinalDirection Piece.Signal) rest r2
  , Lacks "ports" r2
  , ValidPortSpec i
  , ValidPortSpec o
  ) => ReadyToBuild i o r1 r2

mkPiece :: forall @name @i @o r
  .  ReadyToBuild i o () r
  => PieceSpec i o () (MkBuild r)
  -> Piece
mkPiece pieceSpec = buildPortsSpec >>> insert @"name" (PieceId $ reflectSymbol (Proxy :: Proxy name)) >>> pieceSpec
  # unwrap
  # Builder.buildFromScratch 
  # Piece.mkPiece