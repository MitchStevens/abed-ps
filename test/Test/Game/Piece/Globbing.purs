module Test.Game.Piece.Globbing where

import Prelude

import Data.Foldable (for_)
import Data.FoldableWithIndex (allWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Game.Direction (CardinalDirection)
import Game.Piece (Piece(..), allPieces, eval, glob, truncateInputs, unglob)
import Game.Signal (Signal)
import Test.Game.Piece (equivalentTo, lessThanOrEqTo)
import Test.QuickCheck (assertEquals)
import Test.Spec (Spec, describe, it)
import Test.Spec.QuickCheck (quickCheck)

spec :: Spec Unit
spec =
  describe "Game.Piece.Globbing" do
    describe "Properties" do
      it "unglob is idempotent" do
        for_ allPieces \p ->
          quickCheck $
            unglob (unglob p) `equivalentTo` unglob p
      it "glob d Nothing p <= p" do
        for_ allPieces \p ->
            quickCheck $ \d -> glob d Nothing p `lessThanOrEqTo` p

