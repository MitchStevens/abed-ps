module Test.Game.Piece.Globbing where

import Prelude

import Data.Foldable (for_)
import Data.FoldableWithIndex (allWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Debug (trace)
import Game.Direction (CardinalDirection)
import Game.Piece (Piece(..), allPieces, eval, glob, truncateInputs, unglob)
import Game.Signal (Signal)
import Test.Game.Piece (equivalentTo, lessThanOrEqPorts)
import Test.QuickCheck (assertEquals, mkSeed)
import Test.Spec (Spec, describe, it, itOnly)
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
            quickCheck $ \d -> glob d Nothing p `lessThanOrEqPorts` p
      it "p <= glob d (Just t) p" do
        for_ allPieces \p -> do
            quickCheck $ \d t -> p `lessThanOrEqPorts` glob d (Just t) p

      it "unglob p <= p" do
        for_ allPieces \p ->
         quickCheck $ \d t -> unglob p `lessThanOrEqPorts` glob d (Just t) p

      it "glob with no porttype is commutative" do
        for_ allPieces \p ->
          quickCheck $ \d1 d2 -> glob d1 Nothing (glob d2 Nothing p) `equivalentTo` glob d2 Nothing (glob d1 Nothing p)
      
      it "unglob is smallest piece" do
        for_ allPieces \p ->
          quickCheck $ \d t -> unglob p `lessThanOrEqPorts` glob d t p

