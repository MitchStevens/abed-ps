module Test.Game.Frame where

import Prelude

import Data.Array as Array
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as Set
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.Frame (Frame, directionsWhere, eval, fromFoldable, fromMap, index, set, singleton, tabulate, toMapBy)
import Game.Piece (getPorts, idPiece)
import Game.Port (inputPort, noPort, outputPort)
import Game.Signal (Signal, mkSignal)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)
import Unsafe.Coerce (unsafeCoerce)

-- | `value` on one side, `zero` everywhere else.
sideFrame :: CardinalDirection -> Signal -> Frame Signal
sideFrame = singleton zero

spec :: Spec Unit
spec = describe "Game.Frame" do
  describe "Frame" do
    it "tabulate and index are inverses" do
      quickCheck \(frame :: Frame Signal) -> tabulate (\dir -> index dir frame) === frame
    it "index reads back what tabulate was given, side by side" do
      let frame = tabulate \dir -> mkSignal case dir of
            Direction.Up -> 1
            Direction.Right -> 2
            Direction.Down -> 3
            Direction.Left -> 4
      index Direction.Up frame `shouldEqual` mkSignal 1
      index Direction.Right frame `shouldEqual` mkSignal 2
      index Direction.Down frame `shouldEqual` mkSignal 3
      index Direction.Left frame `shouldEqual` mkSignal 4
    it "pure puts the same value on every side" do
      quickCheck \(signal :: Signal) (dir :: CardinalDirection) -> index dir (pure signal) === signal
    it "obeys the applicative identity law" do
      quickCheck \(frame :: Frame Signal) -> (pure identity <*> frame) === frame
    it "fromMap fills the sides a map lacks with its default" do
      fromMap zero (M.singleton Direction.Right (mkSignal 5)) `shouldEqual` sideFrame Direction.Right (mkSignal 5)
    it "is a plain { u, r, d, l } object at runtime, so it can be inspected from JavaScript" do
      quickCheck \(frame :: Frame Signal) ->
        let
          raw :: { u :: Signal, r :: Signal, d :: Signal, l :: Signal }
          raw = unsafeCoerce frame
        in
          [ raw.u, raw.r, raw.d, raw.l ] === map (\dir -> index dir frame) [ Direction.Up, Direction.Right, Direction.Down, Direction.Left ]

  describe "building" do
    it "singleton puts the value on one side and the default on the other three" do
      quickCheck \(dir :: CardinalDirection) (value :: Signal) (other :: CardinalDirection) ->
        index other (singleton zero dir value) === (if other == dir then value else zero)
    it "set replaces one side and leaves the other three alone" do
      quickCheck \(dir :: CardinalDirection) (value :: Signal) (frame :: Frame Signal) (other :: CardinalDirection) ->
        index other (set dir value frame) === (if other == dir then value else index other frame)
    it "set is singleton onto a constant frame" do
      quickCheck \(dir :: CardinalDirection) (value :: Signal) ->
        set dir value (pure zero) === singleton zero dir value
    it "fromFoldable fills the sides no entry names with its default" do
      fromFoldable zero [ Tuple Direction.Left (mkSignal 4) ] `shouldEqual` sideFrame Direction.Left (mkSignal 4)
    it "fromFoldable lets the last entry for a side win, like Map.fromFoldable" do
      fromFoldable zero [ Tuple Direction.Up (mkSignal 1), Tuple Direction.Up (mkSignal 2) ]
        `shouldEqual` sideFrame Direction.Up (mkSignal 2)
    it "fromFoldable agrees with fromMap on a Map's entries" do
      quickCheck \(entries :: Array (Tuple CardinalDirection Signal)) ->
        fromFoldable zero entries === fromMap zero (M.fromFoldable entries)

  describe "querying" do
    it "directionsWhere is the set of sides satisfying the predicate" do
      quickCheck \(frame :: Frame Signal) ->
        directionsWhere (_ /= zero) frame
          === Set.fromFoldable (Array.filter (\dir -> index dir frame /= zero) allDirections)
    it "directionsWhere finds the one non-zero side of a singleton" do
      directionsWhere (_ /= zero) (sideFrame Direction.Right (mkSignal 5)) `shouldEqual` Set.singleton Direction.Right
    it "toMapBy drops the sides that fail the predicate" do
      toMapBy (_ /= zero) (sideFrame Direction.Down (mkSignal 3)) `shouldEqual` M.singleton Direction.Down (mkSignal 3)
    it "toMapBy and fromMap round-trip when the dropped sides all hold the default" do
      quickCheck \(frame :: Frame Signal) ->
        fromMap zero (toMapBy (_ /= zero) frame) === frame

  describe "ordering" do
    it "compare says EQ exactly when Eq says equal" do
      quickCheck \(a :: Frame Signal) (b :: Frame Signal) ->
        (compare a b == EQ) === (a == b)

  describe "a piece's ports" do
    it "have a port exactly where the piece does, and noPort everywhere else" do
      getPorts idPiece `shouldEqual` tabulate case _ of
        Direction.Left -> inputPort OneBit
        Direction.Right -> outputPort OneBit
        _ -> noPort

  describe "Evaluable Piece" do
    it "runs the piece's own eval, over Frames rather than Maps" do
      eval idPiece (sideFrame Direction.Left (mkSignal 1)) `shouldEqual` sideFrame Direction.Right (mkSignal 1)
    it "ignores a value on a side the piece doesn't read" do
      -- idPiece only reads Left, so a signal sitting on Up changes nothing
      eval idPiece (sideFrame Direction.Up (mkSignal 3)) `shouldEqual` pure zero
