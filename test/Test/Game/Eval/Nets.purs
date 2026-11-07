module Test.Game.Eval.Nets where

import Prelude

import Data.Array as A
import Data.Either (Either(..))
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Board.Types (Board, Cell(..), BoardError(..), BoardF(BoardF), mkBoard)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Eval.Flatten (Flat, flatten)
import Game.Eval.Nets (Nets, nets)
import Game.Frame (PortIndex)
import Game.Location (Location, location)
import Game.Piece (idPiece, notPiece)
import Game.Port (noPort)
import Game.Rotation (rotation)
import Test.Game.Eval.Flatten (board, cell, leftInRightOut, oscillator, port)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)

withNets :: Board -> (Nets -> Spec Unit) -> Spec Unit
withNets b k = case flatten b >>= nets of
  Right ns -> k ns
  Left err -> it "compiles to nets" (fail (show err))

slot :: Nets -> PortIndex -> Maybe Int
slot ns idx = M.lookup idx ns.portSlot

-- | All of `idxs` are in one net.
shareANet :: Nets -> Array PortIndex -> Boolean
shareANet ns idxs = case A.nub (map (slot ns) idxs) of
  [ Just _ ] -> true
  _ -> false

-- | `oscillator` with `idPiece` in place of `notPiece`: a wormhole loop that's
-- | nothing but wire.
wireLoop :: Board
wireLoop = mkBoard $ BoardF
  { size: 1
  , ports: leftInRightOut OneBit OneBit
  , pieces: M.singleton (location 0 0) (cell (Leaf idPiece) (rotation 0))
  , wormhole: Just { wormholeIn: Direction.Right, wormholeOut: Direction.Left }
  }

-- | A hand-built `Flat` -- `flatten` never produces two writers on a net, so
-- | that check can only be reached this way.
twoNots :: Flat
twoNots =
  { leaves: { index: L.singleton a, piece: notPiece } : { index: L.singleton b, piece: notPiece } : Nil
  , links: Nil
  , registers: Nil
  , boundary: pure noPort
  }

a :: Location
a = location 0 0

b :: Location
b = location 1 0

spec :: Spec Unit
spec = describe "Game.Eval.Nets" do
  let
    l = location 0 1
    m = location 1 1
    r = location 2 1
    o = location 0 0
    piece p = cell (Leaf p) (rotation 0)
    at loc = L.singleton loc

  describe "a row of pieces" do
    withNets (board 3 [ Tuple l (piece idPiece), Tuple m (piece notPiece), Tuple r (piece idPiece) ]) \ns -> do
      it "merges a wire's two ends with everything they're linked to" do
        shareANet ns [ port Nil Direction.Left, port (at l) Direction.Left, port (at l) Direction.Right, port (at m) Direction.Left ]
          `shouldEqual` true
        shareANet ns [ port (at m) Direction.Right, port (at r) Direction.Left, port (at r) Direction.Right, port Nil Direction.Right ]
          `shouldEqual` true
      it "keeps a gate's input and output apart" do
        (slot ns (port (at m) Direction.Left) == slot ns (port (at m) Direction.Right)) `shouldEqual` false
      it "has one slot per net, after the reserved two" do
        ns.slotCount `shouldEqual` 4
      it "counts each net's members" do
        A.sort (A.drop 2 ns.netSize) `shouldEqual` [ 4, 4 ]

  describe "unlinked ports" do
    withNets (board 3 [ Tuple o (piece notPiece) ]) \ns -> do
      it "each get a net of their own, never a reserved slot" do
        ns.slotCount `shouldEqual` 6
        A.all (_ >= 2) (A.fromFoldable (M.values ns.portSlot)) `shouldEqual` true
        ns.netSize `shouldEqual` [ 0, 0, 1, 1, 1, 1 ]

  describe "an empty board" do
    withNets (board 3 []) \ns -> do
      it "still gives each declared side a slot, for the harness" do
        ns.slotCount `shouldEqual` 4
        shareANet ns [ port Nil Direction.Left ] `shouldEqual` true
        shareANet ns [ port Nil Direction.Right ] `shouldEqual` true

  describe "a wormhole" do
    withNets oscillator \ns -> do
      it "keeps the mouth and tail in separate nets around a gate" do
        (slot ns (port Nil Direction.Right) == slot ns (port Nil Direction.Left)) `shouldEqual` false

    withNets wireLoop \ns -> do
      it "around nothing but wire, puts the mouth and tail in one net" do
        shareANet ns [ port Nil Direction.Right, port Nil Direction.Left ] `shouldEqual` true

  describe "MultipleWriters" do
    it "is raised when two gate outputs share a net" do
      let flat = twoNots { links = L.singleton (Tuple (port (at a) Direction.Right) (port (at b) Direction.Right)) }
      (nets flat $> unit) `shouldEqual` Left (MultipleWriters [ port (at a) Direction.Right, port (at b) Direction.Right ])

    it "is raised when a register's tail is also driven by a gate" do
      let
        flat = twoNots
          { leaves = L.singleton { index: at a, piece: notPiece }
          , links = L.singleton (Tuple (port (at a) Direction.Right) (port Nil Direction.Left))
          , registers = L.singleton { mouth: port Nil Direction.Right, tail: port Nil Direction.Left }
          }
      (nets flat $> unit) `shouldEqual` Left (MultipleWriters [ port (at a) Direction.Right, port Nil Direction.Left ])
