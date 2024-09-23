module Test.Game.Signal where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow)
import Control.Monad.Gen (class MonadGen, chooseInt)
import Data.Array (fold)
import Data.Foldable (for_)
import Data.HeytingAlgebra (ff, tt)
import Effect.Class (liftEffect)
import Effect.Exception (Error)
import Game.Capacity (Capacity(..))
import Game.Signal (Base(..), Signal(..), SignalRepresentation(..), canonical, equivalent, mkSignal, printSignal)
import Test.QuickCheck.Gen (randomSample)
import Test.Spec (Spec, describe, it, pending)
import Test.Spec.Assertions (fail, shouldEqual, shouldNotEqual)
import Test.Spec.QuickCheck (quickCheck)

genSignal :: forall g. MonadGen g => g Signal
genSignal = mkSignal <$> chooseInt 0 255

shouldBeEquivalentTo :: forall m. MonadThrow Error m => Capacity -> Signal -> Signal -> m Unit
shouldBeEquivalentTo capacity recieved expected = 
  if equivalent capacity recieved expected
    then pure unit
    else fail $ fold 
      [ "recieved signal "
      , show recieved
      , " is not equivalent to expected signal "
      , show expected
      ]


spec :: Spec Unit
spec = do
  describe "Game.Signal" do
    it "show" do
      show (mkSignal 0)  `shouldEqual` "00"
      show (mkSignal 1)  `shouldEqual` "01"
      show (mkSignal 15) `shouldEqual` "0f"
      show (mkSignal 16) `shouldEqual` "10"
      show (mkSignal (-1)) `shouldEqual` "ff"
    --it "nthBit" do
    --  let signal = Signal 21
    --  nthBit signal 0 `shouldEqual` true
    --  nthBit signal 1 `shouldEqual` false
    --  nthBit signal 2 `shouldEqual` true
    --  nthBit signal 3 `shouldEqual` false
    --  nthBit signal 4 `shouldEqual` true
    --  nthBit signal 5 `shouldEqual` false
    --  nthBit signal 6 `shouldEqual` false
    --  nthBit signal 7 `shouldEqual` false
    pending "toInt"
    describe "canonical" do
      it "should do nothing when signal is positive and within capacity" do
        canonical OneBit zero `shouldEqual` zero
        canonical OneBit one `shouldEqual` one
        canonical FourBit (mkSignal 5) `shouldEqual` (mkSignal 5)

      it "should take modulus when signal is positive and over capacity" do
        canonical OneBit (mkSignal 5) `shouldEqual` one
        canonical TwoBit (mkSignal 5) `shouldEqual` one

      it "should return different values for different bases" do
        canonical OneBit tt `shouldEqual` (mkSignal 1)
        canonical TwoBit tt `shouldEqual` (mkSignal 3)
        canonical FourBit tt `shouldEqual` (mkSignal 15)
        canonical EightBit tt `shouldEqual` (mkSignal 255)

      it "should be idempotent" do
        signals <- liftEffect $ randomSample genSignal
        for_ signals \signal ->
          for_ [OneBit, TwoBit, FourBit, EightBit] \capacity -> do
            let f = canonical capacity
            f (f signal) `shouldEqual` f signal


    describe "printSignal" do
      it "should print single chars for one bit binary signals" do
        printSignal (SignalRepresentation Binary OneBit) ff `shouldEqual` "0"
        printSignal (SignalRepresentation Binary OneBit) tt `shouldEqual` "1"
      it "should print two chars for two bit binary signals" do
        printSignal (SignalRepresentation Binary TwoBit) (mkSignal 0) `shouldEqual` "00"
        printSignal (SignalRepresentation Binary TwoBit) (mkSignal 1) `shouldEqual` "01"
        printSignal (SignalRepresentation Binary TwoBit) (mkSignal 2) `shouldEqual` "10"
        printSignal (SignalRepresentation Binary TwoBit) (mkSignal 3) `shouldEqual` "11"
      it "should print decimal signals" do
        printSignal (SignalRepresentation Decimal OneBit)   (mkSignal 0) `shouldEqual` "0"
        printSignal (SignalRepresentation Decimal TwoBit)   (mkSignal 0) `shouldEqual` "0"
        printSignal (SignalRepresentation Decimal FourBit)  (mkSignal 0) `shouldEqual` "00"
        printSignal (SignalRepresentation Decimal EightBit) (mkSignal 0) `shouldEqual` "000"

        printSignal (SignalRepresentation Decimal OneBit)   (mkSignal 3) `shouldEqual` "1"
        printSignal (SignalRepresentation Decimal TwoBit)   (mkSignal 3) `shouldEqual` "3"
        printSignal (SignalRepresentation Decimal FourBit)  (mkSignal 3) `shouldEqual` "03"
        printSignal (SignalRepresentation Decimal EightBit) (mkSignal 3) `shouldEqual` "003"

        printSignal (SignalRepresentation Decimal OneBit)   (mkSignal 5) `shouldEqual` "1"
        printSignal (SignalRepresentation Decimal TwoBit)   (mkSignal 5) `shouldEqual` "1"
        printSignal (SignalRepresentation Decimal FourBit)  (mkSignal 5) `shouldEqual` "05"
        printSignal (SignalRepresentation Decimal EightBit) (mkSignal 5) `shouldEqual` "005"

