module Game.Level.GenerateTestCases
  ( allTestCases
  , someTestCases
  )
  where

import Prelude

import Control.Alternative (guard)
import Control.Apply (lift2)
import Control.Monad.Gen.Trans (Gen, arrayOf, chooseInt, evalGen)
import Data.Array (range, (..))
import Data.FoldableWithIndex (foldlWithIndex, foldrWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Traversable (for)
import Data.TraversableWithIndex (forWithIndex)
import Game.Piece (Piece(..), getInputDirs, getPorts)
import Game.Piece.Capacity (maxValue)
import Game.Piece.Direction (CardinalDirection)
import Game.Piece.Port (Port(..), isInput, portCapacity)
import Game.Piece.Signal (Signal(..))
import Random.LCG (Seed, mkSeed)

seed :: Seed
seed = mkSeed 1

--portSignals :: Port -> Array Signal
--portSignals port = do
--  let Signal n = maxValue (portCapacity port)
--  pure $ Signal <$> range 0 n

{-
  When a piece has a small domain, we can simply test all of the possible inputs to ensure that the board fits the spec.
-}
allTestCases :: Piece -> Array (Map CardinalDirection Signal)
allTestCases piece = foldrWithIndex appendInputs [M.empty] (getPorts piece)
  where
    appendInputs dir port tests =
      if isInput port
        then do
          let Signal n = maxValue (portCapacity port)
          signal <- Signal <$> range 0 n
          test <- tests
          pure $ M.union (M.singleton dir signal) test
        else tests

someTestCases :: Int -> Piece -> Array (Map CardinalDirection Signal)
someTestCases size piece = evalGen (arrayOf (generateRandomTestCase piece)) { newSeed: seed, size }

generateRandomTestCase :: Piece -> Gen (Map CardinalDirection Signal)
generateRandomTestCase piece = do
  let inputs = M.filter isInput (getPorts piece)
  for inputs \port -> do
    let Signal n = maxValue (portCapacity port)
    Signal <$> chooseInt 0 n
    


