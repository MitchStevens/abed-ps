module Component.Marginalia.Types where

import Prelude

import Data.List.NonEmpty as L
import Data.List.NonEmpty as NE
import Data.List.Types (List(..), NonEmptyList(..))
import Data.Predicate (Predicate)
import Data.Time.Duration (Seconds(..))
import Game.GameEvent (GameEvent)

{-
  Marginalia (singular: Marginalium) are little messages in the margin of a book. ABED uses marginalia to provide feedback to the user. It is non-trivial to trigger the display/hiding of Marginalia.

  All marginalia have an initial trigger. These triggers can be:
    - GameEvents: either single game events or collections of game events
    - The 

  Marginalia are hidden when either:
    - the marginalia has been displayed for longer then `maxTimeToDisplay`, or
    - a game event that matches `hideOn` has been fired
-}

type MarginaliumDescription =
  { message :: String
  , leadTime :: Seconds           -- how long should we wait before displaying marginalium after the level is loaded?
  , maxTimeToDisplay :: Seconds   -- how long should the message be shown
  , removeOn :: Predicate GameEvent -- under what `GameEvent`s should the marginalium be cancelled?
  }

data MarginaliaNode
  = Description MarginaliumDescription
  | WaitingOn (Predicate GameEvent)

type Marginalia = NonEmptyList MarginaliaNode

marginalia :: Predicate GameEvent -> MarginaliumDescription -> Marginalia
marginalia predicate marginaliaDescription = 
  NE.cons' (WaitingOn predicate) Nil
    `chain` marginaliaDescription

description :: String -> Predicate GameEvent -> MarginaliumDescription
description message removeOn =
  { message
  , leadTime: Seconds 0.0 --Seconds 10.0
  , maxTimeToDisplay: Seconds 100000.0 --Seconds 20.0
  , removeOn
  }

chain :: Marginalia -> MarginaliumDescription -> Marginalia
chain marginalia description =
  L.snoc marginalia (Description description)

waitingOn :: Marginalia -> Predicate GameEvent -> Marginalia
waitingOn marginalia predicate =
  L.snoc marginalia (WaitingOn predicate)