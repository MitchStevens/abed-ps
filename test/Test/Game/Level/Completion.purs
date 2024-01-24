module Test.Game.Level.Completion where

import Prelude

import Control.Monad.Gen (oneOf)
import Data.Array.NonEmpty (cons')
import Game.Level.Completion (PortMismatch(..))
import Test.Game.Capacity (genCapacity)
import Test.Game.Directions (genDirection)
import Test.Game.Port (genPort, genPortType)
import Test.QuickCheck.Gen (Gen, suchThat)

genPortMismatch :: Gen PortMismatch
genPortMismatch = (oneOf $ cons'
  ( map PortExpected      $ { direction: _, expected: _ } <$> genDirection <*> genPort )
  [ map NoPortExpected    $ { direction: _, received: _ } <$> genDirection <*> genPort
  , map IncorrectPortType $ { direction: _, capacity: _, received: _, expected: _ } <$> genDirection <*> genCapacity <*> genPortType <*> genPortType
  , map IncorrectCapacity $ { direction: _, portType: _, received: _, expected: _ } <$> genDirection <*> genPortType <*> genCapacity <*> genCapacity
  ] ) `suchThat` validPortMismatch

validPortMismatch :: PortMismatch -> Boolean
validPortMismatch = case _ of
  PortExpected { direction, expected  } -> true
  NoPortExpected { direction , received  } -> true
  IncorrectPortType { direction , capacity , received , expected  } -> received /= expected
  IncorrectCapacity { direction , portType , received , expected  } -> received /= expected