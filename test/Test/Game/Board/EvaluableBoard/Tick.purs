module Test.Game.Board.EvaluableBoard.Tick where

import Prelude

import Data.Array as A
import Data.Either (either)
import Data.Foldable (foldl)
import Data.List ((:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set.NonEmpty as NES
import Data.Tuple (Tuple(..), snd)
import Game.Board (Board(..), EvaluableBoard(..), WormholeBuffer, evaluableBoardPiece, runEvaluableBoardTicks, stepEvaluableBoard, toEvaluableBoard)
import Game.Direction as Direction
import Game.Location (location)
import Game.Piece.Wormhole (counter)
import Game.Rotation (rotation)
import Game.Signal (Signal, mkSignal)
import Partial.Unsafe (unsafeCrashWith)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)

-- | `counter` alone on a board, its wormhole ports facing the interior so the
-- | evaluator (not a board terminal) drives them.
counterBoard :: Board
counterBoard = Board
  { size: 3
  , pieces: M.singleton (location 1 1) { piece: counter, rotation: rotation 0 }
  , wormhole: Nothing
  }

-- | `counter` at the left edge, so its `Left` count is a board output terminal
-- | and can be observed frame by frame.
observableCounterBoard :: Board
observableCounterBoard = Board
  { size: 3
  , pieces: M.singleton (location 0 1) { piece: counter, rotation: rotation 0 }
  , wormhole: Nothing
  }

build :: Board -> EvaluableBoard
build = toEvaluableBoard >>> either (show >>> unsafeCrashWith) identity

-- | Thread `n` empty input frames through `ev`, returning the final buffer.
runBuffer :: EvaluableBoard -> Int -> WormholeBuffer
runBuffer ev n = foldl (\buf _ -> snd (stepEvaluableBoard ev buf M.empty)) M.empty (A.replicate n unit)

spec :: Spec Unit
spec = describe "Game.Board.EvaluableBoard.Tick" do

  describe "a wormhole piece in the board" do
    it "buffers the tick count, owned by the board evaluator" do
      let buf n = M.lookup (L.singleton (location 1 1)) (runBuffer (build counterBoard) n) >>= M.lookup Direction.Down
      -- nothing captured before the first tick: an absent entry emits `zero`
      runBuffer (build counterBoard) 0 `shouldEqual` M.empty
      buf 1 `shouldEqual` Just (mkSignal 1)
      buf 10 `shouldEqual` Just (mkSignal 10)
      buf 42 `shouldEqual` Just (mkSignal 42)

    it "emits the running count on the board output each frame" do
      runEvaluableBoardTicks (build observableCounterBoard) (A.replicate 6 M.empty)
        `shouldEqual` map (M.singleton Direction.Left <<< mkSignal) [ 0, 1, 2, 3, 4, 5 ]

  describe "a wormhole piece inside a nested sub-board" do
    -- parent board holds one piece: the counter board, wrapped as a piece and
    -- registered in `subBoards` so the evaluator descends into it. The counter's
    -- buffer is then keyed by the two-step instance path.
    let
      child = build counterBoard
      parentAt = location 0 0
      parent = EvaluableBoard
        { pieces: M.singleton parentAt (evaluableBoardPiece child)
        , connections: M.empty
        , evalOrder: L.singleton (NES.singleton parentAt)
        , terminals: M.empty
        , subBoards: M.singleton parentAt child
        }
      nestedKey = parentAt : L.singleton (location 1 1)
      runParentBuffer n =
        foldl (\buf _ -> snd (stepEvaluableBoard parent buf M.empty)) (M.empty :: WormholeBuffer) (A.replicate n unit)

    it "stores the nested buffer under the full instance path" do
      let buf n = M.lookup nestedKey (runParentBuffer n) >>= M.lookup Direction.Down
      buf 1 `shouldEqual` Just (mkSignal 1)
      buf 7 `shouldEqual` Just (mkSignal 7)
      buf 20 `shouldEqual` Just (mkSignal 20)

    it "keeps no buffer at the parent's own (shallow) path" do
      M.lookup (L.singleton parentAt) (runParentBuffer 5) `shouldEqual` (Nothing :: Maybe (M.Map Direction.CardinalDirection Signal))
