module Test.Game.Piece.TypeSafe where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Tuple (Tuple(..))
import Game.Piece (Piece(..), getPorts, inputPort, outputPort)
import Game.Piece as Capacity
import Game.Piece as Direction
import Game.Piece as Piece
import Game.Piece.TypeSafe.Capacity (OneBit)
import Game.Piece.TypeSafe.Eval (HasEval, eval)
import Game.Piece.TypeSafe.MkPiece (mkPiece)
import Game.Piece.TypeSafe.PieceSpec (PieceSpec)
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (shouldEqual)

identitySpec :: PieceSpec (l :: OneBit) (r :: OneBit) () (HasEval ())
identitySpec = eval $ \{ l } -> { r: l }

id :: Piece
id = mkPiece @"id" identitySpec

spec :: Spec Unit
spec = describeOnly "Game.Piece.TypeSafe" do
  describe "identity" do
    it "should return the correct ports" $
      getPorts id `shouldEqual` M.fromFoldable
        [ Tuple Direction.Left  (inputPort Capacity.OneBit)
        , Tuple Direction.Right (outputPort Capacity.OneBit)
        ]


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