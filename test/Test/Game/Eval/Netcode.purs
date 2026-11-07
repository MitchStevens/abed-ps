-- | The new evaluator's behaviour, end to end: `compile` a `Board`, then run
-- | it. This is the spec for evaluation -- truncation, wormholes, nesting --
-- | rather than for any one compiler pass.
module Test.Game.Eval.Netcode where

import Prelude

import Data.Array as A
import Data.Either (Either(..), either)
import Data.Foldable (for_)
import Data.Lens (view)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Traversable (scanl)
import Data.Tuple (Tuple(..), fst, snd)
import Game.Board (BoardError, BoardM, _focus, _ports, addPiece, execBoardM, rebuild, runAtFocus, unzoomed, zoomIn)
import Game.Board.Types (Board, Cell(..), BoardF(BoardF), mkBoard)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Eval.Netcode (boundaryPortInfo, evaluate, initialSignals, portInfo, run, step)
import Game.Eval.Netlist (Netlist, compile)
import Game.Frame (Frame, PortIndex)
import Game.Frame as Frame
import Game.Location (location)
import Game.Piece (Piece(..), idPiece, notPiece)
import Game.Piece.Operation as Operation
import Game.Port (inputPort, noPort, outputPort)
import Game.PortInfo (noPortInfo)
import Game.Rotation (rotation)
import Game.Signal (Signal, mkSignal)
import Partial.Unsafe (unsafeCrashWith)
import Test.Game.Eval.Flatten (board, cell, leftInRightOut, oscillator, port)
import Test.QuickCheck ((===))
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

compileOrCrash :: Board -> Netlist
compileOrCrash b = case compile b of
  Right netlist -> netlist
  Left err -> unsafeCrashWith ("compile: " <> show err)

left :: Signal -> Frame Signal
left = Frame.singleton zero Direction.Left

-- | What `notPiece` makes of `zero`. `Operation.Not` doesn't know its
-- | capacity, so this is every bit set, not just the one bit `notPiece` has.
on :: Signal
on = not zero

right :: Signal -> Frame Signal
right = Frame.singleton zero Direction.Right

-- | The signal at `idx` before the first tick, then after each of `n` ticks
-- | with no harness input.
probe :: Netlist -> PortIndex -> Int -> Array Signal
probe netlist idx n = map (\signals -> (portInfo netlist signals idx (outputPort OneBit)).signal) states
  where
  states = A.cons (initialSignals netlist) (scanl (\signals _ -> snd (step netlist (pure zero) signals)) (initialSignals netlist) (A.replicate n unit))

-- | Copies Up to both Down and Right: a wire that splits.
splitPiece :: Piece
splitPiece = Piece
  { op: Operation.Connection (M.fromFoldable [ Tuple Direction.Down Direction.Up, Tuple Direction.Right Direction.Up ])
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Up (inputPort OneBit)
      , Tuple Direction.Down (outputPort OneBit)
      , Tuple Direction.Right (outputPort OneBit)
      ]
  }

spec :: Spec Unit
spec = describe "Game.Eval.Netcode" do
  let
    l = location 0 1
    m = location 1 1
    r = location 2 1
    o = location 0 0
    piece p = cell (Leaf p) (rotation 0)

  describe "a combinational board" do
    it "carries a signal along a wire" do
      let netlist = compileOrCrash (board 1 [ Tuple o (piece idPiece) ])
      quickCheck \(s :: Signal) -> evaluate netlist (left s) === right s

    it "carries a signal through a gate, between wires" do
      let netlist = compileOrCrash (board 3 [ Tuple l (piece idPiece), Tuple m (piece notPiece), Tuple r (piece idPiece) ])
      quickCheck \(s :: Signal) -> evaluate netlist (left s) === right (not s)

    it "evaluates a piece alone on a 1x1 board" do
      let netlist = compileOrCrash (board 1 [ Tuple o (piece notPiece) ])
      quickCheck \(s :: Signal) -> evaluate netlist (left s) === right (not s)

    it "outputs zero on a declared side nothing drives" do
      let netlist = compileOrCrash (board 3 [])
      quickCheck \(s :: Signal) -> evaluate netlist (left s) === pure zero

    it "ignores input on a side that isn't a declared input" do
      let netlist = compileOrCrash (board 1 [ Tuple o (piece idPiece) ])
      evaluate netlist (Frame.fromFoldable (mkSignal 1) []) `shouldEqual` right (mkSignal 1)
      evaluate netlist (Frame.singleton (mkSignal 1) Direction.Left zero) `shouldEqual` right zero

  describe "boundaryPortInfo" do
    let
      netlist = compileOrCrash (board 1 [ Tuple o (piece idPiece) ])
      info = boundaryPortInfo netlist (snd (step netlist (left one) (initialSignals netlist)))

    it "describes the sides the board declares a port on" do
      (Frame.index Direction.Left info).port `shouldEqual` inputPort OneBit
      (Frame.index Direction.Right info).port `shouldEqual` outputPort OneBit
      (Frame.index Direction.Right info).signal `shouldEqual` one
      (Frame.index Direction.Right info).connected `shouldEqual` true

    it "is noPortInfo on every side it declares no port on" do
      Frame.index Direction.Up info `shouldEqual` noPortInfo
      Frame.index Direction.Down info `shouldEqual` noPortInfo

  describe "connected" do
    let
      connected netlist idx p = (portInfo netlist (initialSignals netlist) idx p).connected

    it "is false for a wire with nothing at either end, though its ends share a net" do
      let netlist = compileOrCrash (board 3 [ Tuple m (piece idPiece) ])
      connected netlist (port (L.singleton m) Direction.Left) (inputPort OneBit) `shouldEqual` false
      connected netlist (port (L.singleton m) Direction.Right) (outputPort OneBit) `shouldEqual` false

    it "is true for each end that meets a neighbour" do
      let netlist = compileOrCrash (board 3 [ Tuple m (piece idPiece), Tuple r (piece idPiece) ])
      connected netlist (port (L.singleton m) Direction.Left) (inputPort OneBit) `shouldEqual` false
      connected netlist (port (L.singleton m) Direction.Right) (outputPort OneBit) `shouldEqual` true
      connected netlist (port (L.singleton r) Direction.Left) (inputPort OneBit) `shouldEqual` true

    it "is true for an end that meets a board side" do
      let netlist = compileOrCrash (board 3 [ Tuple r (piece idPiece) ])
      connected netlist (port (L.singleton r) Direction.Right) (outputPort OneBit) `shouldEqual` true

  describe "truncation" do
    it "never lets a piece write over a neighbour's output through its input" do
      -- `Operation.Not` writes `zero` to every side but `Right`, including its
      -- `Left`, which is the middle `notPiece`'s output
      let netlist = compileOrCrash (board 3 [ Tuple l (piece idPiece), Tuple m (piece notPiece), Tuple r (piece notPiece) ])
      quickCheck \(s :: Signal) -> evaluate netlist (left s) === right s

  describe "a board wormhole" do
    let netlist = compileOrCrash oscillator
    it "feeds the mouth back to the tail a tick later" do
      -- the tail starts at zero, so `notPiece` first writes `not zero`
      probe netlist (port Nil Direction.Right) 4 `shouldEqual` [ zero, on, zero, on, zero ]

    it "is hidden from the harness" do
      run netlist (A.replicate 2 (Frame.fromFoldable (mkSignal 1) [])) `shouldEqual` A.replicate 2 (pure zero)

    it "reports its endpoints as connected" do
      (boundaryPortInfo netlist (initialSignals netlist) <#> _.connected) `shouldEqual` pure false
      (portInfo netlist (initialSignals netlist) (port Nil Direction.Right) (outputPort OneBit)).connected `shouldEqual` true


  describe "a nested board" do
    -- A wire straight across the middle row. Swapping its middle piece for a
    -- sub-board holding the same wire shouldn't change what the board does.
    let
      wire = board 3 [ Tuple l (piece idPiece), Tuple m (piece idPiece), Tuple r (piece idPiece) ]
      nested = board 3 [ Tuple l (piece idPiece), Tuple m (cell (Nested wire) (rotation 0)), Tuple r (piece idPiece) ]
      flat = compileOrCrash wire
      deep = compileOrCrash nested

    it "carries a signal along a wire" do
      quickCheck \(s :: Signal) -> evaluate flat (left s) === right s

    it "carries a signal along a wire that passes through a sub-board" do
      quickCheck \(s :: Signal) -> evaluate deep (left s) === right s

    it "behaves the same as the wire it replaces, tick by tick" do
      let inputs = left <$> [ zero, on, on, zero, on ]
      run deep inputs `shouldEqual` run flat inputs

  describe "a nested board built by zooming in, as the game does" do
    -- Same two boards, but built with `addPiece`, and the sub-board made by
    -- zooming into the empty middle slot, as a player would.
    let
      addWire :: BoardM Unit
      addWire = for_ [ l, m, r ] \loc -> addPiece loc idPiece
      orCrash :: forall a. Either BoardError a -> a
      orCrash = either (\err -> unsafeCrashWith (show err)) identity
      flat = compileOrCrash (orCrash (execBoardM addWire (board 3 [])))
      deepBoard = orCrash do
        outer <- execBoardM (for_ [ l, r ] \loc -> addPiece loc idPiece) (board 3 [])
        zoomed <- zoomIn m (unzoomed outer)
        Tuple _ zoomed' <- runAtFocus addWire zoomed
        pure (rebuild zoomed')
      deep = compileOrCrash deepBoard

    it "gives the sub-board a port wherever its wire meets a side" do
      let subBoardPorts = view (_focus <<< _ports) <$> zoomIn m (unzoomed deepBoard)
      subBoardPorts `shouldEqual` Right (leftInRightOut OneBit OneBit)

    it "carries a signal along the flat wire" do
      quickCheck \(s :: Signal) -> evaluate flat (left s) === right s

    it "carries a signal along the wire through the sub-board" do
      quickCheck \(s :: Signal) -> evaluate deep (left s) === right s

  describe "nested wormholes" do
    -- The inner board's wormhole runs Right (mouth) to Up (tail) through a
    -- `notPiece`, and its tail is wired, via `splitPiece`, out of its Down
    -- side. The outer board's wormhole captures that Down side and feeds it
    -- to an otherwise unused Up side. So the inner tail and the outer mouth
    -- are one net, and the outer tail should lag the inner tail by one tick.
    let
      inner = mkBoard $ BoardF
        { size: 3
        , ports: Frame.fromFoldable noPort
            [ Tuple Direction.Up (inputPort OneBit)
            , Tuple Direction.Right (outputPort OneBit)
            , Tuple Direction.Down (outputPort OneBit)
            ]
        , pieces: M.fromFoldable
            [ Tuple (location 1 0) (cell (Leaf idPiece) (rotation 1))
            , Tuple (location 1 1) (piece splitPiece)
            , Tuple (location 2 1) (piece notPiece)
            , Tuple (location 1 2) (cell (Leaf idPiece) (rotation 1))
            ]
        , wormhole: Just { wormholeIn: Direction.Right, wormholeOut: Direction.Up }
        }
      outer = mkBoard $ BoardF
        { size: 1
        , ports: Frame.fromFoldable noPort
            [ Tuple Direction.Up (inputPort OneBit)
            , Tuple Direction.Down (outputPort OneBit)
            ]
        , pieces: M.singleton o (cell (Nested inner) (rotation 0))
        , wormhole: Just { wormholeIn: Direction.Down, wormholeOut: Direction.Up }
        }
      netlist = compileOrCrash outer
      innerTail = port (L.singleton o) Direction.Up
      outerTail = port Nil Direction.Up

    it "share a net where the inner tail meets the outer mouth" do
      (M.lookup innerTail netlist.portSlot == M.lookup (port Nil Direction.Down) netlist.portSlot) `shouldEqual` true

    it "the inner tail toggles every tick" do
      probe netlist innerTail 4 `shouldEqual` [ zero, on, zero, on, zero ]

    it "the outer tail lags it by one tick, not zero" do
      probe netlist outerTail 4 `shouldEqual` [ zero, zero, on, zero, on ]
