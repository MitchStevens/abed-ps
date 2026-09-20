module Test.Game.Piece.WirePiece where

import Prelude

import Data.Foldable (for_)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Frame as Frame
import Game.Piece (Simplification(..), adapt, getInputDirs, getOutputDirs, getPorts, idPiece, isSimplifiable, leftPiece, superPiece)
import Game.Port (inputPort, noPort, outputPort)
import Game.Port as PortType
import Game.Signal (Signal(..))
import Test.Game.Piece (testEval)
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (fail, shouldEqual)

spec :: Spec Unit
spec =
  describe "Game.Piece.WirePiece" do
    describe "WirePiece" do
      it "leftPiece" do
        getInputDirs  leftPiece `shouldEqual` S.fromFoldable [ Direction.Left ]
        getOutputDirs leftPiece `shouldEqual` S.fromFoldable [ Direction.Up ]

    describe "isSimplifiable" do
      it "should simplify wire pieces" do
        isSimplifiable idPiece
          `shouldEqual` Just (Connection $ M.singleton Direction.Right Direction.Left)
        isSimplifiable leftPiece
          `shouldEqual` Just (Connection $ M.singleton Direction.Up Direction.Left)

    describe "adapt" do
      it "should add an output when a port is found" do
        getPorts idPiece `shouldEqual`
          Frame.fromFoldable noPort
            [ Tuple Direction.Left (inputPort OneBit)
            , Tuple Direction.Right (outputPort OneBit)
            ]

        getPorts (adapt Direction.Down (inputPort OneBit) idPiece)
          `shouldEqual`
            Frame.fromFoldable noPort
              [ Tuple Direction.Left (inputPort OneBit)
              , Tuple Direction.Down (outputPort OneBit)
              , Tuple Direction.Right (outputPort OneBit)
              ]
      
      

        --isSimplifiable crossPiece
        --  `shouldEqual` Just (Connection $ M.fromFoldable
        --    [ Tuple Direction.Down Direction.Up
        --    , Tuple Direction.Right Direction.Left
        --    ])
        --isSimplifiable crossPiece
        --  `shouldEqual` Just (Connection $ M.fromFoldable
        --    [ Tuple Direction.Down Direction.Right
        --    , Tuple Direction.Up Direction.Left
        --    ])

      it "reaches superPiece by adapting an output onto every remaining direction" do
        adapt Direction.Down (inputPort OneBit)
          (adapt Direction.Up (inputPort OneBit) idPiece)
          `shouldEqual` superPiece

    describe "superPiece" do
      it "has Left as its only input and every other direction as an output" do
        getInputDirs superPiece `shouldEqual` S.fromFoldable [ Direction.Left ]
        getOutputDirs superPiece `shouldEqual` S.fromFoldable [ Direction.Up, Direction.Right, Direction.Down ]

      it "broadcasts its input signal to all three outputs" do
        testEval superPiece
          (Frame.singleton zero Direction.Left one)
          ( Frame.fromFoldable zero
              [ Tuple Direction.Up one
              , Tuple Direction.Right one
              , Tuple Direction.Down one
              ]
          )
        testEval superPiece
          (Frame.singleton zero Direction.Left zero)
          ( Frame.fromFoldable zero
              [ Tuple Direction.Up zero
              , Tuple Direction.Right zero
              , Tuple Direction.Down zero
              ]
          )

      it "is already maximally adapted: adding an output it already has is a no-op" do
        for_ [ Direction.Up, Direction.Right, Direction.Down ] \dir ->
          adapt dir (inputPort OneBit) superPiece `shouldEqual` superPiece

      it "can't adapt on its input side, regardless of port type" do
        for_ [ noPort, inputPort OneBit, outputPort OneBit ] \port ->
          adapt Direction.Left port superPiece `shouldEqual` superPiece

      it "can shrink again once an output is no longer needed" do
        getOutputDirs (adapt Direction.Up noPort superPiece)
          `shouldEqual` S.fromFoldable [ Direction.Right, Direction.Down ]



