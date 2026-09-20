module Test.Game.Piece where

import Prelude

import Control.Alternative (guard)
import Control.Monad.Error.Class (class MonadError, class MonadThrow, catchError, throwError)
import Data.Array (fold)
import Data.Array as A
import Data.Foldable (find, for_)
import Data.FoldableWithIndex (allWithIndex, forWithIndex_)
import Data.Functor (($>))
import Data.FunctorWithIndex (mapWithIndex)
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Effect.Exception (Error)
import Game.Capacity (Capacity)
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Piece (Piece(..), allPieces, eval, getPorts, name, pieceVault, truncateInputs)
import Game.Port (isWritable, portCapacity)
import Game.Signal (Signal, equivalent)
import Test.Game.Signal (shouldBeEquivalentTo)
import Test.QuickCheck (Result(..), arbitrary, assertEquals, withHelp)
import Test.QuickCheck.Gen (Gen)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (fail, shouldEqual)
import Text.Printf (printf)
import Type.Proxy (Proxy(..))

testEval :: forall m. MonadError Error m => Piece -> Frame Signal -> Frame Signal -> m Unit
testEval piece inputs expected = do
  let recieved = eval piece inputs 
  forWithIndex_ (portCapacity <$> getPorts piece) \dir capacity -> 
    shouldBeEquivalentTo capacity (Frame.index dir expected) (Frame.index dir recieved)
      `catchError` \e ->
        throwError e *> (fail $ " in direction " <> show dir)

spec :: Spec Unit
spec =
  describe "Game.Piece" do
    it "piece names are unique" do
      A.length allPieces `shouldEqual` M.size pieceVault

genSignals :: Gen (Frame Signal)
genSignals = arbitrary

equivalentTo :: Piece -> Piece -> Gen Result
equivalentTo p1 p2 = do
  inputs <- genSignals
  pure $ eval p1 inputs `assertEquals` eval p2 inputs

isLessAdaptedOrEqualTo :: Piece -> Piece -> Gen Result
isLessAdaptedOrEqualTo p1 p2 = do
  inputs <- truncateInputs p1 <$> genSignals
  let outs1 = eval p1 inputs
  let outs2 = eval p2 inputs
  -- only the sides `p1` actually writes: `outs1` is total, so it says
  -- nothing on the others
  let le = flip allWithIndex outs1 \dir signal ->
         not (isWritable (Frame.index dir (getPorts p1))) || signal == Frame.index dir outs2

  if le
    then pure $ Success
    else pure $ Failed $ show { p1, p2, inputs, outs1, outs2 }