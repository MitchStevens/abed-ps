module Test.Game.Level where

import Prelude

import Game.Level (Level(..), mkLevel)
import Test.Spec (Spec, describe, describeOnly, it)
import Test.Spec.Assertions (shouldEqual)

spec :: Spec Unit
spec = do
  describe "Level" do
    describe "mkLevel" do
      it "" do
        let Level l = mkLevel { }
        l.name `shouldEqual` "default name"
      it "" do
        let Level l = mkLevel { name: "test name"}
        l.name `shouldEqual` "test name"



--mkLevel :: forall r1 r2 r3. Union r1 r2 r3 => Newtype Level (Record r3) =>
--  Record r1 -> Level
--mkLevel level = Level (unsafeUnion defaultLevel level)
--  where
--    defaultLevel = 
--      { name: "default name"
--      , goal: idPiece
--      , description: "default description"
--      , testCases: []
--      , requiresAutomaticTesting: false
--      , availablePieces: []
--      , conversation: (pure unit :: Conversation)
--      , otherRestrictions: []
--      , unlocksUponCompletion: []
--      , enableBoardSizeChange: true
--      }