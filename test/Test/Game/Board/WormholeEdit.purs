-- | Making and closing a board's wormhole: which way round a drag between two
-- | sides joins them, and what happens to those sides' ports.
module Test.Game.Board.WormholeEdit where

import Prelude

import Data.Either (Either(..))
import Data.Lens (view)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..), snd)
import Effect.Aff (Aff)
import Game.Board (Board, BoardError(..), BoardF(..), Cell(..), _focus, _ports, _wormhole, addWormhole, execBoardM, mkBoard, removeWormhole, runAtFocus, setBoardSize, unzoomed, wormholeBetween)
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Location (location)
import Game.Piece (mkWirePiece)
import Game.Port (inputPort, noPort, outputPort)
import Game.Rotation (rotation)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)

expectRight :: forall a. Either BoardError a -> (a -> Aff Unit) -> Aff Unit
expectRight result k = case result of
  Right a -> k a
  Left err -> fail ("expected Right, got " <> show err)

-- | A level's board: the goal's ports on Left (in) and Right (out), and a wire
-- | at the top whose output faces the Up side, which the goal leaves empty.
rootBoard :: Board
rootBoard = mkBoard $ BoardF
  { size: 3
  , ports: Frame.fromFoldable noPort
      [ Tuple Direction.Left (inputPort OneBit)
      , Tuple Direction.Right (outputPort OneBit)
      ]
  , pieces: M.singleton (location 1 0)
      { piece: Leaf (mkWirePiece { capacity: OneBit, outputs: S.singleton Direction.Up }), rotation: rotation 0 }
  , wormhole: Nothing
  }

upToDown :: { wormholeIn :: Direction.CardinalDirection, wormholeOut :: Direction.CardinalDirection }
upToDown = { wormholeIn: Direction.Up, wormholeOut: Direction.Down }

spec :: Spec Unit
spec = describe "Making and closing a wormhole" do
  describe "wormholeBetween" do
    let
      edges = Frame.fromFoldable noPort
        [ Tuple Direction.Up (outputPort OneBit)
        , Tuple Direction.Left (inputPort OneBit)
        , Tuple Direction.Right (inputPort TwoBit)
        ]

    it "joins two empty sides the way the drag went" do
      wormholeBetween (pure noPort) Direction.Up Direction.Down `shouldEqual` Just upToDown
      wormholeBetween (pure noPort) Direction.Down Direction.Up
        `shouldEqual` Just { wormholeIn: Direction.Down, wormholeOut: Direction.Up }

    it "puts the mouth on an output, whichever end the drag started at" do
      wormholeBetween edges Direction.Up Direction.Down `shouldEqual` Just upToDown
      wormholeBetween edges Direction.Down Direction.Up `shouldEqual` Just upToDown

    it "puts the tail on an input" do
      wormholeBetween edges Direction.Left Direction.Down
        `shouldEqual` Just { wormholeIn: Direction.Down, wormholeOut: Direction.Left }

    it "joins an output to an input of the same capacity" do
      wormholeBetween edges Direction.Up Direction.Left
        `shouldEqual` Just { wormholeIn: Direction.Up, wormholeOut: Direction.Left }

    it "refuses ports of different capacities" do
      wormholeBetween edges Direction.Up Direction.Right `shouldEqual` Nothing

    it "refuses two inputs" do
      wormholeBetween edges Direction.Left Direction.Right `shouldEqual` Nothing

    it "refuses a side joined to itself" do
      wormholeBetween (pure noPort) Direction.Up Direction.Up `shouldEqual` Nothing

  describe "addWormhole" do
    it "refuses a wormhole with both ends on one side" do
      let same = { wormholeIn: Direction.Up, wormholeOut: Direction.Up }
      execBoardM (addWormhole same) rootBoard `shouldEqual` Left (WormholeInvalid same)

    it "replaces the board's wormhole" do
      let other = { wormholeIn: Direction.Down, wormholeOut: Direction.Up }
      expectRight (execBoardM (addWormhole upToDown *> addWormhole other) rootBoard) \board ->
        view _wormhole board `shouldEqual` Just other

  describe "at the root" do
    it "declares the wormhole's sides from their edges, and keeps the goal's" do
      expectRight (runAtFocus (addWormhole upToDown) (unzoomed rootBoard)) \(Tuple _ z) -> do
        let ports = view (_focus <<< _ports) z
        Frame.index Direction.Up ports `shouldEqual` outputPort OneBit
        Frame.index Direction.Down ports `shouldEqual` noPort
        Frame.index Direction.Left ports `shouldEqual` inputPort OneBit
        Frame.index Direction.Right ports `shouldEqual` outputPort OneBit

    it "gives the sides back to the goal when it's closed" do
      let made = runAtFocus (addWormhole upToDown) (unzoomed rootBoard)
      expectRight (made >>= snd >>> runAtFocus removeWormhole) \(Tuple _ z) -> do
        view (_focus <<< _wormhole) z `shouldEqual` Nothing
        view (_focus <<< _ports) z `shouldEqual` view _ports rootBoard

    it "closes the wormhole on a resize, sides and all" do
      let made = runAtFocus (addWormhole upToDown) (unzoomed rootBoard)
      expectRight (made >>= snd >>> runAtFocus (setBoardSize 5)) \(Tuple _ z) -> do
        view (_focus <<< _wormhole) z `shouldEqual` Nothing
        view (_focus <<< _ports) z `shouldEqual` view _ports rootBoard
