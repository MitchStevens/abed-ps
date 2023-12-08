module Test.Game.Piece.WirePiece where

import Prelude

import Data.Set as S
import Game.Direction as Direction
import Game.Piece (getInputDirs, getOutputDirs, leftPiece)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = describe "WirePiece" do
  it "leftPiece" do
    getInputDirs leftPiece `shouldEqual` S.fromFoldable [Direction.Left]
    getOutputDirs leftPiece `shouldEqual` S.fromFoldable [ Direction.Up ]



