{-
  Ports (heh) the wormhole-ticking behaviour from
  `Test.Game.Board.EvaluableBoard.Tick` onto the `Compiled` pipeline: the same
  `Board`s, but driven by `compile`/`evaluate` instead of
  `toEvaluableBoard`/`stepEvaluableBoard`.

  The two evaluators expose a wormhole's state differently, so the exact
  `PortIndex`/direction each assertion reads differs from the original -- see
  the comments below -- but the underlying counts they check are the same.
-}
module Test.Game.Board.Compiled.Evaluate where

import Prelude

import Data.Array as A
import Data.Either (Either(..))
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Board (Board, BoardF(BoardF), mkBoard, pureBoard)
import Game.Board.Compiled (CompiledBoard, PortIndex, boundaryPortInfo, compile, evaluate)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Location (location)
import Game.Piece (Piece, PieceId(..), idPiece, mkPieceNoAdapt)
import Game.Piece.Wormhole (counter)
import Game.Port (inputPort, noPort, outputPort)
import Game.PortInfo (noPortInfo)
import Game.Rotation (rotation)
import Game.Signal (Signal, mkSignal)
import Partial.Unsafe (unsafeCrashWith)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

-- | Every board built in this file is acyclic by construction -- crash
-- | loudly rather than thread `Either BoardError` through every test.
compileOrCrash :: Board -> CompiledBoard
compileOrCrash board = case compile board of
  Right compiled -> compiled
  Left err -> unsafeCrashWith ("compileOrCrash: " <> show err)

-- | `counter` alone on a board, its wormhole ports facing the interior (no
-- | neighbor on either side), so nothing but the evaluator's own wormhole
-- | bookkeeping ever drives them.
counterBoard :: Board
counterBoard = mkBoard $ BoardF
  { size: 3
  , ports: pure noPort
  , pieces: M.singleton (location 1 1) { piece: pureBoard counter, rotation: rotation 0 }
  , wormhole: Nothing
  }

-- | `counter` at the left edge, so its `Left` count is a true board-boundary
-- | output and can be observed frame by frame.
observableCounterBoard :: Board
observableCounterBoard = mkBoard $ BoardF
  { size: 3
  , ports: pure noPort
  , pieces: M.singleton (location 0 1) { piece: pureBoard counter, rotation: rotation 0 }
  , wormhole: Nothing
  }

-- | Successive states after each of `n` ticks, oldest first -- state 0 is
-- | never included, state 1 is after the first tick, and so on.
runTicks :: CompiledBoard -> Int -> Array (Map PortIndex Signal)
runTicks compiled n = A.scanl (\state _ -> evaluate compiled state) M.empty (A.replicate n unit)

-- | A single-output piece with no legitimate way to see its own past output
-- | (it has no wormhole, and nothing feeds `Right` back to it) -- so if
-- | `evaluateAt` ever fed a piece's own output `PortIndex` back to it as an
-- | "input" (skipping `truncateInputs`), this piece would notice: it reads
-- | its own last `Right` and increments it, so it would climb 1, 2, 3, ...
-- | forever instead of resetting to 1 every tick.
selfPeekingPiece :: Piece
selfPeekingPiece = mkPieceNoAdapt
  { name: PieceId "self-peeking-piece"
  , eval: \inputs -> Frame.singleton zero Direction.Right (Frame.index Direction.Right inputs + one)
  , ports: Frame.singleton noPort Direction.Right (outputPort OneBit)
  , complexity: mempty
  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

-- | A single-input, single-output piece with a deliberately malformed
-- | `eval`: alongside its real `Right` output, it also (wrongly) reports a
-- | signal on `Left` -- its own *input* direction. If `evaluateAt` ever
-- | wrote back every direction `eval` returns (rather than only the piece's
-- | writable ones),
-- | that stray `Left` entry would resolve, via this piece's own frame, to
-- | whatever `PortIndex` actually feeds its `Left` -- a neighbor's output --
-- | clobbering it.
leakyPiece :: Piece
leakyPiece = mkPieceNoAdapt
  { name: PieceId "leaky-piece"
  , eval: \inputs -> Frame.fromFoldable zero
      [ Tuple Direction.Right (Frame.index Direction.Left inputs)
      , Tuple Direction.Left (mkSignal 99)
      ]
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left (inputPort OneBit)
      , Tuple Direction.Right (outputPort OneBit)
      ]
  , complexity: mempty
  , shouldRipple: false
  , updateCapacity: \_ _ -> Nothing
  , isSimplifiable: Nothing
  }

spec :: Spec Unit
spec = describe "Game.Board.Compiled.evaluate" do

  describe "boundaryPortInfo" do
    let
      loc = location 0 0
      board = mkBoard $ BoardF
        { size: 1
        , ports: Frame.fromFoldable noPort
            [ Tuple Direction.Left (inputPort OneBit)
            , Tuple Direction.Right (outputPort OneBit)
            ]
        , pieces: M.singleton loc { piece: pureBoard idPiece, rotation: rotation 0 }
        , wormhole: Nothing
        }
      info = boundaryPortInfo (compileOrCrash board) M.empty

    it "describes the sides the board declares a port on" do
      (Frame.index Direction.Left info).port `shouldEqual` inputPort OneBit
      (Frame.index Direction.Right info).port `shouldEqual` outputPort OneBit

    it "is noPortInfo on every side it declares no port on" do
      Frame.index Direction.Up info `shouldEqual` noPortInfo
      Frame.index Direction.Down info `shouldEqual` noPortInfo

  describe "a wormhole piece in the board" do
    let
      idx = L.singleton (location 1 1)
      compiled = compileOrCrash counterBoard
      -- `Direction.Up` is the wormhole's mouth (`WormholeIn`): the value
      -- `counter` itself just captured for next tick, growing by one every
      -- tick. Unlike the old `WormholeBuffer` (keyed by the tail, and
      -- pre-updated a tick early), `evaluate`'s state only ever writes a
      -- piece's own output ports -- so the mouth, not the tail
      -- (`Direction.Down`), is where "the count after n ticks" lives.
      mouthAfter n = A.last (runTicks compiled n) >>= M.lookup (Tuple idx Direction.Up)

    it "buffers the tick count, owned by the compiled evaluator" do
      -- nothing captured before the first tick: an absent entry emits `zero`
      runTicks compiled 0 `shouldEqual` []
      mouthAfter 1 `shouldEqual` Just (mkSignal 1)
      mouthAfter 10 `shouldEqual` Just (mkSignal 10)
      mouthAfter 42 `shouldEqual` Just (mkSignal 42)

  describe "an observable wormhole piece" do
    let
      idx = L.singleton (location 0 1)
      compiled = compileOrCrash observableCounterBoard
      leftValues = map (M.lookup (Tuple idx Direction.Left)) (runTicks compiled 6)

    it "emits the running count on the board output each frame" do
      leftValues `shouldEqual` map (Just <<< mkSignal) [ 0, 1, 2, 3, 4, 5 ]

  describe "a wormhole piece inside a nested sub-board" do
    -- the parent board holds one piece: `counterBoard` itself, nested
    -- directly as a `Board` (unlike `EvaluableBoard`, which needed a
    -- `subBoards` side-channel and an `evaluableBoardPiece` wrapper, nesting
    -- here is just another piece slot -- see `compile`/`appendLocation`).
    -- The counter's wormhole is then addressed by the full instance path.
    let
      parentAt = location 0 0
      innerAt = location 1 1
      parentBoard = mkBoard $ BoardF
        { size: 1
        , ports: pure noPort
        , pieces: M.singleton parentAt { piece: counterBoard, rotation: rotation 0 }
        , wormhole: Nothing
        }
      nestedIdx = Cons parentAt (L.singleton innerAt)
      compiled = compileOrCrash parentBoard
      mouthAfter n = A.last (runTicks compiled n) >>= M.lookup (Tuple nestedIdx Direction.Up)

    it "stores the nested wormhole's mouth under the full instance path" do
      mouthAfter 1 `shouldEqual` Just (mkSignal 1)
      mouthAfter 7 `shouldEqual` Just (mkSignal 7)
      mouthAfter 20 `shouldEqual` Just (mkSignal 20)

    it "keeps no signal at the parent's own (shallow) path" do
      (A.last (runTicks compiled 5) >>= M.lookup (Tuple (L.singleton parentAt) Direction.Down))
        `shouldEqual` Nothing

  describe "evaluateAt truncates inputs and outputs to the piece's own ports" do
    it "never feeds a piece its own previous output as an input" do
      let
        loc = location 0 0
        idx = L.singleton loc
        board = mkBoard $ BoardF
          { size: 1
          , ports: pure noPort
          , pieces: M.singleton loc { piece: pureBoard selfPeekingPiece, rotation: rotation 0 }
          , wormhole: Nothing
          }
        rightValues = map (M.lookup (Tuple idx Direction.Right)) (runTicks (compileOrCrash board) 3)

      -- without truncation this would read back its own last output and
      -- climb: [Just 1, Just 2, Just 3]
      rightValues `shouldEqual` [ Just (mkSignal 1), Just (mkSignal 1), Just (mkSignal 1) ]

    it "never lets a piece's malformed output clobber a neighbor's own output through its input direction" do
      let
        loc0 = location 0 0
        loc1 = location 1 0
        idx0 = L.singleton loc0
        board = mkBoard $ BoardF
          { size: 2
          , ports: pure noPort
          , pieces: M.fromFoldable
              [ Tuple loc0 { piece: pureBoard idPiece, rotation: rotation 0 }
              , Tuple loc1 { piece: pureBoard leakyPiece, rotation: rotation 0 }
              ]
          , wormhole: Nothing
          }

      -- `leakyPiece`'s bogus `Left` entry resolves to `idPiece`'s own `Right`
      -- `PortIndex` (that's what feeds `leakyPiece`'s `Left`) -- if every
      -- side were written back, not just the writable ones, this would
      -- read `Just (mkSignal 99)` instead.
      (A.last (runTicks (compileOrCrash board) 1) >>= M.lookup (Tuple idx0 Direction.Right))
        `shouldEqual` Just (mkSignal 0)
