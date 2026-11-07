module Test.Game.Eval.Gates where

import Prelude

import Data.Either (Either(..))
import Data.List (List(..))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Board.Types (Board, Cell(..), BoardError(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Eval.Flatten (Flat, flatten)
import Game.Eval.Gates (Gate, gates, orderGates)
import Game.Eval.Nets (Nets, nets, scratchSlot, zeroSlot)
import Game.Frame (PieceIndex, PortIndex)
import Game.Frame as Frame
import Game.Location (Location, location)
import Game.Piece (Piece(..), idPiece, notPiece)
import Game.Piece.Operation as Operation
import Game.Port (inputPort, noPort, outputPort)
import Game.Rotation (rotation)
import Test.Game.Eval.Flatten (board, cell, oscillator, port)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)

type Compiled = { ns :: Nets, gs :: Array Gate }

compileGates :: Flat -> Either BoardError Compiled
compileGates flat = do
  ns <- nets flat
  pure { ns, gs: gates flat ns }

withGates :: Board -> (Compiled -> Spec Unit) -> Spec Unit
withGates b k = case flatten b >>= compileGates of
  Right c -> k c
  Left err -> it "compiles to gates" (fail (show err))

orderOf :: Board -> Either BoardError (Array PieceIndex)
orderOf b = map _.index <$> (flatten b >>= compileGates >>= _.gs >>> orderGates)

slotOf :: Nets -> PortIndex -> Int
slotOf ns idx = fromMaybe (-1) (M.lookup idx ns.portSlot)

-- | A gate (not a wire) reading `inputDir` and writing `outputDir`.
turnPiece :: CardinalDirection -> CardinalDirection -> Piece
turnPiece inputDir outputDir = Piece
  { op: Operation.Not
  , ports: Frame.fromFoldable noPort [ Tuple inputDir (inputPort OneBit), Tuple outputDir (outputPort OneBit) ]
  }

-- | `turnPiece` with `Connection` instead: a wire round the same corner.
turnWire :: CardinalDirection -> CardinalDirection -> Piece
turnWire inputDir outputDir = Piece
  { op: Operation.Connection (M.singleton outputDir inputDir)
  , ports: Frame.fromFoldable noPort [ Tuple inputDir (inputPort OneBit), Tuple outputDir (outputPort OneBit) ]
  }

-- | Four corners in the top-left of a 3x3 board, each feeding the next
-- | clockwise.
ring :: (CardinalDirection -> CardinalDirection -> Piece) -> Board
ring mk = board 3
  [ Tuple (location 0 0) (cell (Leaf (mk Direction.Down Direction.Right)) (rotation 0))
  , Tuple (location 1 0) (cell (Leaf (mk Direction.Left Direction.Down)) (rotation 0))
  , Tuple (location 1 1) (cell (Leaf (mk Direction.Up Direction.Left)) (rotation 0))
  , Tuple (location 0 1) (cell (Leaf (mk Direction.Right Direction.Up)) (rotation 0))
  ]

a :: Location
a = location 0 0

spec :: Spec Unit
spec = describe "Game.Eval.Gates" do
  let
    l = location 0 1
    m = location 1 1
    r = location 2 1
    o = location 0 0
    piece p = cell (Leaf p) (rotation 0)
    turned p = cell (Leaf p) (rotation 2)
    at loc = L.singleton loc

  describe "gates" do
    withGates (board 3 [ Tuple l (piece idPiece), Tuple m (piece notPiece), Tuple r (piece idPiece) ]) \{ ns, gs } -> do
      it "skips wires" do
        map _.index gs `shouldEqual` [ at m ]
      it "reads each readable side's net, and zero everywhere else" do
        map _.inputs gs `shouldEqual` [ Frame.singleton zeroSlot Direction.Left (slotOf ns (port Nil Direction.Left)) ]
      it "writes each writable side's net, and scratch everywhere else" do
        map _.outputs gs `shouldEqual` [ Frame.singleton scratchSlot Direction.Right (slotOf ns (port Nil Direction.Right)) ]

  describe "orderGates" do
    it "orders an empty board" do
      orderOf (board 3 []) `shouldEqual` Right []

    it "runs each gate after the ones it reads from, whatever order they're stored in" do
      -- turned half way, the chain runs right to left: r feeds m feeds l
      orderOf (board 3 [ Tuple l (turned notPiece), Tuple m (turned notPiece), Tuple r (turned notPiece) ])
        `shouldEqual` Right [ at r, at m, at l ]

    it "rejects a ring of gates" do
      orderOf (ring turnPiece) `shouldEqual` Left Cyclic

    it "accepts a ring of wires, which is one net nothing drives" do
      orderOf (ring turnWire) `shouldEqual` Right []

    it "rejects a gate that reads its own output" do
      let
        flat =
          { leaves: L.singleton { index: at a, piece: notPiece }
          , links: L.singleton (Tuple (port (at a) Direction.Right) (port (at a) Direction.Left))
          , registers: Nil
          , boundary: pure noPort
          }
      (map _.index <$> (compileGates flat >>= _.gs >>> orderGates)) `shouldEqual` Left Cyclic

    it "accepts feedback through a board wormhole" do
      orderOf oscillator `shouldEqual` Right [ at o ]

    it "accepts a gate with nothing at the declared sides" do
      orderOf (board 3 [ Tuple m (piece notPiece) ]) `shouldEqual` Right [ at m ]
