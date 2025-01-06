module Test.Game.Piece.WirePiece where

import Prelude

import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction as Direction
import Game.Piece (Simplification(..), chickenPiece, crossPiece, getInputDirs, getOutputDirs, getPorts, idPiece, isSimplifiable, leftPiece, updatePort)
import Game.Port (inputPort, outputPort)
import Game.Port as PortType
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (fail, shouldEqual)

spec :: Spec Unit
spec =
  describe "Game.Piece.WirePiece" do
    describe "WirePiece" do
      it "leftPiece" do
        getInputDirs leftPiece `shouldEqual` S.fromFoldable [Direction.Left]
        getOutputDirs leftPiece `shouldEqual` S.fromFoldable [ Direction.Up ]

    describe "isSimplifiable" do
      it "should simplify wire pieces" do
        isSimplifiable idPiece
          `shouldEqual` Just (Connection $ M.singleton Direction.Right Direction.Left)
        isSimplifiable leftPiece
          `shouldEqual` Just (Connection $ M.singleton Direction.Up Direction.Left)

    describe "updatePort" do
      it "should add an output when a port is found" do
        getPorts idPiece `shouldEqual`
          M.fromFoldable
            [ Tuple Direction.Left (inputPort OneBit)
            , Tuple Direction.Right (outputPort OneBit)
            ]

        case updatePort Direction.Down (Just PortType.Input) idPiece of
          Nothing -> fail "expected to be able to open"
          Just piece -> getPorts piece `shouldEqual`
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

  



