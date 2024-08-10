module Test.Game.Piece.TypeSafe where

import Prelude

import Data.Map (Map)
import Game.Piece as Piece
--import Game.Piece.TypeSafe.Eval (eval)

--in1 :: forall a. PieceSpec () () a -> PieceSpec ( l :: OneBit) () a
--in1 = input @Left @OneBit
-- 
---- out1 :: PieceSpec () ( r :: OneBit) Unit
---- out1 = PieceSpec.unit $ output @Right @OneBit
--
--wire1 :: forall a. PieceSpec () () a -> PieceSpec (l :: OneBit) (r :: OneBit) a
--wire1 = 
--  input @Left @OneBit >>> output @Right @OneBit
--
--eval1 :: PieceSpec (l :: OneBit) (r :: OneBit) {} -> PieceSpec (l :: OneBit) (r :: OneBit) { eval :: Map Piece.CardinalDirection Piece.Signal -> Map Piece.CardinalDirection Piece.Signal }
--eval1 = eval @(l :: OneBit) @(r :: OneBit) (\{ l } -> { r: not l })
--
--eval2 :: PieceSpec () () {} -> PieceSpec (l :: OneBit) (r :: OneBit) { eval :: Map Piece.CardinalDirection Piece.Signal -> Map Piece.CardinalDirection Piece.Signal }
--eval2 = 
--  input @Left @OneBit
--    >>> output @Right @OneBit
--    >>> eval @(l :: OneBit) @(r :: OneBit) (\{ l } -> { r: not l })