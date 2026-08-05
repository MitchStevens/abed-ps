module Test.Game.Piece.WirePiece where

import Prelude

import Data.Foldable (for_)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Piece (Simplification(..), adapt, getInputDirs, getOutputDirs, getPorts, idPiece, isSimplifiable, leftPiece, superPiece)
import Game.Port (inputPort, outputPort)
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
          M.fromFoldable
            [ Tuple Direction.Left (inputPort OneBit)
            , Tuple Direction.Right (outputPort OneBit)
            ]

        getPorts (adapt Direction.Down (Just PortType.Input) idPiece)
          `shouldEqual`
            M.fromFoldable
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
        adapt Direction.Down (Just PortType.Input)
          (adapt Direction.Up (Just PortType.Input) idPiece)
          `shouldEqual` superPiece

    describe "superPiece" do
      it "has Left as its only input and every other direction as an output" do
        getInputDirs superPiece `shouldEqual` S.fromFoldable [ Direction.Left ]
        getOutputDirs superPiece `shouldEqual` S.fromFoldable [ Direction.Up, Direction.Right, Direction.Down ]

      it "broadcasts its input signal to all three outputs" do
        testEval superPiece
          (M.singleton Direction.Left one)
          ( M.fromFoldable
              [ Tuple Direction.Up one
              , Tuple Direction.Right one
              , Tuple Direction.Down one
              ]
          )
        testEval superPiece
          (M.singleton Direction.Left zero)
          ( M.fromFoldable
              [ Tuple Direction.Up zero
              , Tuple Direction.Right zero
              , Tuple Direction.Down zero
              ]
          )

      it "is already maximally adapted: adding an output it already has is a no-op" do
        for_ [ Direction.Up, Direction.Right, Direction.Down ] \dir ->
          adapt dir (Just PortType.Input) superPiece `shouldEqual` superPiece

      it "can't adapt on its input side, regardless of port type" do
        for_ [ Nothing, Just PortType.Input, Just PortType.Output ] \portType ->
          adapt Direction.Left portType superPiece `shouldEqual` superPiece

      it "can shrink again once an output is no longer needed" do
        getOutputDirs (adapt Direction.Up Nothing superPiece)
          `shouldEqual` S.fromFoldable [ Direction.Right, Direction.Down ]



