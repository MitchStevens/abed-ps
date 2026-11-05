-- | Circuits with memory, built as boards: a board's own wormhole is what gives
-- | them a one-tick delay. These drive a whole board from its declared sides,
-- | the way a level would.
module Test.Game.Board.Wormhole where

import Prelude

import Data.Array ((!!))
import Data.Array as A
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Data.Either (Either(..))
import Data.List as L
import Game.Board (Board, BoardF(BoardF), mkBoard, pureBoard)
import Game.Eval (Netlist, compile, initialSignals, portInfo, run, step)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Location (location)
import Game.Piece (andPiece, crossPiece, leftPiece, mkSuccPiece, mkWirePiece, notPiece, rightPiece)
import Game.Port (inputPort, noPort, outputPort)
import Game.Rotation (rotation)
import Game.Signal (Signal, mkSignal)
import Partial.Unsafe (unsafeCrashWith)
import Data.Tuple (snd)
import Test.QuickCheck ((===))
import Test.QuickCheck.Gen (arrayOf, chooseInt)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

-- | Every board built in this file is acyclic by construction -- crash
-- | loudly rather than thread `Either BoardError` through every test.
compileOrCrash :: Board -> Netlist
compileOrCrash board = case compile board of
  Right netlist -> netlist
  Left err -> unsafeCrashWith ("compileOrCrash: " <> show err)

{-
  Counts up by one every tick, wrapping at 8 bits: the count goes round through
  the board's own wormhole, adding one on the way.

    - Down (tail)   : the count buffered from the previous tick
    - Up   (mouth)  : that count + 1, pushed back into the wormhole
    - Left (output) : the current count, observable

            Up
            ^
           succ
            ^
    Left <- split
            ^
           Down
-}
counterBoard :: Board
counterBoard = mkBoard $ BoardF
  { size: 3
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Up (outputPort EightBit)
      , Tuple Direction.Down (inputPort EightBit)
      , Tuple Direction.Left (outputPort EightBit)
      ]
  , pieces: M.fromFoldable
      [ place 1 2 3 (wire [ Direction.Right ])
      , place 1 1 3 (wire [ Direction.Up, Direction.Right ])
      , place 0 1 2 (wire [ Direction.Right ])
      , place 1 0 3 (mkSuccPiece EightBit)
      ]
  , wormhole: Just { wormholeIn: Direction.Up, wormholeOut: Direction.Down }
  }
  where
  place x y r piece = Tuple (location x y) { piece: pureBoard piece, rotation: rotation r }
  wire outputs = mkWirePiece { capacity: EightBit, outputs: S.fromFoldable outputs }

{-
  Outputs one for a single tick when its `Left` input goes from zero to one, and
  zero otherwise: `curr && not prev`, where `prev` is `curr` kept for a tick by
  the wormhole.

    - Left  (input)  : the watched signal
    - Up    (output) : one on a rising edge, else zero
    - Right (mouth)  : this tick's watched signal, kept for next tick
    - Down  (tail)   : the previous tick's watched signal

  The watched signal goes over the top to reach the mouth, crossing the output:

              Up
              ^
      ┌───>──cross──>──┐
      │       ^        │
    Left ──> and       └──> Right
              ^
             not
              ^
             Down
-}
risingEdgeBoard :: Board
risingEdgeBoard = mkBoard $ BoardF
  { size: 3
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left (inputPort OneBit)
      , Tuple Direction.Up (outputPort OneBit)
      , Tuple Direction.Right (outputPort OneBit)
      , Tuple Direction.Down (inputPort OneBit)
      ]
  , pieces: M.fromFoldable
      [ place 0 1 0 (mkWirePiece { capacity: OneBit, outputs: S.fromFoldable [ Direction.Up, Direction.Right ] })
      , place 0 0 3 rightPiece
      , place 1 0 3 crossPiece
      , place 2 0 0 rightPiece
      , place 2 1 1 leftPiece
      , place 1 1 3 andPiece
      , place 1 2 3 notPiece
      ]
  , wormhole: Just { wormholeIn: Direction.Right, wormholeOut: Direction.Down }
  }
  where
  place x y r piece = Tuple (location x y) { piece: pureBoard piece, rotation: rotation r }

-- | The board's outputs on each tick, driving its input sides with one `Frame`
-- | per tick, from empty wormholes.
runBoard :: Netlist -> Array (Frame Signal) -> Array (Frame Signal)
runBoard = run

-- | `counterBoard`'s count on each of `n` ticks.
runCounter :: Int -> Array Signal
runCounter n =
  Frame.index Direction.Left <$> runBoard (compileOrCrash counterBoard) (A.replicate n (pure zero))

-- | Feed a sequence of `Left` inputs (0/1) through `risingEdgeBoard`, collecting
-- | the `Up` output on each tick.
runRisingEdge :: Array Int -> Array Signal
runRisingEdge bits =
  Frame.index Direction.Up <$> runBoard (compileOrCrash risingEdgeBoard) (Frame.singleton zero Direction.Left <<< mkSignal <$> bits)

spec :: Spec Unit
spec = describe "Boards with a wormhole" do

  describe "counterBoard" do
    it "counts up from zero, one per tick" do
      runCounter 6 `shouldEqual` map mkSignal [ 0, 1, 2, 3, 4, 5 ]

    it "reads n on the tick after n ticks" do
      quickCheck do
        n <- chooseInt 0 200
        pure $ A.last (runCounter (n + 1)) === Just (mkSignal n)

    it "wraps at its capacity" do
      A.last (runCounter 257) `shouldEqual` Just zero

  describe "counterBoard, nested inside another board" do
    -- the parent declares no ports, so the count can only be seen by probing
    -- the nested board's mouth: the count captured for next tick
    let
      parentAt = location 0 0
      parentBoard = mkBoard $ BoardF
        { size: 1
        , ports: pure noPort
        , pieces: M.singleton parentAt { piece: counterBoard, rotation: rotation 0 }
        , wormhole: Nothing
        }
      netlist = compileOrCrash parentBoard
      mouth = Tuple (L.singleton parentAt) Direction.Up
      mouthAfter n = (portInfo netlist (A.foldl (\signals _ -> snd (step netlist (pure zero) signals)) (initialSignals netlist) (A.replicate n unit)) mouth (outputPort EightBit)).signal

    it "still counts, addressed by the nested board's own path" do
      map mouthAfter [ 0, 1, 7, 20 ] `shouldEqual` map mkSignal [ 0, 1, 7, 20 ]

  describe "risingEdgeBoard" do
    it "pulses on a 0->1 transition and is zero otherwise" do
      runRisingEdge [ 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0 ]
        `shouldEqual` map mkSignal [ 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0 ]

    it "is zero when the input is held high (no repeated pulse)" do
      runRisingEdge [ 1, 1, 1, 1, 1 ] `shouldEqual` map mkSignal [ 1, 0, 0, 0, 0 ]

    it "is zero for an all-zero input" do
      runRisingEdge [ 0, 0, 0, 0 ] `shouldEqual` map mkSignal [ 0, 0, 0, 0 ]

    it "matches the reference rising-edge function for arbitrary bit streams" do
      quickCheck do
        bits <- arrayOf (chooseInt 0 1)
        let
          want = mapWithIndex
            (\i x -> if x == 1 && fromMaybe 0 (bits !! (i - 1)) == 0 then one else zero)
            bits
        pure $ runRisingEdge bits === want
