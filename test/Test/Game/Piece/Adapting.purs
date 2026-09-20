module Test.Game.Piece.Adapting where

import Prelude

import Data.Foldable (for_)
import Data.FoldableWithIndex (allWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece (Piece(..), adapt, allPieces, eval, getPort, superPiece, truncateInputs)
import Game.Port (noPort)
import Game.Piece as Piece
import Game.Signal (Signal)
import Test.Game.Piece (equivalentTo, isLessAdaptedOrEqualTo)
import Test.QuickCheck (assertEquals)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec =
  describe "Game.Piece.Adapting" do
    describe "Properties" do
      it "adapt d noPort p <= p" do
        for_ allPieces \p ->
            quickCheck $ \d -> adapt d noPort p `isLessAdaptedOrEqualTo` p
      it "p <= adapt d port p" do
        for_ allPieces \p ->
            quickCheck $ \d port -> p `isLessAdaptedOrEqualTo` adapt d port p

      it "adapt with noPort is commutative" do
        for_ allPieces \p ->
          quickCheck $ \d1 d2 -> adapt d1 noPort (adapt d2 noPort p) `equivalentTo` adapt d2 noPort (adapt d1 noPort p)
    describe "Super Piece" do
      it "should adapt" do
        Piece.getPort (adapt Direction.Up noPort superPiece) Direction.Up `shouldEqual` Nothing
