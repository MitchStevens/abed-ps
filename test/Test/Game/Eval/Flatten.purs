module Test.Game.Eval.Flatten where

import Prelude

import Data.Either (Either(..))
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Board.Types (Board, BoardError(..), BoardF(BoardF), mkBoard, pureBoard)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Eval.Flatten (Flat, Link, Register, flatten)
import Game.Frame (PieceIndex, PortIndex)
import Game.Frame as Frame
import Game.Location (Location, location)
import Game.Piece (getPorts, idPiece, notPiece)
import Game.Piece.Wormhole (counter)
import Game.Port (Port, inputPort, noPort, outputPort)
import Game.Rotation (Rotation, rotation)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)

cell :: Board -> Rotation -> { piece :: Board, rotation :: Rotation }
cell piece r = { piece, rotation: r }

leftInRightOut :: Capacity -> Capacity -> Frame.Frame Port
leftInRightOut inCap outCap = Frame.fromFoldable noPort
  [ Tuple Direction.Left (inputPort inCap)
  , Tuple Direction.Right (outputPort outCap)
  ]

-- | `size`x`size` board, Left in / Right out, holding `pieces`.
board :: Int -> Array (Tuple Location { piece :: Board, rotation :: Rotation }) -> Board
board size pieces = mkBoard $ BoardF
  { size
  , ports: leftInRightOut OneBit OneBit
  , pieces: M.fromFoldable pieces
  , wormhole: Nothing
  }

-- | `notPiece` alone, its Right output carried round to its Left input by a
-- | wormhole -- a 1-bit oscillator. `ports` lets a test spoil the match.
wormholeBoard :: Frame.Frame Port -> CardinalDirection -> CardinalDirection -> Board
wormholeBoard ports wormholeIn wormholeOut = mkBoard $ BoardF
  { size: 1
  , ports
  , pieces: M.singleton (location 0 0) (cell (pureBoard notPiece) (rotation 0))
  , wormhole: Just { wormholeIn, wormholeOut }
  }

oscillator :: Board
oscillator = wormholeBoard (leftInRightOut OneBit OneBit) Direction.Right Direction.Left

port :: PieceIndex -> CardinalDirection -> PortIndex
port = Tuple

withFlat :: Board -> (Flat -> Spec Unit) -> Spec Unit
withFlat b k = case flatten b of
  Right flat -> k flat
  Left err -> it "flattens" (fail (show err))

links :: Flat -> Set Link
links = S.fromFoldable <<< _.links

leafIndices :: Flat -> List PieceIndex
leafIndices = map _.index <<< _.leaves

registers :: Flat -> List Register
registers = _.registers

spec :: Spec Unit
spec = describe "Game.Eval.Flatten" do
  let
    o = location 0 0
    l = location 0 1
    m = location 1 1
    r = location 2 1
    piece p = cell (pureBoard p) (rotation 0)

  describe "a bare piece" do
    withFlat (pureBoard idPiece) \flat -> do
      it "is the only leaf, at the empty path" do
        leafIndices flat `shouldEqual` L.singleton Nil
      it "has its own ports as the boundary" do
        flat.boundary `shouldEqual` getPorts idPiece
      it "has no links" do
        links flat `shouldEqual` S.empty

  describe "a row of pieces" do
    withFlat (board 3 [ Tuple l (piece idPiece), Tuple m (piece idPiece), Tuple r (piece notPiece) ]) \flat -> do
      it "links each output to the input it faces, and each side to the piece inside it" do
        links flat `shouldEqual` S.fromFoldable
          [ Tuple (port (L.singleton l) Direction.Right) (port (L.singleton m) Direction.Left)
          , Tuple (port (L.singleton m) Direction.Right) (port (L.singleton r) Direction.Left)
          , Tuple (port Nil Direction.Left) (port (L.singleton l) Direction.Left)
          , Tuple (port Nil Direction.Right) (port (L.singleton r) Direction.Right)
          ]
      it "exposes the declared ports as the boundary" do
        flat.boundary `shouldEqual` leftInRightOut OneBit OneBit

  describe "a piece rotated to face away" do
    -- turned half way, `notPiece`'s input faces Right and its output Left:
    -- output meets output, so no link, and it no longer matches the Right side
    withFlat (board 3 [ Tuple l (piece idPiece), Tuple m (piece idPiece), Tuple r (cell (pureBoard notPiece) (rotation 2)) ]) \flat -> do
      it "isn't linked to its neighbour or its side" do
        links flat `shouldEqual` S.fromFoldable
          [ Tuple (port Nil Direction.Left) (port (L.singleton l) Direction.Left)
          , Tuple (port (L.singleton l) Direction.Right) (port (L.singleton m) Direction.Left)
          ]

  describe "a piece off the middle of an edge" do
    withFlat (board 3 [ Tuple o (piece idPiece) ]) \flat -> do
      it "doesn't back any side" do
        links flat `shouldEqual` S.empty

  describe "an even-sized board" do
    it "is rejected, since its sides have no middle cell" do
      (links <$> flatten (board 2 [ Tuple o (piece idPiece) ])) `shouldEqual` Left (BadBoardSize 2)

  describe "a nested board" do
    let inner = board 1 [ Tuple o (cell (pureBoard idPiece) (rotation 0)) ]
    withFlat (board 1 [ Tuple o (cell inner (rotation 0)) ]) \flat -> do
      it "contributes its leaves under its own path" do
        leafIndices flat `shouldEqual` L.singleton (o : o : Nil)
      it "aliases each of its sides both outwards and inwards" do
        links flat `shouldEqual` S.fromFoldable
          [ Tuple (port Nil Direction.Left) (port (L.singleton o) Direction.Left)
          , Tuple (port Nil Direction.Right) (port (L.singleton o) Direction.Right)
          , Tuple (port (L.singleton o) Direction.Left) (port (o : o : Nil) Direction.Left)
          , Tuple (port (L.singleton o) Direction.Right) (port (o : o : Nil) Direction.Right)
          ]

  describe "a board wormhole" do
    withFlat oscillator \flat -> do
      it "is a register from the mouth side to the tail side" do
        registers flat `shouldEqual` L.singleton { mouth: port Nil Direction.Right, tail: port Nil Direction.Left }
      it "still aliases both sides to the piece inside" do
        links flat `shouldEqual` S.fromFoldable
          [ Tuple (port Nil Direction.Left) (port (L.singleton o) Direction.Left)
          , Tuple (port Nil Direction.Right) (port (L.singleton o) Direction.Right)
          ]
      it "hides both sides from the harness" do
        flat.boundary `shouldEqual` pure noPort

    it "is invalid with the mouth and tail on one side" do
      (registers <$> flatten (wormholeBoard (leftInRightOut OneBit OneBit) Direction.Left Direction.Left))
        `shouldEqual` Left (WormholeInvalid { wormholeIn: Direction.Left, wormholeOut: Direction.Left })

    it "doesn't propagate when the two sides' capacities differ" do
      (registers <$> flatten (wormholeBoard (leftInRightOut OneBit TwoBit) Direction.Right Direction.Left))
        `shouldEqual` Right Nil

    -- `idPiece`'s output faces the nested oscillator's tail side, which is
    -- `noPort` from outside
    withFlat (board 3 [ Tuple l (piece idPiece), Tuple m (cell oscillator (rotation 0)) ]) \flat -> do
      it "can't be reached from outside a nested board" do
        links flat `shouldEqual` S.fromFoldable
          [ Tuple (port Nil Direction.Left) (port (L.singleton l) Direction.Left)
          , Tuple (port (L.singleton m) Direction.Left) (port (m : o : Nil) Direction.Left)
          , Tuple (port (L.singleton m) Direction.Right) (port (m : o : Nil) Direction.Right)
          ]
      it "keeps its register, under the nested board's path" do
        registers flat `shouldEqual` L.singleton { mouth: port (L.singleton m) Direction.Right, tail: port (L.singleton m) Direction.Left }

  describe "a piece wormhole" do
    withFlat (board 1 [ Tuple o (cell (pureBoard counter) (rotation 0)) ]) \flat -> do
      it "is a register on the piece itself" do
        registers flat `shouldEqual` L.singleton { mouth: port (L.singleton o) Direction.Up, tail: port (L.singleton o) Direction.Down }
