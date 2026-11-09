module Test.Component.Board.ViewModel where

import Prelude

import Component.Board.ViewModel (CellView(..), leafInputs, liveSource, maxDepth, staticSource, viewBoard)
import Data.Either (Either(..))
import Data.List (List(..), (:))
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Board (Board, BoardF(..), Cell(..), mkBoard)
import Game.Eval (compile, initialSignals, portInfo)
import Game.Location (Location, location)
import Game.Piece (andPiece, defaultPortInfo, getPorts, notPiece)
import Game.Port (noPort)
import Game.Rotation (Rotation, rotation)
import Data.FunctorWithIndex (mapWithIndex)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)

boardOf :: Int -> Array (Tuple Location { rotation :: Rotation, piece :: Cell }) -> Board
boardOf size pieces = mkBoard $ BoardF { size, ports: pure noPort, pieces: M.fromFoldable pieces, wormhole: Nothing }

nested :: Board -> { rotation :: Rotation, piece :: Cell }
nested b = { rotation: mempty, piece: Nested b }

-- boards nested `maxDepth` deep below the root, each holding a leaf at (0,0)
-- and the next board at (1,1)
deep :: Board
deep = go maxDepth
  where
    go 0 = boardOf 3 [ Tuple (location 0 0) { rotation: mempty, piece: Leaf andPiece } ]
    go k = boardOf 3
      [ Tuple (location 0 0) { rotation: rotation 1, piece: Leaf notPiece }
      , Tuple (location 1 1) (nested (go (k - 1)))
      ]

-- follow `NestedView`s through (1,1), as deep as they go
depthOf :: CellView -> Int
depthOf = case _ of
  NestedView bv -> 1 + maybe0 (M.lookup (location 1 1) bv.cells)
  _ -> 0
  where
    maybe0 = case _ of
      Just c -> depthOf c
      Nothing -> 0

spec :: Spec Unit
spec = describe "Component.Board.ViewModel" do
  describe "viewBoard" do
    it "draws maxDepth levels, counting the board itself, then stops" do
      let bv = viewBoard staticSource maxDepth Nil deep
      -- the root, then maxDepth - 1 nested levels
      (1 + maybe0 (M.lookup (location 1 1) bv.cells)) `shouldEqual` maxDepth
      isTooDeep (lastLevel bv) `shouldEqual` true

    it "keeps each leaf's rotation" do
      let bv = viewBoard staticSource maxDepth Nil deep
      (_.rotation <$> M.lookup (location 0 0) (leafInputs bv)) `shouldEqual` Just (rotation 1)

    it "uses defaultPortInfo when there's no evaluation" do
      let bv = viewBoard staticSource maxDepth Nil deep
      case M.lookup (location 0 0) bv.cells of
        Just (LeafView l) -> l.portStates `shouldEqual` defaultPortInfo notPiece
        _ -> fail "expected a leaf at (0,0)"

    it "reads a nested leaf's ports from where it sits in the tree" do
      case compile deep of
        Left err -> fail ("didn't compile: " <> show err)
        Right netlist -> do
          let signals = initialSignals netlist
              bv = viewBoard (liveSource netlist signals) maxDepth Nil deep
              index = location 1 1 : location 0 0 : Nil
              expected = mapWithIndex (\dir port -> portInfo netlist signals (Tuple index dir) port) (getPorts notPiece)
          nestedLeaf bv `shouldEqual` Just expected
  where
    maybe0 = case _ of
      Just c -> depthOf c
      Nothing -> 0

    lastLevel bv = case M.lookup (location 1 1) bv.cells of
      Just (NestedView inner) -> lastLevel inner
      other -> other

    isTooDeep = case _ of
      Just TooDeep -> true
      _ -> false

    nestedLeaf bv = case M.lookup (location 1 1) bv.cells of
      Just (NestedView inner) -> case M.lookup (location 0 0) inner.cells of
        Just (LeafView l) -> Just l.portStates
        _ -> Nothing
      _ -> Nothing
