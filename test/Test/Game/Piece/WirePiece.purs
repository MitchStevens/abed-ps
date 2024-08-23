module Test.Game.Piece.WirePiece where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Direction as Direction
import Game.Piece (Simplification(..), chickenPiece, crossPiece, getInputDirs, getOutputDirs, idPiece, isSimplifiable, leftPiece)
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec =
  describe "Game.Piece.WirePiece" do
    describe "WirePiece" do
      it "leftPiece" do
        getInputDirs leftPiece `shouldEqual` S.fromFoldable [Direction.Left]
        getOutputDirs leftPiece `shouldEqual` S.fromFoldable [ Direction.Up ]

    describeOnly "isSimplifiable" do
      it "should simplify wire pieces" do
        isSimplifiable idPiece
          `shouldEqual` Just (Connection $ M.singleton Direction.Right Direction.Left)
        isSimplifiable leftPiece
          `shouldEqual` Just (Connection $ M.singleton Direction.Up Direction.Left)
        --isSimplifiable crossPiece
        --  `shouldEqual` Just (Connection $ M.fromFoldable
        --    [ Tuple Direction.Down Direction.Up
        --    , Tuple Direction.Right Direction.Left
        --    ])
        --isSimplifiable crossPiece
        --  `shouldEqual` Just (Connection $ M.fromFoldable
        --    [ Tuple Direction.Down Direction.Right
        --    , Tuple Direction.Up Direction.Left
        --    ])

  



