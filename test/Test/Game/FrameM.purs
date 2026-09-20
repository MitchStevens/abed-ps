module Test.Game.FrameM where

import Prelude

import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Frame (Frame, PieceIndex, PortIndex, evaluate, fromMap, readFrame, tabulate, withLocation, writeFrame)
import Game.Frame (index, singleton) as Frame
import Game.FrameM (FrameM, FrameShape, evalFrameM, evalFrameMFrom, execFrameM, execFrameMFrom, runFrameM, runFrameMFrom)
import Game.Location (Location, location)
import Game.Piece (getPorts, idPiece)
import Game.Port (Port, noPort, outputPort)
import Game.Signal (Signal, mkSignal)
import Test.QuickCheck (Result, arbitrary, (===))
import Test.QuickCheck.Gen (Gen, chooseInt)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.QuickCheck (quickCheck)

-- Three pieces, `a` and `b` side by side under the root, `c` nested one level
-- down inside `a` (so it's addressed `[a, b]`):
--
--   a: an output on Right
--   b: an idPiece (input on Left, output on Right), its Left fed by a's Right
--   c: an output on Right
--
-- b's routing also points its Up (no port there) and Right (an output, not
-- readable) at a's Right -- bait, to check reads truncate. No piece routes a
-- readable side to its own writable one, which the read/write law needs.
locA :: Location
locA = location 0 0

locB :: Location
locB = location 1 0

idxA :: PieceIndex
idxA = L.singleton locA

idxB :: PieceIndex
idxB = L.singleton locB

idxC :: PieceIndex
idxC = L.fromFoldable [ locA, locB ]

outputRight :: Frame Port
outputRight = Frame.singleton noPort Direction.Right (outputPort OneBit)

routes :: Array (Tuple CardinalDirection PortIndex) -> Frame (Maybe PortIndex)
routes entries = fromMap Nothing (Just <$> M.fromFoldable entries)

aRight :: PortIndex
aRight = Tuple idxA Direction.Right

shape :: FrameShape
shape =
  { ports: M.fromFoldable
      [ Tuple idxA outputRight
      , Tuple idxB (getPorts idPiece)
      , Tuple idxC outputRight
      ]
  , routing: M.fromFoldable
      [ Tuple idxA (routes [ Tuple Direction.Right aRight ])
      , Tuple idxB (routes [ Tuple Direction.Left aRight, Tuple Direction.Up aRight, Tuple Direction.Right aRight ])
      , Tuple idxC (routes [ Tuple Direction.Right (Tuple idxC Direction.Right) ])
      ]
  }

run :: forall a. FrameM a -> Tuple a (Map PieceIndex (Frame Signal))
run = runFrameM shape

-- | `value` on one side, `zero` everywhere else.
sideFrame :: CardinalDirection -> Signal -> Frame Signal
sideFrame = Frame.singleton zero

-- | Run a program at one of the three pieces (0 = a, 1 = b, 2 = c).
atPiece :: forall a. Int -> FrameM a -> FrameM a
atPiece n = case n of
  0 -> withLocation locA
  1 -> withLocation locB
  _ -> withLocation locA <<< withLocation locB

-- | Put every piece in a random, non-trivial state to run a law from.
seed :: Frame Signal -> Frame Signal -> Frame Signal -> FrameM Unit
seed fa fb fc = do
  withLocation locA (writeFrame fa)
  withLocation locB (writeFrame fb)
  withLocation locA (withLocation locB (writeFrame fc))

-- | The two programs agree, on both result and final state, from the same
-- | random starting state.
sameRun :: forall a. Eq a => Show a => (Int -> FrameM a) -> (Int -> FrameM a) -> Gen Result
sameRun lhs rhs = do
  fa <- arbitrary
  fb <- arbitrary
  fc <- arbitrary
  n <- chooseInt 0 2
  pure (run (seed fa fb fc *> lhs n) === run (seed fa fb fc *> rhs n))

spec :: Spec Unit
spec = describe "Game.FrameM" do
  describe "read ∘ read" do
    it "reading twice gives the same frame twice, and changes nothing" do
      quickCheck $ sameRun
        (\n -> atPiece n (readFrame >>= \x -> readFrame >>= \y -> pure (Tuple x y)))
        (\n -> atPiece n (readFrame >>= \x -> pure (Tuple x x)))

  describe "write ∘ write" do
    it "the last write wins" do
      quickCheck do
        f <- arbitrary
        g <- arbitrary
        sameRun
          (\n -> atPiece n (writeFrame f *> writeFrame g))
          (\n -> atPiece n (writeFrame g))

  describe "write ∘ read" do
    it "is not the identity: it clears the piece's outputs" do
      quickCheck $ sameRun
        (\n -> atPiece n (readFrame >>= writeFrame))
        (\n -> atPiece n (writeFrame (pure zero)))

  describe "read ∘ write" do
    it "a piece's own writes are invisible to its own reads" do
      quickCheck do
        f <- arbitrary
        sameRun
          (\n -> atPiece n (writeFrame f *> readFrame))
          (\n -> atPiece n (readFrame >>= \r -> writeFrame f *> pure r))

  describe "truncation" do
    it "readFrame is zero on every side but the readable one (b's Left, from a's Right)" do
      quickCheck do
        fa <- arbitrary
        fb <- arbitrary
        fc <- arbitrary
        pure $
          evalFrameM shape (seed fa fb fc *> withLocation locB readFrame)
            === sideFrame Direction.Left (Frame.index Direction.Right fa)
    it "writeFrame keeps only the writable side (b's Right)" do
      quickCheck \(f :: Frame Signal) ->
        execFrameM shape (withLocation locB (writeFrame f))
          === M.singleton idxB (sideFrame Direction.Right (Frame.index Direction.Right f))
    it "a neighbour's output reaches an input, but not a side with no port or an output" do
      evalFrameM shape
        ( do
            withLocation locA (writeFrame (pure (mkSignal 5)))
            withLocation locB readFrame
        ) `shouldEqual` sideFrame Direction.Left (mkSignal 5)

  describe "initial state" do
    it "an empty initial state is the plain runner" do
      quickCheck \(f :: Frame Signal) ->
        runFrameMFrom shape M.empty (withLocation locB (writeFrame f *> readFrame))
          === run (withLocation locB (writeFrame f *> readFrame))
    it "reads see the initial state (b's Left, from a's Right)" do
      quickCheck \(fa :: Frame Signal) ->
        evalFrameMFrom shape (M.singleton idxA fa) (withLocation locB readFrame)
          === sideFrame Direction.Left (Frame.index Direction.Right fa)
    it "a write replaces only the writable sides: every other side keeps its seeded value" do
      quickCheck \(initial :: Frame Signal) (f :: Frame Signal) ->
        let
          pick d = Frame.index d (if d == Direction.Right then f else initial)
        in
          execFrameMFrom shape (M.singleton idxB initial) (withLocation locB (writeFrame f))
            === M.singleton idxB (tabulate pick)
    it "b's seeded input survives b writing its output" do
      -- b's Left is an input, its Right an output: write 9 everywhere, and only Right moves
      let
        seeded = M.singleton idxB (sideFrame Direction.Left (mkSignal 7))
        after = execFrameMFrom shape seeded (withLocation locB (writeFrame (pure (mkSignal 9))))
        expected = tabulate case _ of
          Direction.Left -> mkSignal 7
          Direction.Right -> mkSignal 9
          _ -> zero
      M.lookup idxB after `shouldEqual` Just expected

  describe "locality" do
    it "writes at different locations commute" do
      quickCheck \(f :: Frame Signal) (g :: Frame Signal) ->
        run (withLocation locA (writeFrame f) *> withLocation locB (writeFrame g))
          === run (withLocation locB (writeFrame g) *> withLocation locA (writeFrame f))

  describe "scoping" do
    it "withLocation of a pure value is that pure value" do
      run (withLocation locA (pure 1)) `shouldEqual` run (pure 1)
    it "withLocation distributes over bind" do
      quickCheck $ sameRun
        (\_ -> withLocation locB (readFrame >>= \r -> writeFrame r *> readFrame))
        (\_ -> withLocation locB readFrame >>= \r -> withLocation locB (writeFrame r *> readFrame))
    it "nested locations address the whole path, root first, and each scope ends where it began" do
      execFrameM shape
        ( do
            withLocation locA (withLocation locB (writeFrame (pure (mkSignal 1))))
            withLocation locA (writeFrame (pure (mkSignal 2)))
        ) `shouldEqual`
        M.fromFoldable
          [ Tuple idxC (sideFrame Direction.Right (mkSignal 1))
          , Tuple idxA (sideFrame Direction.Right (mkSignal 2))
          ]
    it "a location missing from the shape reads zero, rather than crashing" do
      evalFrameM shape (withLocation (location 9 9) readFrame) `shouldEqual` pure zero
      evalFrameM shape readFrame `shouldEqual` pure zero

  describe "evaluate" do
    it "runs a real piece: idPiece passes what its neighbour wrote from Left to Right" do
      let
        state = execFrameM shape do
          withLocation locA (writeFrame (pure (mkSignal 1)))
          withLocation locB (evaluate idPiece)
      M.lookup idxB state `shouldEqual` Just (sideFrame Direction.Right (mkSignal 1))
