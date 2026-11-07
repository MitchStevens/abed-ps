module Test.Game.Board.Zoom where

import Prelude

import Data.Either (Either(..))
import Data.Foldable (for_)
import Data.Lens (set, view)
import Data.List (List(..), (:))
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Game.Board (Board, Cell(..), BoardError(..), BoardF(..), ZoomedBoard, _focus, _pieces, _ports, _rootPorts, addPiece, focusIndex, isEmptyBoard, isZoomed, mkBoard, rebuild, runAtFocus, standardBoard, unzoomed, zoomIn, zoomOut)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Location (Location, location)
import Game.Piece (andPiece, notPiece)
import Game.Port (inputPort, noPort)
import Game.Rotation (Rotation, rotation)
import Effect.Aff (Aff)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)

boardOf :: Int -> Array (Tuple Location { rotation :: Rotation, piece :: Cell }) -> Board
boardOf size pieces = mkBoard $ BoardF { size, ports: pure noPort, pieces: M.fromFoldable pieces, wormhole: Nothing }

-- a 3x3 board holding a leaf at (0,0) and, at (1,1), a rotated 3x3 board
-- holding a leaf of its own
inner :: Board
inner = boardOf 3 [ Tuple (location 2 2) { rotation: mempty, piece: Leaf andPiece } ]

root :: Board
root = boardOf 3
  [ Tuple (location 0 0) { rotation: mempty, piece: Leaf notPiece }
  , Tuple (location 1 1) { rotation: rotation 1, piece: Nested inner }
  ]

-- run an `Either` step, failing the test on `Left`
expectRight :: forall a. Either BoardError a -> (a -> Aff Unit) -> Aff Unit
expectRight result k = case result of
  Right a -> k a
  Left err -> fail ("expected Right, got " <> show err)

spec :: Spec Unit
spec = describe "Game.Board.Zoom" do
  describe "zoomIn" do
    it "focuses the nested board in an occupied slot" do
      expectRight (zoomIn (location 1 1) (unzoomed root)) \z -> do
        view _focus z `shouldEqual` inner
        focusIndex z `shouldEqual` (location 1 1 : Nil)
        isZoomed z `shouldEqual` true

    it "focuses a fresh empty board in an empty slot" do
      expectRight (zoomIn (location 2 0) (unzoomed root)) \z ->
        view _focus z `shouldEqual` standardBoard

    it "refuses a leaf piece" do
      zoomIn (location 0 0) (unzoomed root) `shouldEqual` Left (LocationOccupied (location 0 0))

    it "refuses a location outside the board" do
      zoomIn (location 3 0) (unzoomed root) `shouldEqual` Left (InvalidLocation (location 3 0))
      zoomIn (location 0 (-1)) (unzoomed root) `shouldEqual` Left (InvalidLocation (location 0 (-1)))

    it "nests, recording the path root first" do
      expectRight (zoomIn (location 1 1) (unzoomed root) >>= zoomIn (location 0 2)) \z ->
        focusIndex z `shouldEqual` (location 1 1 : location 0 2 : Nil)

  describe "rebuild" do
    it "is unchanged by zooming in, at every slot that allows it" do
      for_ [ location 1 1, location 2 0, location 0 1, location 2 2 ] \loc ->
        expectRight (zoomIn loc (unzoomed root)) \z ->
          rebuild z `shouldEqual` root

    it "is unchanged by zooming in twice" do
      expectRight (zoomIn (location 1 1) (unzoomed root) >>= zoomIn (location 0 0)) \z ->
        rebuild z `shouldEqual` root

  describe "zoomOut" do
    it "undoes zoomIn" do
      for_ [ location 1 1, location 2 0 ] \loc ->
        expectRight (zoomIn loc (unzoomed root)) \z ->
          zoomOut z `shouldEqual` Just (unzoomed root)

    it "is Nothing when not zoomed" do
      zoomOut (unzoomed root) `shouldEqual` (Nothing :: Maybe ZoomedBoard)

    it "keeps an edit made at the focus, in the slot it was made in" do
      let
        edited = zoomIn (location 2 0) (unzoomed root)
          >>= runAtFocus (addPiece (location 1 1) notPiece)
      expectRight edited \(Tuple _ z) -> case zoomOut z of
        Nothing -> fail "expected to zoom out"
        Just out -> do
          out `shouldEqual` unzoomed (rebuild z)
          map _.piece (M.lookup (location 2 0) (view (_focus <<< _pieces) out))
            `shouldEqual` Just (Nested (view _focus z))
          map _.piece (M.lookup (location 1 1) (view (_pieces) (view _focus z)))
            `shouldEqual` Just (Leaf notPiece)

    it "leaves an empty slot empty when the nested board is still empty" do
      expectRight (zoomIn (location 2 0) (unzoomed root)) \z -> do
        isEmptyBoard (view _focus z) `shouldEqual` true
        M.member (location 2 0) (view (_focus <<< _pieces) (rebuild z # unzoomed)) `shouldEqual` false

  describe "_rootPorts" do
    let ports = Frame.fromFoldable noPort [ Tuple Direction.Left (inputPort OneBit) ]
    it "sets the root's ports when not zoomed" do
      view _ports (rebuild (set _rootPorts ports (unzoomed root))) `shouldEqual` ports

    it "sets the root's ports from two levels down, leaving the focus alone" do
      expectRight (zoomIn (location 1 1) (unzoomed root) >>= zoomIn (location 0 0)) \z -> do
        let z' = set _rootPorts ports z
        view _rootPorts z' `shouldEqual` ports
        view _ports (rebuild z') `shouldEqual` ports
        view _focus z' `shouldEqual` view _focus z
