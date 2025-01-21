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
      it "p <= glob d (Just t) p" do
        for_ allPieces \p ->
            quickCheck $ \d t -> p `lessThanOrEqTo` glob d (Just t) p
      it "unglob p <= p" do
        for_ allPieces \p ->
            quickCheck $ \d t -> unglob p `lessThanOrEqTo` glob d (Just t) p

      it "glob with no porttype is commutative" do
        for_ allPieces \p ->
          quickCheck $ \d1 d2 -> glob d1 Nothing (glob d2 Nothing p) `equivalentTo` glob d2 Nothing (glob d1 Nothing p)
      
      it "unglob is smallest piece" do
        for_ allPieces \p ->
          quickCheck $ \d t -> unglob p `lessThanOrEqTo` glob d t p

